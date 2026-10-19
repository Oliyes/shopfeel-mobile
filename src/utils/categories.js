export const PRODUCT_CATEGORIES = [
  { value: "Tecnologia", label: "Tecnologia", emoji: "💻" },
  { value: "Moda", label: "Moda", emoji: "👕" },
  { value: "Beleza", label: "Beleza", emoji: "✨" },
  { value: "Casa", label: "Casa & Conforto", emoji: "🏠" },
  { value: "Livros", label: "Livros", emoji: "📚" },
  { value: "Games", label: "Games & Desafios", emoji: "🎮" },
  { value: "Arte & Criatividade", label: "Arte & Criatividade", emoji: "🎨" },
  { value: "Papelaria & Escrita", label: "Papelaria & Escrita", emoji: "✏️" },
  { value: "Organização", label: "Organização & Produtividade", emoji: "🗂️" },
  { value: "Lazer & Passeios", label: "Lazer & Passeios", emoji: "🧺" },
  { value: "Bem-estar & Relaxamento", label: "Bem-estar & Relaxamento", emoji: "😌" },
  { value: "Natureza & Plantas", label: "Natureza & Plantas", emoji: "🌱" },
  { value: "Fotografia & Memórias", label: "Fotografia & Memórias", emoji: "📷" },
  { value: "Presentes & Afeto", label: "Presentes & Afeto", emoji: "🎁" },
];

export function getCategoryMeta(value) {
  if (!value) return null;

  return (
    PRODUCT_CATEGORIES.find((category) => category.value === value) || {
      value,
      label: value,
      emoji: "🏷️",
    }
  );
}
