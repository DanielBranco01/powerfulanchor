"use client";

import { useState } from "react";
import { catIcon, type ProductSummary } from "@/lib/catalogue";
import { useCatalogue } from "./context";
import { useBasket } from "../BasketProvider";
import SvgIcon from "./SvgIcon";
import StockBadge from "./StockBadge";

function CardImage({ product }: { product: ProductSummary }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    product.img ? "loading" : "error"
  );

  return (
    <div className="imgwrap">
      {status !== "loaded" && (
        <div className="ph">
          <SvgIcon inner={catIcon(product.cat)} strokeWidth={1.5} />
          <small>imagem do produto</small>
        </div>
      )}
      {product.img && status !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}

export default function ProductCard({ product }: { product: ProductSummary }) {
  const { showDetail } = useCatalogue();
  const { add, toast } = useBasket();

  return (
    <article className="pcard" onClick={() => showDetail(product.id)}>
      <CardImage product={product} />
      <div className="body">
        <div className="cat">{product.cat}</div>
        <h3>{product.name}</h3>
        <div className="ref">
          Ref. {product.ref} · {product.brand}
        </div>
        <div className="cardstock">
          <StockBadge stock={product.stock} />
        </div>
        <p className="desc">{product.desc.split(". ")[0]}.</p>
        <div className="cardfoot">
          <span className="details">
            Ver detalhes <span className="arrow">→</span>
          </span>
          <button
            className="addbtn"
            onClick={(e) => {
              e.stopPropagation();
              add(product.id);
              toast(`${product.name} adicionado ao orçamento`);
            }}
          >
            + Orçamento
          </button>
        </div>
      </div>
    </article>
  );
}
