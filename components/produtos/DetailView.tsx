"use client";

import { useRef, useState } from "react";
import { catIcon, getProduct, PRODUCTS } from "@/lib/catalogue";
import { useCatalogue } from "./context";
import { useBasket } from "../BasketProvider";
import SvgIcon from "./SvgIcon";
import StockBadge from "./StockBadge";
import ProductCard from "./ProductCard";
import QuoteForm from "./QuoteForm";

function DetailMedia({ img, cat, name }: { img: string | null; cat: string; name: string }) {
  const [error, setError] = useState(!img);
  return (
    <div className="detail-media">
      {img && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={name} onError={() => setError(true)} />
      ) : (
        <div className="ph">
          <SvgIcon inner={catIcon(cat)} strokeWidth={1.4} />
          <small>imagem do produto</small>
        </div>
      )}
    </div>
  );
}

export default function DetailView() {
  const { selectedId, showCats, enterCatalog } = useCatalogue();
  const { add, toast } = useBasket();
  const quoteRef = useRef<HTMLDivElement>(null);

  const p = selectedId ? getProduct(selectedId) : undefined;
  if (!p) return null;

  const highlights = p.specs.slice(0, 3);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  const gotoQuote = () => {
    const sec = quoteRef.current;
    if (!sec) return;
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
    const nome = sec.querySelector<HTMLInputElement>('input[name="nome"]');
    if (nome) setTimeout(() => nome.focus(), 400);
  };

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="crumbs">
            <a onClick={showCats}>Produtos</a>
            <span className="sep">/</span>
            <a onClick={() => enterCatalog(p.cat)}>{p.cat}</a>
            <span className="sep">/</span>
            <span className="cur">{p.name}</span>
          </div>
        </div>
      </section>

      <section className="detail">
        <div className="wrap">
          <div className="detail-top">
            <DetailMedia img={p.img} cat={p.cat} name={p.name} />
            <div className="detail-info">
              <span className="dbrand">{p.brand}</span>
              <div className="dcat">{p.cat}</div>
              <h1>{p.name}</h1>
              <div className="dref">Referência: {p.ref}</div>
              <div className="dstock">
                <StockBadge stock={p.stock} />
              </div>
              <p className="ddesc">{p.desc}</p>
              <div className="hl">
                {highlights.map(([k, v]) => (
                  <div className="hchip" key={k}>
                    <span className="hk">{k}</span>
                    <span className="hv">{v}</span>
                  </div>
                ))}
              </div>
              <div className="dactions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    add(p.id);
                    toast(`${p.name} adicionado ao orçamento`);
                  }}
                >
                  Adicionar ao orçamento
                </button>
                <button className="btn-ghost" onClick={() => enterCatalog(p.cat)}>
                  Ver mais em {p.cat}
                </button>
              </div>
              <button className="linklike" onClick={gotoQuote}>
                ou peça já só este produto ↓
              </button>
            </div>
          </div>

          <div className="specs">
            <h2>Especificações técnicas</h2>
            <div className="subtle">
              Ref. {p.ref} · {p.brand}
            </div>
            <table className="spec-table">
              <tbody>
                {p.specs.map(([k, v]) => (
                  <tr key={k}>
                    <td className="k">{k}</td>
                    <td className="v">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quote-sec" ref={quoteRef}>
            <h2>Pedir orçamento deste produto</h2>
            <div className="subtle">
              Preencha os dados e enviamos-lhe preço e disponibilidade para <b>{p.name}</b>.
            </div>
            <QuoteForm mode="single" product={p} />
          </div>

          {related.length > 0 && (
            <div className="related">
              <h2>Produtos relacionados</h2>
              <div className="rel-grid">
                {related.map((r) => (
                  <ProductCard key={r.id} product={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
