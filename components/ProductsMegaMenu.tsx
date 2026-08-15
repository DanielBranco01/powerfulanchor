"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { NAV_CATEGORIES } from "@/lib/nav-catalogue";

export default function ProductsMegaMenu({
  active,
  onNavigate,
}: {
  active?: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoverCat, setHoverCat] = useState(NAV_CATEGORIES[0]?.slug ?? "");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cat = NAV_CATEGORIES.find((c) => c.slug === hoverCat) ?? NAV_CATEGORIES[0];

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleHide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div className="mega-trigger" onMouseEnter={show} onMouseLeave={scheduleHide}>
      <Link
        href="/produtos"
        className={active ? "active" : undefined}
        onClick={() => {
          setOpen(false);
          onNavigate();
        }}
      >
        Produtos
      </Link>

      <div className={`mega-panel${open ? " show" : ""}`}>
        <div className="mega-panel-inner">
          <div className="mega-cats">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/produtos?cat=${encodeURIComponent(c.key)}`}
                className={`mega-cat-item${c.slug === hoverCat ? " active" : ""}`}
                onMouseEnter={() => setHoverCat(c.slug)}
                onFocus={() => setHoverCat(c.slug)}
                onClick={() => {
                  setOpen(false);
                  onNavigate();
                }}
              >
                {c.key}
                <span className="mega-cat-arrow">›</span>
              </Link>
            ))}
          </div>

          {cat && (
            <div className="mega-subcats">
              <div className="mega-subcats-head">
                <span>{cat.key}</span>
                <Link
                  href={`/produtos?cat=${encodeURIComponent(cat.key)}&view=catalog`}
                  onClick={() => {
                    setOpen(false);
                    onNavigate();
                  }}
                >
                  Ver tudo
                </Link>
              </div>
              <div className="mega-subcats-list">
                {cat.subcats.map((s) => (
                  <Link
                    key={s}
                    href={`/produtos?cat=${encodeURIComponent(cat.key)}&sub=${encodeURIComponent(s)}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate();
                    }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mega-footer">
          <Link
            href="/produtos?cat=all"
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
          >
            Ver todos os produtos →
          </Link>
        </div>
      </div>
    </div>
  );
}
