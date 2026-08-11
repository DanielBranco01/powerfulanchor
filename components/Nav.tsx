"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBasket } from "./BasketProvider";

type NavLink = { href: string; label: string; route?: boolean };

const LINKS: NavLink[] = [
  { href: "/#sobre", label: "Empresa" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/produtos", label: "Produtos", route: true },
  { href: "/#diferenciais", label: "Porquê nós" },
  { href: "/#projetos", label: "Aplicações" },
  { href: "/#processo", label: "Processo" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onProdutos = pathname?.startsWith("/produtos") ?? false;
  const { count, openDrawer } = useBasket();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="wrap nav-inner">
        <a href="/#top" className="logo" aria-label="Powerful Anchor — início">
          <span className="brand-logo" role="img" aria-label="Powerful Anchor" />
        </a>
        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {LINKS.map((link) => {
            const active = link.route && onProdutos;
            return link.route ? (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="nav-cta">
          {onProdutos && (
            <button
              className={`nav-basket${count === 0 ? " empty" : ""}`}
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
              <span className="nav-basket-lbl">Orçamento</span>
              <span className="badge">{count}</span>
            </button>
          )}
          <a href="/#contacto" className="btn btn-primary">
            Falar connosco
          </a>
        </div>
        <button
          className={`burger${open ? " open" : ""}`}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
