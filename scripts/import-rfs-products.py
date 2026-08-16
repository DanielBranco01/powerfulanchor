"""
Imports the RFS product catalogue (Produtos_RFS_Fichas_Tecnicas.xlsx, produced by
scraping rfsworld.com datasheets) into the "Sistemas de RF" category of
lib/data/products-index.json, lib/data/specs/sistemas-de-rf.json and
lib/data/nav-categories.json.

The Excel's "Categoria" column (Cabos, Conectores/Adaptadores, Guias de Onda,
Ferramentas, Ferragens/Grampos, Impermeabilização, Outros, Jumper) becomes each
product's `subcat` ("Tipo") within Sistemas de RF.

Re-running this script is idempotent: it replaces every existing product whose
`cat` is "Sistemas de RF" (including the old hand-curated `lcf12-50j` entry)
with a fresh import from the Excel.

Usage:
    python scripts/import-rfs-products.py "../../Produtos_RFS_Fichas_Tecnicas.xlsx"
"""

import json
import re
import sys
from pathlib import Path

import openpyxl

SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "lib" / "data"
SPECS_DIR = DATA_DIR / "specs"

CAT_KEY = "Sistemas de RF"
CAT_SLUG = "sistemas-de-rf"

MAX_SPECS = 20
MAX_DESC_LEN = 260

# Column order matches compile_excel.py's `headers` list (0-based).
COL_REF = 0
COL_CATEGORIA = 1
COL_DENOMINACAO = 2
COL_TITULO = 8
COL_ESPECIFICACOES = 10
COL_LINK_IMAGEM = 12
COL_ESTADO = 13


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def truncate(text: str, max_len: int) -> str:
    text = (text or "").strip()
    if len(text) <= max_len:
        return text
    cut = text[:max_len].rsplit(" ", 1)[0]
    return cut + "…"


def parse_specs(cell: str) -> list[list[str]]:
    if not cell:
        return []
    specs: list[list[str]] = []
    for part in cell.split(" | "):
        if ":" not in part:
            continue
        key, _, value = part.partition(":")
        key, value = key.strip(), value.strip()
        if not key or not value:
            continue
        specs.append([key, value])
        if len(specs) >= MAX_SPECS:
            break
    return specs


def main(xlsx_path: Path) -> None:
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb["Produtos RFS"]

    new_products: list[dict] = []
    specs_by_id: dict[str, list[list[str]]] = {}
    seen_ids: set[str] = set()
    subcats: set[str] = set()

    for row in ws.iter_rows(min_row=2, values_only=True):
        ref = row[COL_REF]
        if not ref:
            continue

        pid = slugify(str(ref))
        if pid in seen_ids:
            # Extremely unlikely (all 343 source codes are unique pre-slug),
            # but keep the import safe if two codes ever collapse to one slug.
            suffix = 2
            while f"{pid}-{suffix}" in seen_ids:
                suffix += 1
            pid = f"{pid}-{suffix}"
        seen_ids.add(pid)

        categoria = (row[COL_CATEGORIA] or "Outros").strip()
        subcats.add(categoria)

        titulo = (row[COL_TITULO] or "").strip()
        denominacao = (row[COL_DENOMINACAO] or "").strip()
        name = titulo or denominacao or str(ref)
        desc_source = titulo or denominacao or name
        estado = (row[COL_ESTADO] or "").strip()
        img = row[COL_LINK_IMAGEM] or None

        new_products.append(
            {
                "id": pid,
                "name": name,
                "brand": "RFS",
                "cat": CAT_KEY,
                "subcat": categoria,
                "ref": str(ref),
                "desc": truncate(desc_source, MAX_DESC_LEN),
                "img": img,
                "stock": "order",
            }
        )
        specs_by_id[pid] = parse_specs(row[COL_ESPECIFICACOES])

    # --- merge into products-index.json (replace any prior Sistemas de RF entries) ---
    index_path = DATA_DIR / "products-index.json"
    existing_index = json.loads(index_path.read_text(encoding="utf-8"))
    kept = [p for p in existing_index if p["cat"] != CAT_KEY]
    merged_index = kept + new_products
    index_path.write_text(json.dumps(merged_index, ensure_ascii=False), encoding="utf-8")

    # --- specs/sistemas-de-rf.json: fully replaced by this import ---
    (SPECS_DIR / f"{CAT_SLUG}.json").write_text(
        json.dumps(specs_by_id, ensure_ascii=False), encoding="utf-8"
    )

    # --- nav-categories.json: refresh only the Sistemas de RF subcats list ---
    nav_path = DATA_DIR / "nav-categories.json"
    nav = json.loads(nav_path.read_text(encoding="utf-8"))
    for entry in nav:
        if entry["slug"] == CAT_SLUG:
            entry["subcats"] = sorted(subcats)
    nav_path.write_text(json.dumps(nav, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Sistemas de RF products imported: {len(new_products)}")
    print(f"Total catalogue products: {len(merged_index)}")
    print("Subcategories (Tipos):")
    for s in sorted(subcats):
        count = sum(1 for p in new_products if p["subcat"] == s)
        print(f"  {s}: {count}")
    with_img = sum(1 for p in new_products if p["img"])
    with_specs = sum(1 for pid, s in specs_by_id.items() if s)
    print(f"With image: {with_img} | With specs: {with_specs}")


if __name__ == "__main__":
    xlsx_arg = (
        sys.argv[1] if len(sys.argv) > 1 else "../../Produtos_RFS_Fichas_Tecnicas.xlsx"
    )
    main((SCRIPT_DIR / xlsx_arg).resolve())
