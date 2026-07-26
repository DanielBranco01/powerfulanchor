import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const PROJECTS = [
  {
    variant: "p1",
    tag: "Redes de Dados",
    title: "Cablagem estruturada em edifícios",
    description:
      "Infraestruturas de rede fiáveis para escritórios, data centers e espaços comerciais.",
  },
  {
    variant: "p2",
    tag: "Sistemas de RF",
    title: "Cobertura de rádio e wireless",
    description: "Componentes de radiofrequência para comunicações estáveis em ambientes exigentes.",
  },
  {
    variant: "p3",
    tag: "Áudio e Vídeo",
    title: "Distribuição AV profissional",
    description: "Sistemas de áudio e vídeo para instalações que exigem qualidade e continuidade.",
  },
];

export default function Projects() {
  return (
    <section className="sec bg" id="projetos">
      <div className="wrap">
        <SectionHead
          eyebrow="Aplicações"
          title="Onde as nossas soluções entram em ação"
          description="Exemplos representativos dos contextos em que os nossos produtos fazem a diferença."
          center
        />
        <div className="proj-grid">
          {PROJECTS.map((project, i) => (
            <Reveal as="div" className={`proj ${project.variant}`} index={i} key={project.title}>
              <span className="tag">{project.tag}</span>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
