export function getMoodEmoji(name) {
  const value = String(name || "").toLowerCase();

  if (value.includes("alegr") || value.includes("otim") || value.includes("feliz")) return "😊";
  if (value.includes("calma") || value.includes("tranquil")) return "😌";
  if (value.includes("triste")) return "😢";
  if (value.includes("raiva") || value.includes("irrit")) return "😠";
  if (value.includes("criativ")) return "🤩";
  if (value.includes("esperan")) return "🌱";
  if (value.includes("vital") || value.includes("energia")) return "⚡";
  if (value.includes("amor") || value.includes("rom")) return "🥰";
  if (value.includes("ansied") || value.includes("ansios")) return "😰";
  if (value.includes("surpres")) return "😮";

  return "🙂";
}
