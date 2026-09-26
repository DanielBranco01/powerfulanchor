/**
 * Sincroniza o catálogo do site com a base de dados do ERP (Supabase).
 * Fonte: função pública `catalogo_publico()` (sem preços/custos, stock só real).
 * Reescreve lib/data/products-index.json e lib/data/specs/<categoria>.json.
 * NÃO toca em categories.json nem em nav-categories.json (estrutura/estilos do site).
 *
 * Uso (na raiz do site):
 *   node scripts/sync-catalogue.mjs --check   # só compara e mostra diferenças
 *   node scripts/sync-catalogue.mjs --write   # escreve os ficheiros
 * Variáveis: ERP_SUPABASE_URL e ERP_SUPABASE_PUBLISHABLE_KEY (ambiente ou .env.local).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(path.join(root, f));
  } catch {
    /* opcional */
  }
}

const url = process.env.ERP_SUPABASE_URL;
const key = process.env.ERP_SUPABASE_PUBLISHABLE_KEY;
const write = process.argv.includes("--write");
if (!url || !key) {
  console.error("Defina ERP_SUPABASE_URL e ERP_SUPABASE_PUBLISHABLE_KEY.");
  process.exit(1);
}

const dataDir = path.join(root, "lib", "data");
const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const categories = readJson(path.join(dataDir, "categories.json"));
const slugOf = Object.fromEntries(categories.map((c) => [c.key, c.slug]));

async function fetchAll() {
  const rows = [];
  for (let off = 0; ; off += 1000) {
    const res = await fetch(`${url}/rest/v1/rpc/catalogo_publico`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_limit: 1000, p_offset: off }),
    });
    if (!res.ok) throw new Error(`catalogo_publico falhou (${res.status}): ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

const rows = await fetchAll();
console.log(`ERP: ${rows.length} produtos.`);

const old = readJson(path.join(dataDir, "products-index.json"));
const rank = new Map(old.map((p, i) => [p.id, i]));
const oldById = new Map(old.map((p) => [p.id, p]));

const index = rows
  .map((r) => ({
    id: r.id,
    name: r.name,
    brand: r.brand,
    cat: r.cat,
    subcat: r.subcat,
    ref: r.ref,
    desc: r.desc ?? "",
    img: r.img ?? null,
    stock: r.stock,
  }))
  .sort((a, b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9) || a.id.localeCompare(b.id));

const specsByCat = {};
for (const r of rows) {
  const slug = slugOf[r.cat];
  if (!slug) continue;
  (specsByCat[slug] ??= {})[r.id] = r.specs ?? [];
}

// diferenças face aos ficheiros atuais
const diff = { novos: 0, removidos: 0, alterados: 0 };
const exemplos = [];
const seen = new Set();
for (const p of index) {
  seen.add(p.id);
  const o = oldById.get(p.id);
  if (!o) diff.novos++;
  else if (JSON.stringify(o) !== JSON.stringify(p)) {
    diff.alterados++;
    if (exemplos.length < 5) {
      const campos = Object.keys(p).filter((k) => JSON.stringify(o[k]) !== JSON.stringify(p[k]));
      exemplos.push(`${p.id}: ${campos.join(", ")}`);
    }
  }
}
for (const o of old) if (!seen.has(o.id)) diff.removidos++;
console.log("Diferenças face a lib/data/products-index.json:", diff);
exemplos.forEach((e) => console.log("  ", e));

if (!write) {
  console.log("Modo --check: nada escrito. Use --write para atualizar os ficheiros.");
  process.exit(0);
}

writeFileSync(path.join(dataDir, "products-index.json"), JSON.stringify(index));
for (const [slug, map] of Object.entries(specsByCat)) {
  const f = path.join(dataDir, "specs", `${slug}.json`);
  if (existsSync(f)) writeFileSync(f, JSON.stringify(map));
}
console.log("Ficheiros atualizados.");
