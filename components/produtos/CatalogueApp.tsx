"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, getProduct } from "@/lib/catalogue";
import {
  CatalogueContext,
  DEFAULT_FILTERS,
  type BasketItem,
  type CatalogueView,
  type Filters,
} from "./context";
import CatalogueHeader from "./CatalogueHeader";
import CategoriesView from "./CategoriesView";
import CatalogView from "./CatalogView";
import DetailView from "./DetailView";
import BasketDrawer from "./BasketDrawer";
import QuoteModal from "./QuoteModal";
import Toast from "./Toast";
import "../../app/produtos/produtos.css";

const STORAGE_KEY = "pa-basket";
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
  const [items, setItems] = useState<BasketItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTop = () => window.scrollTo({ top: 0 });

  // ---- navigation ----
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

  // ---- basket ----
  const add = useCallback((id: string) => {
    setItems((prev) => {
      const it = prev.find((b) => b.id === id);
      if (it) return prev.map((b) => (b.id === id ? { ...b, qty: b.qty + 1 } : b));
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((b) => (b.id === id ? { ...b, qty: b.qty + delta } : b))
        .filter((b) => b.qty >= 1)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, b) => s + b.qty, 0), [items]);

  // ---- overlays ----
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openBasketQuote = useCallback(() => {
    if (items.length) {
      setDrawerOpen(false);
      setModalOpen(true);
    }
  }, [items.length]);

  // ---- toast ----
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }, []);

  // ---- persistence: load once, then save on change ----
  const firstSave = useRef(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: BasketItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed.filter((b) => getProduct(b.id)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  // ---- deep link (?produto / ?cat) once on mount ----
  // Apply state directly from the URL without rewriting history: the address bar
  // already holds the correct query, and calling replaceState during the mount
  // commit would fight the Next.js router.
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

  // ---- close overlays on Escape ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
      items,
      count,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
      modalOpen,
      openBasketQuote,
      closeModal,
      toastMsg,
      toastShow,
      toast,
    }),
    [
      view,
      selectedId,
      showCats,
      enterCatalog,
      showDetail,
      goBack,
      filters,
      setFilters,
      items,
      count,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
      modalOpen,
      openBasketQuote,
      closeModal,
      toastMsg,
      toastShow,
      toast,
    ]
  );

  return (
    <CatalogueContext.Provider value={ctx}>
      <div className="pa-catalogue">
        <CatalogueHeader />
        {view === "cats" && <CategoriesView />}
        {view === "catalog" && <CatalogView />}
        {view === "detail" && <DetailView />}

        <BasketDrawer />
        <QuoteModal />
        <Toast />

        <footer className="catfooter">
          <div className="wrap">
            <span>© {new Date().getFullYear()} Powerful Anchor · Produtos</span>
            <span>
              <b>Powerful Anchor</b> · Carnaxide
            </span>
          </div>
        </footer>
      </div>
    </CatalogueContext.Provider>
  );
}
