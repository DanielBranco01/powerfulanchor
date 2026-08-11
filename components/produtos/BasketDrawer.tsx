"use client";

import { catIcon, getProduct } from "@/lib/catalogue";
import { useBasket } from "../BasketProvider";
import SvgIcon from "./SvgIcon";
import StockBadge from "./StockBadge";

export default function BasketDrawer() {
  const { items, count, drawerOpen, closeDrawer, setQty, remove, clear, openBasketQuote } =
    useBasket();

  return (
    <>
      <div className={`drawer-bg${drawerOpen ? " show" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? " show" : ""}`} aria-label="Orçamento">
        <div className="dhead">
          <h3>O seu orçamento</h3>
          <button className="x" onClick={closeDrawer} aria-label="Fechar">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="dbody">
          {items.length === 0 ? (
            <div className="dempty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              <p>O seu orçamento está vazio.</p>
              <p style={{ fontSize: ".85rem" }}>
                Adicione produtos com o botão “+ Orçamento”.
              </p>
            </div>
          ) : (
            items.map((b) => {
              const p = getProduct(b.id);
              if (!p) return null;
              return (
                <div className="bitem" key={b.id}>
                  <div className="bthumb">
                    {p.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.img} alt="" onError={(e) => e.currentTarget.remove()} />
                    ) : (
                      <SvgIcon inner={catIcon(p.cat)} strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="binfo">
                    <div className="bname">{p.name}</div>
                    <div className="bref">Ref. {p.ref}</div>
                    <div className="bstock">
                      <StockBadge stock={p.stock} />
                    </div>
                    <div className="bqty">
                      <button onClick={() => setQty(b.id, -1)} aria-label="menos">
                        −
                      </button>
                      <span>{b.qty}</span>
                      <button onClick={() => setQty(b.id, 1)} aria-label="mais">
                        +
                      </button>
                    </div>
                  </div>
                  <button className="bremove" onClick={() => remove(b.id)} aria-label="remover">
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="dfoot">
            <div className="sum">
              <span>Total de artigos</span>
              <b>{count}</b>
            </div>
            <button className="btn-primary" onClick={openBasketQuote}>
              Pedir orçamento destes produtos →
            </button>
            <button className="clear" onClick={clear}>
              Limpar orçamento
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
