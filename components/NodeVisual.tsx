"use client";

import { useEffect, useRef, useState } from "react";
import { Anchor, Server, Wifi, Video, Monitor } from "lucide-react";

type Line = { length: number; angle: number };

const DOT_REFS = ["d1", "d2", "d3", "d4"] as const;

export default function NodeVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const place = () => {
      const visual = visualRef.current;
      if (!visual) return;
      const r = visual.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;

      const next: Line[] = DOT_REFS.map((key) => {
        const d = dotRefs.current[key];
        if (!d) return { length: 0, angle: 0 };
        const dr = d.getBoundingClientRect();
        const dx = dr.left - r.left + dr.width / 2;
        const dy = dr.top - r.top + dr.height / 2;
        const length = Math.hypot(dx - cx, dy - cy);
        const angle = (Math.atan2(dy - cy, dx - cx) * 180) / Math.PI;
        return { length, angle };
      });

      setLines(next);
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  return (
    <div className="node-visual" ref={visualRef}>
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="center">
        <Anchor strokeWidth={1.8} />
      </div>
      <div className="dot d1" ref={(el) => { dotRefs.current.d1 = el; }}>
        <Server strokeWidth={2} />
      </div>
      <div className="dot d2" ref={(el) => { dotRefs.current.d2 = el; }}>
        <Wifi strokeWidth={2} />
      </div>
      <div className="dot d3" ref={(el) => { dotRefs.current.d3 = el; }}>
        <Video strokeWidth={2} />
      </div>
      <div className="dot d4" ref={(el) => { dotRefs.current.d4 = el; }}>
        <Monitor strokeWidth={2} />
      </div>
      {lines.map((line, i) => (
        <span
          key={i}
          className="node-line"
          style={{ width: `${line.length}px`, transform: `rotate(${line.angle}deg)` }}
        />
      ))}
    </div>
  );
}
