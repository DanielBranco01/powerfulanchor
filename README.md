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
├── layout.tsx              # root: html/body, fontes, <BasketProvider> + <Nav/> + <Footer/>
├── page.tsx                # homepage (compõe as secções)
├── globals.css             # tokens @theme + estilos das secções do site + nav
├── actions.ts              # Server Action do formulário de contacto (Zod)
├── icon.png                # favicon (logótipo)
└── produtos/               # módulo de catálogo
    ├── page.tsx            # rota /produtos (server, metadata) → <CatalogueApp />
    └── produtos.css        # estilos do catálogo, isolados sob .pa-catalogue
components/
├── BasketProvider.tsx      # estado global do cesto (useBasket) — partilhado por Nav e catálogo
├── Nav.tsx                 # header fixo partilhado: scroll, menu mobile, links do site,
│                           #   link/estado /produtos e botão de cesto (em /produtos)
├── Hero.tsx · NodeVisual.tsx · TrustBar.tsx · About.tsx · Services.tsx
├── Differentials.tsx · Projects.tsx · Process.tsx · CtaBand.tsx
├── Contact.tsx             # #contacto — formulário (client + Server Action)
├── Footer.tsx
├── ui/
│   ├── Reveal.tsx          # wrapper IntersectionObserver p/ animação de scroll
│   └── SectionHead.tsx     # eyebrow + h2 + p reutilizável
└── produtos/               # componentes do catálogo (todos client)
    ├── CatalogueApp.tsx    # orquestrador: navegação de vistas, deep-links, contexto
    ├── context.tsx         # CatalogueContext (navegação) + hook useCatalogue
    ├── CategoriesView.tsx  # landing de categorias
    ├── CatalogView.tsx     # grelha + pesquisa + filtros (marca/tipo/stock) + ordenação
    ├── DetailView.tsx      # ficha do produto (specs, relacionados, orçamento)
    ├── ProductCard.tsx · StockBadge.tsx · SvgIcon.tsx
    ├── BasketDrawer.tsx    # gaveta do cesto de orçamento
    ├── QuoteModal.tsx      # modal de pedido de orçamento (multi-produto)
    ├── QuoteForm.tsx       # formulário de orçamento (single/basket) → mailto
    └── Toast.tsx
lib/
└── catalogue.ts            # dados tipados: CATEGORIES, PRODUCTS + helpers
public/
└── logo.png                # logótipo extraído do favicon/base64 original
```

## Notas de implementação

- A paleta de cores e os design tokens (raio, sombras) estão definidos como custom properties Tailwind v4 em `@theme`, disponíveis como utilities (`bg-pink`, `text-ink`, etc.) e reutilizados nos estilos das secções em `globals.css`.
- O formulário de contacto valida os campos no servidor com Zod via Server Action; ao ser bem-sucedido, o cliente abre o cliente de e-mail (`mailto:`) com o assunto/corpo preenchidos, replicando o comportamento do site original.
- O ano no rodapé é calculado no servidor com `new Date().getFullYear()`.
- As animações `float`/`spin` do node-visual do hero e a transição `.reveal` estão definidas em `globals.css`; o cálculo das linhas que ligam os pontos ao centro é feito em `NodeVisual.tsx` (client component), replicando a lógica original baseada em `getBoundingClientRect`.

## Módulo de catálogo (`/produtos`)

- **Dados**: `lib/catalogue.ts` centraliza categorias e produtos tipados (nome, marca, categoria, subcategoria, referência, stock, especificações, imagem). Substituir por estes dados os do teu Excel/BD; a UI adapta-se automaticamente.
- **Três vistas** (categorias → catálogo → detalhe) geridas por estado no cliente em `CatalogueApp`, partilhando um único contexto (`useCatalogue`).
- **Pesquisa, filtros e ordenação**: por marca, categoria, tipo (subcategoria) e disponibilidade; pesquisa por nome/referência/marca; ordenação por nome ou marca.
- **Cabeçalho partilhado**: `/produtos` usa o mesmo `<Nav/>` e `<Footer/>` do site (definidos no layout raiz), pelo que se navega livremente entre catálogo e secções do site. O botão de cesto aparece no cabeçalho quando se está em `/produtos`.
- **Cesto de orçamento**: estado global em `BasketProvider` (`useBasket`), partilhado entre o cabeçalho e o catálogo; adicionar/remover/ajustar quantidades, persistido em `localStorage`; pedido de orçamento (produto único ou vários) compõe um e-mail para `sales@powerfulanchor.pt` (troca por um backend em produção).
- **Estilos isolados**: todo o CSS do catálogo vive sob `.pa-catalogue` em `app/produtos/produtos.css`, evitando colisões com os estilos do site.
- **Deep-links**: `/produtos?cat=<categoria>` abre uma categoria e `/produtos?produto=<id>` abre uma ficha; a barra de navegação, os cartões de serviço e o rodapé do site já ligam para o catálogo.
- **Imagens**: os produtos com URL de imagem do fabricante mostram a foto real; sem URL (ou em erro de carregamento) mostram um placeholder com o ícone da categoria.
