"use client";

import { createContext, useContext } from "react";

export type CatalogueView = "cats" | "catalog" | "detail";

export type BasketItem = { id: string; qty: number };

export type Filters = {
  brand: string;
  cat: string;
  subcat: string;
  stock: string;
  q: string;
  sort: string;
};

export type CatalogueContextValue = {
  // navigation
  view: CatalogueView;
  selectedId: string | null;
  showCats: () => void;
  enterCatalog: (cat: string) => void;
  showDetail: (id: string) => void;
  goBack: () => void;
  // filters (catalog view)
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  // basket
  items: BasketItem[];
  count: number;
  add: (id: string) => void;
  setQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  // overlays
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  modalOpen: boolean;
  openBasketQuote: () => void;
  closeModal: () => void;
  // toast
  toastMsg: string;
  toastShow: boolean;
  toast: (msg: string) => void;
};

export const CatalogueContext = createContext<CatalogueContextValue | null>(null);

export function useCatalogue(): CatalogueContextValue {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error("useCatalogue must be used within CatalogueApp");
  return ctx;
}

export const DEFAULT_FILTERS: Filters = {
  brand: "all",
  cat: "all",
  subcat: "all",
  stock: "all",
  q: "",
  sort: "default",
};
