import { ShieldCheck, FileText, Clock, Shuffle, PackageCheck, Handshake, LucideIcon } from "lucide-react";
import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "Produtos de qualidade",
    description:
      "As melhores marcas do mercado, ao melhor preço, com a fiabilidade que os seus projetos exigem.",
  },
  {
    icon: FileText,
    title: "Suporte técnico",
    description:
      "Equipa que conhece o produto e responde às suas questões técnicas com rapidez e rigor.",
  },
  {
    icon: Clock,
    title: "+20 anos de experiência",
    description:
      "Duas décadas de conhecimento aplicado às redes de comunicações e às necessidades reais dos clientes.",
  },
  {
    icon: Shuffle,
    title: "Soluções à medida",
    description:
      "Adaptamos produtos e recomendações ao seu contexto, em vez de soluções rígidas de prateleira.",
  },
  {
    icon: PackageCheck,
    title: "Stock disponível",
    description: "Disponibilidade de material que evita atrasos e mantém as suas obras a andar.",
  },
  {
    icon: Handshake,
    title: "Compromisso e fiabilidade",
    description: "Transparência em cada relação. Aderentes ao Compromisso de Pagamento Pontual.",
  },
];

export default function Differentials() {
  return (
    <section className="sec" id="diferenciais">
      <div className="wrap">
        <SectionHead
          eyebrow="Porquê a Powerful Anchor"
          title="O que nos distingue"
          description="Mais do que fornecer produtos, somos um ponto de apoio fiável para o seu negócio."
        />
        <div className="feat-grid">
          {FEATURES.map((feature, i) => (
            <Reveal as="div" className="feat" index={i} key={feature.title}>
              <div className="fi">
                <feature.icon strokeWidth={2} />
              </div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
