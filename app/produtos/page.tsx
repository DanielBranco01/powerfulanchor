import type { Metadata } from "next";
import CatalogueApp from "@/components/produtos/CatalogueApp";

export const metadata: Metadata = {
  title: "Produtos · Powerful Anchor",
  description:
    "Catálogo de produtos para redes de comunicações: Redes de Dados, Áudio e Vídeo, Sistemas de RF e Cablagem e Acessórios. Peça orçamento com as melhores marcas.",
};

export default function ProdutosPage() {
  return <CatalogueApp />;
}
