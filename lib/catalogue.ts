export type StockKey = "in" | "low" | "order";

export type Category = {
  key: string;
  cls: string;
  desc: string;
  /** Inner SVG markup (paths) drawn inside a 24×24 stroked <svg>. */
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  cat: string;
  ref: string;
  desc: string;
  img: string | null;
  specs: [string, string][];
  subcat: string;
  stock: StockKey;
};

export const CATEGORIES: Category[] = [
  {
    key: "Redes de Dados",
    cls: "c1",
    desc: "Switches, patch panels, racks e conectividade para infraestruturas de rede.",
    icon: '<rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 18h.01M10 18h.01"/><path d="M8 14V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>',
  },
  {
    key: "Áudio e Vídeo",
    cls: "c2",
    desc: "Distribuição, extensão e comutação de sinal AV para ambientes profissionais.",
    icon: '<path d="M3 8v8M7 5v14M12 3v18M17 6v12M21 9v6"/>',
  },
  {
    key: "Sistemas de RF",
    cls: "c3",
    desc: "Antenas, cabos coaxiais e conectores para comunicações por radiofrequência.",
    icon: '<circle cx="12" cy="12" r="2"/><path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"/>',
  },
  {
    key: "Cablagem e Acessórios",
    cls: "c4",
    desc: "Cabo, gestão, identificação e vedação — de HellermannTyton, Brady e Roxtec.",
    icon: '<path d="M4 4v6a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v2M4 4h4M20 20h-4"/>',
  },
];

const SUBCAT: Record<string, string> = {
  "dn80221-3": "Switches",
  "dn91411-24": "Patch Panels",
  "dn19-42u": "Bastidores",
  ds45320: "Distribuição HDMI",
  ds55521: "Extensão AV",
  "lcf12-50j": "Cabos coaxiais",
  "716m-lcf12": "Conectores",
  rm60: "Vedação",
  rm20w40: "Vedação",
  rm30: "Vedação",
  "ht-t50": "Gestão de cabos",
  "ht-helatag": "Identificação",
  "brady-bmp41": "Identificação",
};

const STOCK: Record<string, StockKey> = {
  "dn80221-3": "in",
  "dn91411-24": "in",
  "dn19-42u": "order",
  ds45320: "low",
  ds55521: "in",
  "lcf12-50j": "order",
  "716m-lcf12": "in",
  rm60: "in",
  rm20w40: "low",
  rm30: "in",
  "ht-t50": "in",
  "ht-helatag": "low",
  "brady-bmp41": "order",
};

type RawProduct = Omit<Product, "subcat" | "stock">;

const RAW_PRODUCTS: RawProduct[] = [
  {
    id: "dn80221-3",
    name: "Switch Gigabit 24 portas, gerível",
    brand: "Digitus",
    cat: "Redes de Dados",
    ref: "DN-80221-3",
    desc: "Switch de rede L2 gerível para bastidor 19”, com 24 portas Gigabit e uplinks SFP. Ideal para redes empresariais que precisam de VLAN, QoS e gestão remota.",
    img: "https://products.digitus.com/out/pictures/generated/product/1/665_665_75/DN802213_4016032467687_Front_1_RGB.jpg",
    specs: [
      ["Portas", "24× RJ45 10/100/1000 Mbps"],
      ["Uplinks", "2× SFP (Gigabit)"],
      ["Gestão", "L2 gerível — Web / CLI / SNMP"],
      ["Capacidade de comutação", "52 Gbps"],
      ["VLAN", "IEEE 802.1Q"],
      ["QoS", "4 filas por porta"],
      ["Formato", "19”, 1U (bastidor)"],
      ["Alimentação", "100–240 V AC (interna)"],
      ["Temperatura", "0–40 °C"],
    ],
  },
  {
    id: "dn91411-24",
    name: "Patch panel modular 24 portas Cat.6A",
    brand: "Digitus",
    cat: "Redes de Dados",
    ref: "DN-91411-24",
    desc: "Painel de conexão modular 1U para bastidor 19”, equipado com 24 keystones Cat.6A blindados. Organizador de cabos traseiro incluído.",
    img: "https://products.digitus.com/out/pictures/generated/product/1/665_665_75/DN9141124_4016032505723_Front_1_RGB.jpg",
    specs: [
      ["Portas", "24× keystone (modular)"],
      ["Categoria", "Cat.6A blindado (STP)"],
      ["Formato", "19”, 1U"],
      ["Material", "Aço, preto"],
      ["Terminação", "Keystone / LSA"],
      ["Organizador traseiro", "Incluído"],
      ["Norma", "ISO/IEC 11801"],
    ],
  },
  {
    id: "dn19-42u",
    name: "Bastidor de rede 42U 19”",
    brand: "Digitus",
    cat: "Redes de Dados",
    ref: "DN-19-42U",
    img: null,
    desc: "Rack de piso para infraestrutura de rede, com portas perfuradas e gestão de cabos vertical. (Especificações ilustrativas.)",
    specs: [
      ["Altura útil", "42U"],
      ["Formato", "19”"],
      ["Dimensões (AxLxP)", "2053 × 600 × 1000 mm"],
      ["Carga máxima", "≈ 800 kg"],
      ["Porta frontal", "Vidro/perfurada, com fecho"],
      ["Cor", "Preto (RAL 9005)"],
      ["Proteção", "IP20"],
    ],
  },
  {
    id: "ds45320",
    name: "Splitter HDMI 1×4, 4K",
    brand: "Digitus",
    cat: "Áudio e Vídeo",
    ref: "DS-45320",
    img: null,
    desc: "Distribuidor que replica uma fonte HDMI para 4 ecrãs em simultâneo, com suporte 4K. (Especificações ilustrativas.)",
    specs: [
      ["Configuração", "1 entrada → 4 saídas HDMI"],
      ["Resolução máx.", "4K/UHD (3840×2160)"],
      ["Largura de banda", "10.2 Gbps"],
      ["HDCP", "Suportado"],
      ["Alimentação", "5 V DC"],
      ["Alcance", "até 15 m por saída"],
    ],
  },
  {
    id: "ds55521",
    name: "Extensor HDMI sobre Cat.6",
    brand: "Digitus",
    cat: "Áudio e Vídeo",
    ref: "DS-55521",
    img: null,
    desc: "Transmite sinal HDMI através de cabo de rede, para instalações onde a distância excede os cabos HDMI convencionais. (Especificações ilustrativas.)",
    specs: [
      ["Meio de transmissão", "1× cabo Cat.6/6A (U/UTP)"],
      ["Alcance", "até 70 m"],
      ["Resolução", "1080p Full HD"],
      ["Componentes", "Emissor + recetor"],
      ["Alimentação", "5 V DC (ambas as pontas)"],
    ],
  },
  {
    id: "lcf12-50j",
    name: "Cabo coaxial CELLFLEX 1/2” LCF12-50J",
    brand: "RFS",
    cat: "Sistemas de RF",
    ref: "LCF12-50J",
    desc: "Cabo coaxial de baixa perda com condutor exterior de cobre corrugado, para feeders de estações base e sistemas de RF exigentes.",
    img: "https://www.rfsworld.com/storage/media/3590/RFS-CELLFLEX-LCF12.png",
    specs: [
      ["Impedância", "50 Ω"],
      ["Dimensão", "1/2” (baixa perda)"],
      ["Condutor exterior", "Cobre corrugado"],
      ["Dielétrico", "Espuma (foam PE)"],
      ["Gama de frequências", "até ≈ 8.8 GHz"],
      ["Raio de curvatura mín.", "70 mm (simples)"],
      ["Aplicação", "Feeder para estações rádio"],
    ],
  },
  {
    id: "716m-lcf12",
    name: "Conector coaxial 7/16 DIN (macho)",
    brand: "RFS",
    cat: "Sistemas de RF",
    ref: "716M-LCF12",
    img: null,
    desc: "Conector 7/16 DIN macho para cabo CELLFLEX 1/2”, montagem sem soldadura. (Especificações ilustrativas.)",
    specs: [
      ["Tipo", "7/16 DIN macho"],
      ["Impedância", "50 Ω"],
      ["Para cabo", "LCF12-50J (1/2”)"],
      ["Montagem", "Sem soldadura"],
      ["Vedação", "IP68 (montado)"],
    ],
  },
  {
    id: "rm60",
    name: "Módulo de vedação Roxtec RM 60",
    brand: "Roxtec",
    cat: "Cablagem e Acessórios",
    ref: "RM00100601000",
    desc: "Módulo Roxtec com tecnologia Multidiameter™, adaptável ao diâmetro do cabo através de camadas removíveis. Vedação de cabos e tubos em transições.",
    img: "https://cdn.content-publisher.roxtec.com/images/image:837/529332_523953_RM%2060.jpg",
    specs: [
      ["Tipo", "Módulo multidiâmetro (Multidiameter™)"],
      ["Diâmetro de cabo", "Ø 28–54 mm"],
      ["Material", "Elastómero (EPDM)"],
      ["Adaptação", "Camadas removíveis (peel-off)"],
      ["Aplicação", "Vedação em transições de cabos/tubos"],
    ],
  },
  {
    id: "rm20w40",
    name: "Módulo de vedação Roxtec RM 20w40",
    brand: "Roxtec",
    cat: "Cablagem e Acessórios",
    ref: "RM00120401000",
    desc: "Módulo duplo com tecnologia Multidiameter™ para dois cabos por módulo. (Diâmetros ilustrativos.)",
    img: "https://cdn.content-publisher.roxtec.com/images/image:839/529331_523952_RM%2020w40.jpg",
    specs: [
      ["Tipo", "Módulo duplo (Multidiameter™)"],
      ["Diâmetro de cabo", "2× Ø 3.5–16.5 mm"],
      ["Material", "Elastómero (EPDM)"],
      ["Aplicação", "Dois cabos por módulo"],
    ],
  },
  {
    id: "rm30",
    name: "Módulo de vedação Roxtec RM 30",
    brand: "Roxtec",
    cat: "Cablagem e Acessórios",
    ref: "RM00100301000",
    desc: "Módulo Roxtec com Multidiameter™ para cabos de diâmetro médio. (Diâmetros ilustrativos.)",
    img: "https://cdn.content-publisher.roxtec.com/images/image:835/529328_522107_00835_res.jpg",
    specs: [
      ["Tipo", "Módulo multidiâmetro (Multidiameter™)"],
      ["Diâmetro de cabo", "Ø 10–25 mm"],
      ["Material", "Elastómero (EPDM)"],
      ["Adaptação", "Camadas removíveis (peel-off)"],
    ],
  },
  {
    id: "ht-t50",
    name: "Abraçadeiras T50 (pack 100)",
    brand: "HellermannTyton",
    cat: "Cablagem e Acessórios",
    ref: "111-05059",
    img: null,
    desc: "Abraçadeiras de nylon para feixe de cabos, resistentes a UV. (Especificações ilustrativas.)",
    specs: [
      ["Comprimento", "200 mm"],
      ["Largura", "4.6 mm"],
      ["Material", "Poliamida 6.6 (PA66)"],
      ["Resistência à tração", "225 N"],
      ["Cor", "Natural / Preto (UV)"],
      ["Embalagem", "100 unidades"],
    ],
  },
  {
    id: "ht-helatag",
    name: "Marcador de cabos Helatag",
    brand: "HellermannTyton",
    cat: "Cablagem e Acessórios",
    ref: "TAG13TD3",
    img: null,
    desc: "Etiqueta autoadesiva para identificação de cabos e componentes. (Especificações ilustrativas.)",
    specs: [
      ["Tipo", "Etiqueta autoadesiva"],
      ["Material", "Vinil / poliéster"],
      ["Impressão", "Transferência térmica"],
      ["Aplicação", "Identificação de cabos"],
    ],
  },
  {
    id: "brady-bmp41",
    name: "Impressora de etiquetas BMP41",
    brand: "Brady",
    cat: "Cablagem e Acessórios",
    ref: "BMP41-EU",
    img: null,
    desc: "Impressora portátil para identificação industrial de cabos e equipamentos. (Especificações ilustrativas.)",
    specs: [
      ["Tipo", "Impressora portátil de etiquetas"],
      ["Tecnologia", "Transferência térmica"],
      ["Resolução", "300 dpi"],
      ["Largura de etiqueta", "até 25.4 mm"],
      ["Ecrã", "LCD"],
      ["Alimentação", "Bateria recarregável / AC"],
    ],
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  subcat: SUBCAT[p.id] ?? "Outros",
  stock: STOCK[p.id] ?? "order",
}));

export const STOCK_META: Record<StockKey, { label: string; cls: string }> = {
  in: { label: "Em stock", cls: "s-in" },
  low: { label: "Stock reduzido", cls: "s-low" },
  order: { label: "Sob encomenda", cls: "s-order" },
};

export const DEFAULT_ICON = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>';

const CAT_ICON: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.icon])
);

export const catIcon = (cat: string): string => CAT_ICON[cat] ?? DEFAULT_ICON;

export const countByCat = (key: string): number =>
  PRODUCTS.filter((p) => p.cat === key).length;

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);
