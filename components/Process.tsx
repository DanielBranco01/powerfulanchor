import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const STEPS = [
  {
    title: "Contacto",
    description: "Fala connosco e explica o que precisa. Ouvimos o seu desafio técnico.",
  },
  {
    title: "Análise",
    description: "Avaliamos requisitos e recomendamos os produtos e soluções mais adequados.",
  },
  {
    title: "Proposta",
    description: "Apresentamos uma proposta clara, com as melhores marcas ao melhor preço.",
  },
  {
    title: "Entrega e apoio",
    description: "Fornecemos o material com rapidez e mantemos o suporte técnico ao seu lado.",
  },
];

export default function Process() {
  return (
    <section className="sec" id="processo">
      <div className="wrap">
        <SectionHead
          eyebrow="Como trabalhamos"
          title="Do primeiro contacto à entrega"
          description="Um processo simples e transparente, pensado para si."
          center
        />
        <div className="steps">
          {STEPS.map((step, i) => (
            <Reveal as="div" className="step" index={i} key={step.title}>
              <div className="n">{i + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
