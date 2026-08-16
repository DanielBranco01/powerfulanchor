"""
Converts the Digitus/Assmann distributor price list (PL1_Portuguese_*.xlsx) into the
JSON data files consumed by lib/catalogue.ts.

Usage:
    python scripts/import-pricelist.py "../PL1_Portuguese_37208_2026-06-19.xlsx"

Re-run this whenever a new price list arrives to regenerate lib/data/*.
"""

import json
import re
import sys
from pathlib import Path

import openpyxl

SCRIPT_DIR = Path(__file__).resolve().parent
DATA_DIR = SCRIPT_DIR.parent / "lib" / "data"
SPECS_DIR = DATA_DIR / "specs"

# --- column indices in the "flat list" sheet (0-based) ---
COL_REF = 0
COL_BRAND = 3
COL_NAME = 4
COL_DESC_LINE = 5
COL_GROUP1 = 6
COL_GROUP2 = 7
COL_HIGHLIGHTS = 23
COL_TECH_DETAILS = 25
COL_IMG_FRONT = 28

MAX_SPECS = 20
MAX_DESC_LEN = 260

# Excel "Product group level 1" -> site category
GROUP1_TO_CATEGORY = {
    "Técnica de rede": "tecnica-de-rede",
    "Armários de rede e servidor": "armarios-de-rede-e-servidor",
    "Tecnologia de meios AV": "tecnologia-de-meios-av",
    "Cabos e periféricos": "cabos-e-perifericos",
}

CATEGORIES = [
    {
        "key": "Redes de Dados",
        "slug": "tecnica-de-rede",
        "cls": "c1",
        "desc": "Switches, cablagem estruturada, patch panels e componentes de rede.",
        "icon": '<rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01M10 18h.01"/><path d="M8 14V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>',
    },
    {
        "key": "Armários e Servidores",
        "slug": "armarios-de-rede-e-servidor",
        "cls": "c5",
        "desc": "Bastidores, armários de rede e servidor, PDUs, KVM e acessórios de instalação.",
        "icon": '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M4 8h16M4 14h16"/><path d="M8 5h.01M8 11h.01M8 17h.01"/>',
    },
    {
        "key": "Áudio e Vídeo",
        "slug": "tecnologia-de-meios-av",
        "cls": "c2",
        "desc": "Distribuição, extensão e comutação de sinal AV para ambientes profissionais.",
        "icon": '<path d="M3 8v8M7 5v14M12 3v18M17 6v12M21 9v6"/>',
    },
    {
        "key": "Cablagem e Acessórios",
        "slug": "cabos-e-perifericos",
        "cls": "c4",
        "desc": "Cabo, periféricos USB, gestão, identificação e vedação — de HellermannTyton, Brady e Roxtec.",
        "icon": '<path d="M4 4v6a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v2M4 4h4M20 20h-4"/>',
    },
    {
        "key": "Sistemas de RF",
        "slug": "sistemas-de-rf",
        "cls": "c3",
        "desc": "Antenas, cabos coaxiais e conectores para comunicações por radiofrequência.",
        "icon": '<circle cx="12" cy="12" r="2"/><path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"/>',
    },
]

# Hand-curated products whose brand/specs are real (not the Excel's
# "(Especificações ilustrativas.)" placeholders) and aren't covered by the
# Digitus/Fluke price list, so they're kept and merged in alongside it.
#
# Note: the RFS/Sistemas de RF entries formerly hard-coded here now come from
# the full RFS catalogue import — see scripts/import-rfs-products.py, which
# owns every product whose `cat` is "Sistemas de RF" and must run after this
# script (it replaces, not merges, that category's products).
LEGACY_PRODUCTS = [
    {
        "id": "rm60",
        "name": "Módulo de vedação Roxtec RM 60",
        "brand": "Roxtec",
        "cat_slug": "cabos-e-perifericos",
        "subcat": "Vedação",
        "ref": "RM00100601000",
        "desc": "Módulo Roxtec com tecnologia Multidiameter™, adaptável ao diâmetro do cabo através de camadas removíveis. Vedação de cabos e tubos em transições.",
        "img": "https://cdn.content-publisher.roxtec.com/images/image:837/529332_523953_RM%2060.jpg",
        "stock": "in",
        "specs": [
            ["Tipo", "Módulo multidiâmetro (Multidiameter™)"],
            ["Diâmetro de cabo", "Ø 28–54 mm"],
            ["Material", "Elastómero (EPDM)"],
            ["Adaptação", "Camadas removíveis (peel-off)"],
            ["Aplicação", "Vedação em transições de cabos/tubos"],
        ],
    },
    {
        "id": "rm30",
        "name": "Módulo de vedação Roxtec RM 30",
        "brand": "Roxtec",
        "cat_slug": "cabos-e-perifericos",
        "subcat": "Vedação",
        "ref": "RM00100301000",
        "desc": "Módulo Roxtec com Multidiameter™ para cabos de diâmetro médio. (Diâmetros ilustrativos.)",
        "img": "https://cdn.content-publisher.roxtec.com/images/image:835/529328_522107_00835_res.jpg",
        "stock": "in",
        "specs": [
            ["Tipo", "Módulo multidiâmetro (Multidiameter™)"],
            ["Diâmetro de cabo", "Ø 10–25 mm"],
            ["Material", "Elastómero (EPDM)"],
            ["Adaptação", "Camadas removíveis (peel-off)"],
        ],
    },
]


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


def parse_specs(tech_details: str) -> list[list[str]]:
    if not tech_details:
        return []
    specs: list[list[str]] = []
    for line in tech_details.split("\n"):
        line = line.strip().lstrip("•").strip()
        if not line or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if not key or not value:
            continue
        specs.append([key, value])
        if len(specs) >= MAX_SPECS:
            break
    return specs


def main(xlsx_path: Path) -> None:
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb["flat list"]

    index: list[dict] = []
    specs_by_category: dict[str, dict[str, list[list[str]]]] = {
        c["slug"]: {} for c in CATEGORIES
    }
    counts: dict[str, int] = {c["slug"]: 0 for c in CATEGORIES}
    seen_ids: set[str] = set()

    for row in ws.iter_rows(min_row=4, values_only=True):
        ref = row[COL_REF]
        if not ref:
            continue
        group1 = row[COL_GROUP1]
        cat_slug = GROUP1_TO_CATEGORY.get(group1)
        if not cat_slug:
            continue

        pid = slugify(str(ref))
        if pid in seen_ids:
            continue
        seen_ids.add(pid)

        name = (row[COL_NAME] or "").strip()
        desc_source = row[COL_HIGHLIGHTS] or row[COL_DESC_LINE] or name
        subcat = (row[COL_GROUP2] or group1 or "Outros").strip()
        img = row[COL_IMG_FRONT] or None

        index.append(
            {
                "id": pid,
                "name": name,
                "brand": (row[COL_BRAND] or "").strip(),
                "cat": next(c["key"] for c in CATEGORIES if c["slug"] == cat_slug),
                "subcat": subcat,
                "ref": str(ref),
                "desc": truncate(desc_source, MAX_DESC_LEN),
                "img": img,
                "stock": "order",
            }
        )
        specs_by_category[cat_slug][pid] = parse_specs(row[COL_TECH_DETAILS])
        counts[cat_slug] += 1

    for legacy in LEGACY_PRODUCTS:
        cat_slug = legacy["cat_slug"]
        cat_key = next(c["key"] for c in CATEGORIES if c["slug"] == cat_slug)
        index.append(
            {
                "id": legacy["id"],
                "name": legacy["name"],
                "brand": legacy["brand"],
                "cat": cat_key,
                "subcat": legacy["subcat"],
                "ref": legacy["ref"],
                "desc": legacy["desc"],
                "img": legacy["img"],
                "stock": legacy["stock"],
            }
        )
        specs_by_category[cat_slug][legacy["id"]] = legacy["specs"]
        counts[cat_slug] += 1

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SPECS_DIR.mkdir(parents=True, exist_ok=True)

    categories_out = [
        {k: c[k] for k in ("key", "slug", "cls", "desc", "icon")} for c in CATEGORIES
    ]
    (DATA_DIR / "categories.json").write_text(
        json.dumps(categories_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (DATA_DIR / "products-index.json").write_text(
        json.dumps(index, ensure_ascii=False), encoding="utf-8"
    )
    for cat in CATEGORIES:
        slug = cat["slug"]
        (SPECS_DIR / f"{slug}.json").write_text(
            json.dumps(specs_by_category[slug], ensure_ascii=False), encoding="utf-8"
        )

    # Small category + subcategory-name summary for the site nav's mega menu —
    # kept separate from products-index.json (~1MB) so the global <Nav> doesn't
    # have to bundle the full product catalogue just to render a dropdown.
    subcats_by_cat: dict[str, set[str]] = {c["slug"]: set() for c in CATEGORIES}
    for p in index:
        cat_slug = next(c["slug"] for c in CATEGORIES if c["key"] == p["cat"])
        subcats_by_cat[cat_slug].add(p["subcat"])
    nav_out = [
        {
            "key": c["key"],
            "slug": c["slug"],
            "cls": c["cls"],
            "icon": c["icon"],
            "subcats": sorted(subcats_by_cat[c["slug"]]),
        }
        for c in CATEGORIES
    ]
    (DATA_DIR / "nav-categories.json").write_text(
        json.dumps(nav_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Products: {len(index)}")
    for cat in CATEGORIES:
        print(f"  {cat['key']}: {counts[cat['slug']]}")


if __name__ == "__main__":
    xlsx_arg = sys.argv[1] if len(sys.argv) > 1 else "../PL1_Portuguese_37208_2026-06-19.xlsx"
    main((SCRIPT_DIR / xlsx_arg).resolve())
