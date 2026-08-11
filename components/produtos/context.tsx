"use client";

import { createContext, useContext } from "react";

export type CatalogueView = "cats" | "catalog" | "detail";

export type Filters = {
  brand: string;
  cat: string;
  subcat: string;
  stock: string;
  q: string;
  sort: string;
};

export type CatalogueContextValue = {
  view: CatalogueView;
  selectedId: string | null;
  showCats: () => void;
  enterCatalog: (cat: string) => void;
  showDetail: (id: string) => void;
  goBack: () => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
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
