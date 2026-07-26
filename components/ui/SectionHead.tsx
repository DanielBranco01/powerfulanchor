import Reveal from "./Reveal";

export default function SectionHead({
  eyebrow,
  title,
  description,
  center = false,
  index = 0,
}: {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
  index?: number;
}) {
  return (
    <Reveal className={`sec-head${center ? " center" : ""}`} index={index}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </Reveal>
  );
}
