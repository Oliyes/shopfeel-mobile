const INTEREST_KEYWORDS = {
  Tecnologia: [
    "tecnologia",
    "eletronico",
    "eletrônico",
    "bluetooth",
    "fone",
    "headphone",
    "caixa de som",
    "smart",
    "celular",
    "smartphone",
    "tablet",
    "carregador",
    "power bank",
    "impressora",
    "digital",
    "tripé",
    "tripe",
    "smartband",
  ],
  Moda: [
    "moda",
    "roupa",
    "camiseta",
    "camisa",
    "blusa",
    "vestido",
    "calça",
    "calca",
    "jeans",
    "tênis",
    "tenis",
    "sapato",
    "bolsa",
    "mochila",
    "boné",
    "bone",
    "acessório",
    "acessorio",
    "colar",
    "pulseira",
  ],
  Beleza: [
    "beleza",
    "maquiagem",
    "skincare",
    "cosmético",
    "cosmetico",
    "perfume",
    "hidratante",
    "creme",
    "esmalte",
    "pincel",
    "cabelo",
    "espelho",
  ],
  Casa: [
    "casa",
    "decoração",
    "decoracao",
    "organizador",
    "luminária",
    "luminaria",
    "almofada",
    "manta",
    "caneca",
    "quadro",
    "planta",
    "vaso",
    "cozinha",
    "quarto",
    "mesa",
    "ruído branco",
    "ruido branco",
  ],
  Livros: [
    "livro",
    "caderno",
    "planner",
    "diário",
    "diario",
    "bullet journal",
    "papelaria",
    "sudoku",
    "enigma",
    "álbum",
    "album",
    "cartão",
    "cartao",
  ],
  Games: [
    "game",
    "gamer",
    "jogo",
    "videogame",
    "video game",
    "controle",
    "tabuleiro",
    "cartas",
    "quebra-cabeça",
    "quebra-cabeca",
    "puzzle",
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
    [
      product?.name,
      product?.description,
      product?.store_name,
    ]
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
