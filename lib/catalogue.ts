import categoriesData from "./data/categories.json";
import productsIndex from "./data/products-index.json";

export type StockKey = "in" | "low" | "order";

export type Category = {
  key: string;
  slug: string;
  cls: string;
  desc: string;
  /** Inner SVG markup (paths) drawn inside a 24×24 stroked <svg>. */
  icon: string;
};

/** Lightweight product record — everything needed for browsing, search and the basket. */
export type Product = {
  id: string;
  name: string;
  brand: string;
  cat: string;
  ref: string;
  desc: string;
  img: string | null;
  specs: [string, string][];
  subcat: string;
  stock: StockKey;
};

export type ProductSummary = Omit<Product, "specs">;

export const CATEGORIES: Category[] = categoriesData;

const CAT_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.slug])
);

/**
 * Lightweight catalogue index (name, brand, category, image, stock…) for every
 * product — kept eager so search/filter/basket work synchronously across the
 * whole catalogue. Technical specs are the heavy part of each product record
 * (parsed from the distributor price list) and are NOT included here: they're
 * split into one JSON file per category under `data/specs/`, fetched on demand
 * only when a product's detail page is opened. Re-run
 * `scripts/import-pricelist.py` to regenerate both from an updated price list.
 */
export const PRODUCTS: ProductSummary[] = productsIndex as ProductSummary[];

const specsCache = new Map<string, Promise<Record<string, [string, string][]>>>();

function loadSpecsForCategory(catKey: string): Promise<Record<string, [string, string][]>> {
  const slug = CAT_SLUG[catKey];
  if (!slug) return Promise.resolve({});
  let pending = specsCache.get(slug);
  if (!pending) {
    pending = import(`./data/specs/${slug}.json`).then(
      (mod) => mod.default as Record<string, [string, string][]>
    );
    specsCache.set(slug, pending);
  }
  return pending;
}

export const getProduct = (id: string): ProductSummary | undefined =>
  PRODUCTS.find((p) => p.id === id);

/** Resolves the full product record, including technical specs, loading the
 * owning category's specs chunk on demand. */
export async function getProductDetail(id: string): Promise<Product | undefined> {
  const summary = getProduct(id);
  if (!summary) return undefined;
  const specsByProduct = await loadSpecsForCategory(summary.cat);
  return { ...summary, specs: specsByProduct[id] ?? [] };
}

export const STOCK_META: Record<StockKey, { label: string; cls: string }> = {
  in: { label: "Em stock", cls: "s-in" },
  low: { label: "Stock reduzido", cls: "s-low" },
  order: { label: "Sob encomenda", cls: "s-order" },
};

export const DEFAULT_ICON = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>';

const CAT_ICON: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.icon])
);

export const catIcon = (cat: string): string => CAT_ICON[cat] ?? DEFAULT_ICON;

export const countByCat = (key: string): number =>
  PRODUCTS.filter((p) => p.cat === key).length;

export type SubcategorySummary = { name: string; count: number };

export const getSubcategories = (catKey: string): SubcategorySummary[] => {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS) {
    if (p.cat !== catKey) continue;
    counts.set(p.subcat, (counts.get(p.subcat) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
