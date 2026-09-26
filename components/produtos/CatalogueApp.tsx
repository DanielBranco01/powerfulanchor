"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, getProduct } from "@/lib/catalogue";
import {
  CatalogueContext,
  DEFAULT_FILTERS,
  type CatalogueView,
  type Filters,
} from "./context";
import CategoriesView from "./CategoriesView";
import SubcategoriesView from "./SubcategoriesView";
import CatalogView from "./CatalogView";
import DetailView from "./DetailView";
import BasketDrawer from "./BasketDrawer";
import QuoteModal from "./QuoteModal";
import Toast from "./Toast";
import "../../app/produtos/produtos.css";

const isCategory = (key: string) => CATEGORIES.some((c) => c.key === key);

function replaceUrl(view: CatalogueView, cat?: string, id?: string, sub?: string) {
  if (typeof window === "undefined") return;
  let url = "/produtos";
  if (view === "detail" && id) url = `/produtos?produto=${encodeURIComponent(id)}`;
  else if (view === "subcats" && cat) url = `/produtos?cat=${encodeURIComponent(cat)}`;
  else if (view === "catalog") {
    url = `/produtos?cat=${encodeURIComponent(cat ?? "all")}&view=catalog`;
    if (sub && sub !== "all") url += `&sub=${encodeURIComponent(sub)}`;
  }
  window.history.replaceState({}, "", url);
}

export default function CatalogueApp() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<CatalogueView>("cats");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);

  const scrollTop = () => window.scrollTo({ top: 0 });

  const showCats = useCallback(() => {
    setSelectedId(null);
    setView("cats");
    replaceUrl("cats");
    scrollTop();
  }, []);

  // From the categories landing: a specific category opens its "Tipos" step;
  // "all" goes straight to the full catalog.
  const enterCategory = useCallback((cat: string) => {
    setFiltersState({ ...DEFAULT_FILTERS, cat: cat || "all" });
    if (!cat || cat === "all") {
      setView("catalog");
      replaceUrl("catalog", "all");
    } else {
      setView("subcats");
      replaceUrl("subcats", cat);
    }
    scrollTop();
  }, []);

  // Jumps straight into the catalog for a category, bypassing the "Tipos"
  // step — used for in-context navigation (e.g. from a product's detail page).
  const enterCatalog = useCallback((cat: string) => {
    setFiltersState({ ...DEFAULT_FILTERS, cat: cat || "all" });
    setView("catalog");
    replaceUrl("catalog", cat || "all");
    scrollTop();
  }, []);

  const enterSubcat = useCallback(
    (subcat: string) => {
      const nextSubcat = subcat || "all";
      setFiltersState((prev) => ({ ...prev, subcat: nextSubcat }));
      setView("catalog");
      replaceUrl("catalog", filters.cat, undefined, nextSubcat);
      scrollTop();
    },
    [filters.cat]
  );

  const showDetail = useCallback((id: string) => {
    setSelectedId(id);
    setView("detail");
    replaceUrl("detail", undefined, id);
    scrollTop();
  }, []);

  const goBack = useCallback(() => {
    if (view === "detail") {
      setView("catalog");
      replaceUrl("catalog", filters.cat, undefined, filters.subcat);
    } else if (view === "catalog" && filters.cat !== "all") {
      setView("subcats");
      replaceUrl("subcats", filters.cat);
    } else {
      setSelectedId(null);
      setView("cats");
      replaceUrl("cats");
    }
    scrollTop();
  }, [view, filters.cat, filters.subcat]);

  const setFilters = useCallback(
    (patch: Partial<Filters>) => {
      if (patch.cat !== undefined || patch.subcat !== undefined) {
        const nextCat = patch.cat ?? filters.cat;
        const nextSubcat = patch.subcat ?? filters.subcat;
        replaceUrl("catalog", nextCat, undefined, nextSubcat);
      }
      setFiltersState((prev) => ({ ...prev, ...patch }));
    },
    [filters.cat, filters.subcat]
  );

  // Sync from the URL — on first mount AND whenever it changes via a real
  // Next.js navigation (e.g. a <Link> in the nav mega menu), even though the
  // page itself doesn't remount. Internal navigation (enterCategory, etc.)
  // updates the URL with raw history.replaceState, which Next's router — and
  // therefore this hook — doesn't observe, so it doesn't fight this effect.
  useEffect(() => {
    const produto = searchParams.get("produto");
    const cat = searchParams.get("cat");
    const sub = searchParams.get("sub");
    const viewParam = searchParams.get("view");
    if (produto && getProduct(produto)) {
      setSelectedId(produto);
      setView("detail");
    } else if (cat === "all") {
      setFiltersState({ ...DEFAULT_FILTERS, cat: "all" });
      setView("catalog");
    } else if (cat && isCategory(cat)) {
      setFiltersState({ ...DEFAULT_FILTERS, cat, subcat: sub || "all" });
      setView(sub || viewParam === "catalog" ? "catalog" : "subcats");
    } else if (!produto && !cat) {
      setSelectedId(null);
      setFiltersState(DEFAULT_FILTERS);
      setView("cats");
    }
  }, [searchParams]);

  const ctx = useMemo(
    () => ({
      view,
      selectedId,
      showCats,
      enterCategory,
      enterCatalog,
      enterSubcat,
      showDetail,
      goBack,
      filters,
      setFilters,
    }),
    [
      view,
      selectedId,
      showCats,
      enterCategory,
      enterCatalog,
      enterSubcat,
      showDetail,
      goBack,
      filters,
      setFilters,
    ]
  );

  return (
    <CatalogueContext.Provider value={ctx}>
      <div className="pa-catalogue">
        {view === "cats" && <CategoriesView />}
        {view === "subcats" && <SubcategoriesView />}
        {view === "catalog" && <CatalogView />}
        {view === "detail" && <DetailView />}

        <BasketDrawer />
        <QuoteModal />
        <Toast />
      </div>
    </CatalogueContext.Provider>
  );
}
