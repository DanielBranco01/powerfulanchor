"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalogue";
import { DEFAULT_FILTERS, useCatalogue } from "./context";
import ProductCard from "./ProductCard";

const BRANDS = ["Digitus", "HellermannTyton", "RFS", "Brady", "Roxtec"];

export default function CatalogView() {
  const { filters, setFilters, showCats } = useCatalogue();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const meta = CATEGORIES.find((c) => c.key === filters.cat);

  const activeFilterCount = [
    filters.cat !== "all",
    filters.subcat !== "all",
    filters.brand !== "all",
    filters.stock !== "all",
  ].filter(Boolean).length;

  const subcats = useMemo(() => {
    if (filters.cat === "all") return [];
    const subs = [
      ...new Set(PRODUCTS.filter((p) => p.cat === filters.cat).map((p) => p.subcat)),
    ].sort();
    return subs.length < 2 ? [] : subs;
  }, [filters.cat]);

  const list = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (filters.brand !== "all" && p.brand !== filters.brand) return false;
      if (filters.cat !== "all" && p.cat !== filters.cat) return false;
      if (filters.subcat !== "all" && p.subcat !== filters.subcat) return false;
      if (filters.stock !== "all" && p.stock !== filters.stock) return false;
      if (q) {
        const t = `${p.name} ${p.brand} ${p.ref} ${p.cat} ${p.subcat}`.toLowerCase();
        if (!t.includes(q)) return false;
      }
      return true;
    });
    if (filters.sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === "brand")
      filtered.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
    return filtered;
  }, [filters]);

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="crumbs">
            <a onClick={showCats}>Produtos</a>
            <span className="sep">/</span>
            <span className="cur">{meta ? meta.key : "Todos"}</span>
          </div>
          <div className="head-row">
            <div className="head-text">
              <h1>{meta ? meta.key : "Todos os produtos"}</h1>
              <p>{meta ? meta.desc : "Toda a gama de produtos disponível."}</p>
            </div>
            <div className="searchbar">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar por nome, referência ou marca…"
                autoComplete="off"
                value={filters.q}
                onChange={(e) => setFilters({ q: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-body">
        <div className="wrap catalog-layout">
          <div
            className={`filter-backdrop${filtersOpen ? " show" : ""}`}
            onClick={() => setFiltersOpen(false)}
          />
          <aside className={`sidebar${filtersOpen ? " show" : ""}`}>
            <div className="sidebar-head">
              <h3>
                Filtros
                {activeFilterCount > 0 && <span className="fcount">{activeFilterCount}</span>}
              </h3>
              <button
                className="x"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar filtros"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sidebar-scroll">
              <div className="sidebar-group">
                <span className="fgroup-label">Categoria</span>
                <div className="sidebar-chips">
                  <button
                    className={`chip${filters.cat === "all" ? " active" : ""}`}
                    onClick={() => setFilters({ cat: "all", subcat: "all" })}
                  >
                    Todas
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      className={`chip${filters.cat === c.key ? " active" : ""}`}
                      onClick={() => setFilters({ cat: c.key, subcat: "all" })}
                    >
                      {c.key}
                    </button>
                  ))}
                </div>
              </div>

              {subcats.length > 0 && (
                <div className="sidebar-group">
                  <span className="fgroup-label">Tipo</span>
                  <div className="sidebar-chips">
                    <button
                      className={`chip${filters.subcat === "all" ? " active" : ""}`}
                      onClick={() => setFilters({ subcat: "all" })}
                    >
                      Todas
                    </button>
                    {subcats.map((s) => (
                      <button
                        key={s}
                        className={`chip${filters.subcat === s ? " active" : ""}`}
                        onClick={() => setFilters({ subcat: s })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="sidebar-group">
                <span className="fgroup-label">Marca</span>
                <div className="sidebar-chips">
                  <button
                    className={`chip${filters.brand === "all" ? " active" : ""}`}
                    onClick={() => setFilters({ brand: "all" })}
                  >
                    Todas
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      className={`chip${filters.brand === b ? " active" : ""}`}
                      onClick={() => setFilters({ brand: b })}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-group">
                <span className="fgroup-label">Disponibilidade</span>
                <select
                  className="sort"
                  value={filters.stock}
                  onChange={(e) => setFilters({ stock: e.target.value })}
                >
                  <option value="all">Todas</option>
                  <option value="in">Em stock</option>
                  <option value="low">Stock reduzido</option>
                  <option value="order">Sob encomenda</option>
                </select>
              </div>
            </div>

            <div className="sidebar-foot">
              <button
                className="clear"
                onClick={() =>
                  setFilters({
                    cat: DEFAULT_FILTERS.cat,
                    subcat: DEFAULT_FILTERS.subcat,
                    brand: DEFAULT_FILTERS.brand,
                    stock: DEFAULT_FILTERS.stock,
                  })
                }
              >
                Limpar filtros
              </button>
              <button className="btn-primary" onClick={() => setFiltersOpen(false)}>
                Ver {list.length} produto{list.length === 1 ? "" : "s"}
              </button>
            </div>
          </aside>

          <div className="catalog-main">
            <div className="catalog-toolbar-top">
              <span className="count">
                <b>{list.length}</b> produto{list.length === 1 ? "" : "s"}
              </span>
              <button className="filters-trigger" onClick={() => setFiltersOpen(true)}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filtros
                {activeFilterCount > 0 && <span className="fcount">{activeFilterCount}</span>}
              </button>
              <select
                className="sort"
                value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
              >
                <option value="default">Ordenar por</option>
                <option value="name">Nome (A–Z)</option>
                <option value="brand">Marca</option>
              </select>
            </div>

            <div className="grid">
              {list.length === 0 ? (
                <div className="empty">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <h3>Sem resultados</h3>
                  <p>Tente ajustar a pesquisa ou os filtros.</p>
                </div>
              ) : (
                list.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
