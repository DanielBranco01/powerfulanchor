"use client";

import Link from "next/link";
import { useCatalogue } from "./context";

export default function CatalogueHeader() {
  const { view, goBack, count, openDrawer } = useCatalogue();

  return (
    <header className="catbar">
      <div className="wrap catbar-inner">
        <Link href="/" className="brand" aria-label="Powerful Anchor — início">
          <span className="mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="2" />
              <path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3" />
            </svg>
          </span>
          <span>
            Powerful <span className="brandaccent">Anchor</span>
          </span>
        </Link>
        <div className="nav-right">
          {view !== "cats" && (
            <button className="nav-back" onClick={goBack}>
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>{" "}
              <span>{view === "detail" ? "Voltar" : "Categorias"}</span>
            </button>
          )}
          <button
            className={`basket-btn${count === 0 ? " empty" : ""}`}
            aria-label="Ver orçamento"
            onClick={openDrawer}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="basket-lbl">Orçamento</span>
            <span className="badge">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
