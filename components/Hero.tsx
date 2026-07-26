import Reveal from "./ui/Reveal";
import NodeVisual from "./NodeVisual";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-copy">
          <Reveal as="span" className="eyebrow light" index={0}>
            Redes de comunicações · Portugal
          </Reveal>
          <Reveal as="h1" index={1}>
            Soluções tecnológicas que dão <span className="glow">POWER</span> ao seu negócio
          </Reveal>
          <Reveal as="p" className="lead" index={2}>
            Distribuímos e comercializamos produtos para redes de comunicações — dados, áudio e
            vídeo e sistemas de RF — com suporte técnico próximo e as melhores marcas do mercado.
          </Reveal>
          <Reveal className="hero-actions" index={3}>
            <a href="#contacto" className="btn btn-primary">
              Falar connosco <span className="arrow">→</span>
            </a>
            <a href="#servicos" className="btn btn-ghost">
              Ver serviços
            </a>
          </Reveal>
          <Reveal className="hero-stats" index={0}>
            <div className="stat">
              <div className="num">20+</div>
              <div className="lbl">Anos de experiência</div>
            </div>
            <div className="stat">
              <div className="num">5</div>
              <div className="lbl">Marcas de referência</div>
            </div>
            <div className="stat">
              <div className="num">24h</div>
              <div className="lbl">Rapidez de resposta</div>
            </div>
          </Reveal>
        </div>
        <div className="node-card" aria-hidden="true">
          <NodeVisual />
        </div>
      </div>
    </section>
  );
}
