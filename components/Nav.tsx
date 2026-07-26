"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#sobre", label: "Empresa" },
  { href: "#servicos", label: "Serviços" },
  { href: "#diferenciais", label: "Porquê nós" },
  { href: "#projetos", label: "Aplicações" },
  { href: "#processo", label: "Processo" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo" aria-label="Powerful Anchor — início">
          <span className="brand-logo" role="img" aria-label="Powerful Anchor" />
        </a>
        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a href="#contacto" className="btn btn-primary">
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
