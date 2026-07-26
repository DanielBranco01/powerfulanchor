import Reveal from "./ui/Reveal";

export default function CtaBand() {
  return (
    <section className="sec bg">
      <div className="wrap">
        <Reveal className="cta-band">
          <h2>Pronto para dar POWER ao seu negócio?</h2>
          <p>
            Diga-nos o que precisa. A nossa equipa ajuda a encontrar a solução certa para o seu
            projeto.
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn btn-primary">
              Pedir orçamento <span className="arrow">→</span>
            </a>
            <a href="tel:00351211914559" className="btn btn-ghost">
              +351 211 914 559
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
