"use client";

import { createElement, useEffect, useRef } from "react";

type RevealTag = "div" | "span" | "h1" | "p" | "ul";

export default function Reveal({
  as = "div",
  className = "",
  index = 0,
  children,
}: {
  as?: RevealTag;
  className?: string;
  index?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`.trim(),
      style: { transitionDelay: `${(index % 4) * 70}ms` },
    },
    children
  );
}
