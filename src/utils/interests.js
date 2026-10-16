const INTEREST_KEYWORDS = {
  Tecnologia: [
    "tecnologia", "eletronico", "eletrônico", "bluetooth", "fone", "headphone",
    "caixa de som", "smart", "celular", "smartphone", "tablet", "carregador",
    "power bank", "impressora", "digital", "tripé", "tripe", "smartband"
  ],
  Moda: [
    "moda", "roupa", "camiseta", "camisa", "blusa", "vestido", "calça", "calca",
    "jeans", "tênis", "tenis", "sapato", "bolsa", "mochila", "boné", "bone",
    "acessório", "acessorio", "colar", "pulseira"
  ],
  Beleza: [
    "beleza", "maquiagem", "skincare", "cosmético", "cosmetico", "perfume",
    "hidratante", "creme", "esmalte", "pincel", "cabelo", "espelho"
  ],
  Casa: [
    "casa", "decoração", "decoracao", "organizador", "luminária", "luminaria",
    "almofada", "manta", "caneca", "quadro", "vaso", "cozinha", "quarto", "mesa"
  ],
  Livros: [
    "livro", "leitura", "romance", "história", "historia", "literatura"
  ],
  Games: [
    "game", "gamer", "jogo", "videogame", "video game", "controle", "tabuleiro",
    "cartas", "quebra-cabeça", "quebra-cabeca", "puzzle", "sudoku", "enigma"
  ],
  "Arte & Criatividade": [
    "arte", "criatividade", "criativo", "pintura", "tela", "marcador", "marcadores",
    "argila", "massa", "modelagem", "desenho", "digitalizadora", "construção criativa",
    "construcao criativa", "diy", "faça você mesmo", "faca voce mesmo"
  ],
  "Papelaria & Escrita": [
    "papelaria", "caderno", "bullet journal", "diário", "diario", "cartão", "cartao",
    "caneta", "lápis", "lapis", "marcador", "escrita", "álbum", "album"
  ],
  Organização: [
    "organização", "organizacao", "organizador", "planner", "planejamento", "quadro branco",
    "timer", "agenda", "produtividade", "suporte", "mesa"
  ],
  "Lazer & Passeios": [
    "lazer", "passeio", "piquenique", "mochila", "tripé", "tripe", "portátil", "portatil",
    "amigos", "família", "familia", "viagem"
  ],
  "Bem-estar & Relaxamento": [
    "bem-estar", "bem estar", "relaxamento", "máscara de dormir", "mascara de dormir",
    "almofada", "ruído branco", "ruido branco", "confortável", "confortavel", "sensorial",
    "fidget", "isolamento de ruído", "isolamento de ruido"
  ],
  "Natureza & Plantas": [
    "natureza", "planta", "plantas", "cultivo", "jardim", "vaso", "semente"
  ],
  "Fotografia & Memórias": [
    "foto", "fotos", "fotografia", "memória", "memoria", "recordação", "recordacao",
    "porta-retrato", "porta retrato", "álbum", "album", "impressora de fotos", "tripé", "tripe"
  ],
  "Presentes & Afeto": [
    "presente", "presentes", "afeto", "carinho", "personalizada", "personalizado",
    "caneca", "cartões", "cartoes", "papelaria para presentes", "manta", "recordação", "recordacao"
  ],
};

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesProductInterests(product, selectedInterests) {
  const interests = Array.isArray(selectedInterests)
    ? selectedInterests.filter(Boolean)
    : [];

  if (interests.length === 0) {
    return true;
  }

  const explicitCategories = [
    product?.interest_category,
    product?.category,
    product?.category_name,
  ]
    .filter(Boolean)
    .map(normalizeText);

  const searchableText = normalizeText(
    [product?.name, product?.description, product?.store_name]
      .filter(Boolean)
      .join(" ")
  );

  return interests.some((interest) => {
    const normalizedInterest = normalizeText(interest);

    if (explicitCategories.includes(normalizedInterest)) {
      return true;
    }

    const keywords = INTEREST_KEYWORDS[interest] || [interest];

    return keywords.some((keyword) =>
      searchableText.includes(normalizeText(keyword))
    );
  });
}
