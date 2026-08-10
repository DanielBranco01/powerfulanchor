"use client";

import { CATEGORIES, countByCat } from "@/lib/catalogue";
import { useCatalogue } from "./context";
import SvgIcon from "./SvgIcon";

export default function CategoriesView() {
  const { enterCatalog } = useCatalogue();

  return (
    <>
      <section className="head">
        <div className="wrap">
          <span className="eyebrow">Produtos</span>
          <h1>Explore por categoria</h1>
          <p>
            Escolha uma área e veja os produtos disponíveis. Clique num produto para ver a ficha
            técnica.
          </p>
        </div>
      </section>
      <section className="cats">
        <div className="wrap">
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <div
                key={c.key}
                className={`catcard ${c.cls}`}
                onClick={() => enterCatalog(c.key)}
              >
                <div className="cico">
                  <SvgIcon inner={c.icon} />
                </div>
                <h3>{c.key}</h3>
                <p>{c.desc}</p>
                <div className="go">
                  <span className="cnt">{countByCat(c.key)} produtos</span>
                  <span className="arrow">Ver produtos →</span>
                </div>
              </div>
            ))}
          </div>
          <div className="allbtn">
            <button onClick={() => enterCatalog("all")}>Ver todos os produtos →</button>
          </div>
        </div>
      </section>
    </>
  );
}
