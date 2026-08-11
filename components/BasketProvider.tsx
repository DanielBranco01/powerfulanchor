"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getProduct } from "@/lib/catalogue";

export type BasketItem = { id: string; qty: number };

type BasketContextValue = {
  items: BasketItem[];
  count: number;
  add: (id: string) => void;
  setQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  modalOpen: boolean;
  openBasketQuote: () => void;
  closeModal: () => void;
  toastMsg: string;
  toastShow: boolean;
  toast: (msg: string) => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within BasketProvider");
  return ctx;
}

const STORAGE_KEY = "pa-basket";

export default function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const add = useCallback((id: string) => {
    setItems((prev) => {
      const it = prev.find((b) => b.id === id);
      if (it) return prev.map((b) => (b.id === id ? { ...b, qty: b.qty + 1 } : b));
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((b) => (b.id === id ? { ...b, qty: b.qty + delta } : b)).filter((b) => b.qty >= 1)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, b) => s + b.qty, 0), [items]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openBasketQuote = useCallback(() => {
    if (items.length) {
      setDrawerOpen(false);
      setModalOpen(true);
    }
  }, [items.length]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }, []);

  // persistence: load once, then save on change
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

  // close overlays on Escape
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

  const value = useMemo(
    () => ({
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

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}
