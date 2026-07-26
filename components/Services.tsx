import { Server, AudioLines, Radio, Wrench, LucideIcon } from "lucide-react";
import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const SERVICES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Server,
    title: "Redes de Dados",
    description:
      "Cablagem estruturada, conectividade e componentes para infraestruturas de rede fiáveis e escaláveis.",
  },
  {
    icon: AudioLines,
    title: "Áudio e Vídeo",
    description:
      "Equipamentos e soluções de distribuição de áudio e vídeo para ambientes profissionais e comerciais.",
  },
  {
    icon: Radio,
    title: "Sistemas de RF",
    description:
      "Componentes e sistemas de radiofrequência para transmissão, cobertura e comunicações sem fios.",
  },
  {
    icon: Wrench,
    title: "Consultoria Técnica",
    description:
      "Aconselhamento na escolha de produtos e no dimensionamento de soluções, ajustado ao seu projeto.",
  },
];

export default function Services() {
  return (
    <section className="sec bg" id="servicos">
      <div className="wrap">
        <SectionHead
          eyebrow="O que fazemos"
          title="Áreas de solução"
          description="Produtos e soluções para todas as camadas da sua infraestrutura de comunicações."
          center
        />
        <div className="cards">
          {SERVICES.map((service, i) => (
            <Reveal as="div" className="card" index={i} key={service.title}>
              <div className="ico">
                <service.icon strokeWidth={2} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contacto" className="more">
                Saber mais <span className="arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
