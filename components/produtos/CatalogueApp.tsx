"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function replaceUrl(view: CatalogueView, cat?: string, id?: string) {
  if (typeof window === "undefined") return;
  let url = "/produtos";
  if (view === "detail" && id) url = `/produtos?produto=${encodeURIComponent(id)}`;
  else if (view === "subcats" && cat) url = `/produtos?cat=${encodeURIComponent(cat)}`;
  else if (view === "catalog")
    url = `/produtos?cat=${encodeURIComponent(cat ?? "all")}&view=catalog`;
  window.history.replaceState({}, "", url);
}

export default function CatalogueApp() {
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
      setFiltersState((prev) => ({ ...prev, subcat: subcat || "all" }));
      setView("catalog");
      replaceUrl("catalog", filters.cat);
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
      replaceUrl("catalog", filters.cat);
    } else if (view === "catalog" && filters.cat !== "all") {
      setView("subcats");
      replaceUrl("subcats", filters.cat);
    } else {
      setSelectedId(null);
      setView("cats");
      replaceUrl("cats");
    }
    scrollTop();
  }, [view, filters.cat]);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    if (patch.cat !== undefined) replaceUrl("catalog", patch.cat);
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  // deep link (?produto / ?cat) once on mount — apply state without rewriting history
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const produto = params.get("produto");
    const cat = params.get("cat");
    const sub = params.get("sub");
    const viewParam = params.get("view");
    if (produto && getProduct(produto)) {
      setSelectedId(produto);
      setView("detail");
    } else if (cat === "all") {
      setFiltersState({ ...DEFAULT_FILTERS, cat: "all" });
      setView("catalog");
    } else if (cat && isCategory(cat)) {
      setFiltersState({ ...DEFAULT_FILTERS, cat, subcat: sub || "all" });
      setView(sub || viewParam === "catalog" ? "catalog" : "subcats");
    }
  }, []);

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
