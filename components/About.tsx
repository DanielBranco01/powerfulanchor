import { Check } from "lucide-react";
import Reveal from "./ui/Reveal";

const LIST_ITEMS = [
  "Suporte técnico próximo e conhecimento de produto",
  "Marcas líderes: Digitus, HellermannTyton, RFS, Brady e Roxtec",
  "Transparência, compromisso e fiabilidade em cada projeto",
];

export default function About() {
  return (
    <section className="sec" id="sobre">
      <div className="wrap">
        <div className="about-grid">
          <Reveal className="about-copy" index={0}>
            <span className="eyebrow">Quem somos</span>
            <h2 style={{ fontSize: "clamp(1.9rem,3.6vw,2.7rem)", marginBottom: 20 }}>
              Um parceiro sólido para as suas redes de comunicações
            </h2>
            <p>
              A <strong>Powerful Anchor</strong> é uma empresa de distribuição e comercialização de
              produtos para redes de comunicações. O nosso objetivo é contribuir para o
              desenvolvimento destas redes, oferecendo soluções e produtos de qualidade.
            </p>
            <p>
              Trabalhamos lado a lado com integradores, instaladores e equipas técnicas,
              disponibilizando suporte especializado e soluções adaptadas a cada necessidade.
            </p>
            <ul className="about-list">
              {LIST_ITEMS.map((item) => (
                <li key={item}>
                  <span className="tick">
                    <Check strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="about-visual" index={1}>
            <div className="big">
              20<small>+</small>
            </div>
            <div className="big-lbl">anos de experiência no setor</div>
            <div className="about-mini">
              <div className="m">
                <div className="n">Stock</div>
                <div className="t">Disponibilidade imediata</div>
              </div>
              <div className="m">
                <div className="n">Rapidez</div>
                <div className="t">Na resposta e no serviço</div>
              </div>
              <div className="m">
                <div className="n">5 marcas</div>
                <div className="t">Representadas em Portugal</div>
              </div>
              <div className="m">
                <div className="n">B2B</div>
                <div className="t">Foco técnico e profissional</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
