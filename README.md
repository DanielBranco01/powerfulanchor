# Powerful Anchor — Next.js

Site institucional da Powerful Anchor, migrado de um HTML/CSS/JS estático para Next.js 15 (App Router), mantendo 1:1 a identidade visual, secções e conteúdos do original.

## Stack

- **Next.js 15** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4** — tokens de cor/tipografia/sombra definidos em `app/globals.css` via `@theme`
- **next/font** — Space Grotesk (display) + Inter (body)
- **lucide-react** — iconografia
- **Zod** + **Server Actions** — validação e envio do formulário de contacto

## Como correr

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Build de produção:

```bash
pnpm build
pnpm start
```

> Nota: se `pnpm` não estiver instalado globalmente, pode usar `npx pnpm install` / `npx pnpm dev`.

## Estrutura

```
app/
├── layout.tsx        # fontes, metadata, <Nav /> + <Footer />
├── page.tsx           # composição da homepage
├── globals.css        # tokens @theme + estilos das secções
└── actions.ts          # Server Action do formulário de contacto (Zod)
components/
├── Nav.tsx             # header fixo, efeito de scroll, menu mobile
├── Hero.tsx            # hero com node-visual animado
├── NodeVisual.tsx       # rings/dots/linhas do hero (client)
├── TrustBar.tsx
├── About.tsx            # #sobre
├── Services.tsx         # #servicos
├── Differentials.tsx    # #diferenciais
├── Projects.tsx         # #projetos
├── Process.tsx          # #processo
├── CtaBand.tsx
├── Contact.tsx          # #contacto — formulário (client + Server Action)
├── Footer.tsx
└── ui/
    ├── Reveal.tsx        # wrapper IntersectionObserver para animação de scroll
    └── SectionHead.tsx   # eyebrow + h2 + p reutilizável
public/
└── logo.png             # logótipo extraído do favicon/base64 original
```

## Notas de implementação

- A paleta de cores e os design tokens (raio, sombras) estão definidos como custom properties Tailwind v4 em `@theme`, disponíveis como utilities (`bg-pink`, `text-ink`, etc.) e reutilizados nos estilos das secções em `globals.css`.
- O formulário de contacto valida os campos no servidor com Zod via Server Action; ao ser bem-sucedido, o cliente abre o cliente de e-mail (`mailto:`) com o assunto/corpo preenchidos, replicando o comportamento do site original.
- O ano no rodapé é calculado no servidor com `new Date().getFullYear()`.
- As animações `float`/`spin` do node-visual do hero e a transição `.reveal` estão definidas em `globals.css`; o cálculo das linhas que ligam os pontos ao centro é feito em `NodeVisual.tsx` (client component), replicando a lógica original baseada em `getBoundingClientRect`.
