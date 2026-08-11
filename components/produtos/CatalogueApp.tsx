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
  else if (view === "catalog") url = `/produtos?cat=${encodeURIComponent(cat ?? "all")}`;
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

  const enterCatalog = useCallback((cat: string) => {
    setFiltersState({ ...DEFAULT_FILTERS, cat: cat || "all" });
    setView("catalog");
    replaceUrl("catalog", cat || "all");
    scrollTop();
  }, []);

  const showDetail = useCallback((id: string) => {
    setSelectedId(id);
    setView("detail");
    replaceUrl("detail", undefined, id);
    scrollTop();
  }, []);

  const goBack = useCallback(() => {
    if (view === "detail") {
      setView("catalog");
      replaceUrl("catalog");
    } else {
      setSelectedId(null);
      setView("cats");
      replaceUrl("cats");
    }
    scrollTop();
  }, [view]);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    if (patch.cat !== undefined) replaceUrl("catalog", patch.cat);
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  // deep link (?produto / ?cat) once on mount — apply state without rewriting history
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const produto = params.get("produto");
    const cat = params.get("cat");
    if (produto && getProduct(produto)) {
      setSelectedId(produto);
      setView("detail");
    } else if (cat && (cat === "all" || isCategory(cat))) {
      setFiltersState({ ...DEFAULT_FILTERS, cat });
      setView("catalog");
    }
  }, []);

  const ctx = useMemo(
    () => ({
      view,
      selectedId,
      showCats,
      enterCatalog,
      showDetail,
      goBack,
      filters,
      setFilters,
    }),
    [view, selectedId, showCats, enterCatalog, showDetail, goBack, filters, setFilters]
  );

  return (
    <CatalogueContext.Provider value={ctx}>
      <div className="pa-catalogue">
        {view === "cats" && <CategoriesView />}
        {view === "catalog" && <CatalogView />}
        {view === "detail" && <DetailView />}

        <BasketDrawer />
        <QuoteModal />
        <Toast />
      </div>
    </CatalogueContext.Provider>
  );
}
