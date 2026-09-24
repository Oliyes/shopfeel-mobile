function normalizeHex(value) {
  const color = String(value || "").trim();

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return null;
}

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

export function getMoodColor(moodOrName) {
  if (typeof moodOrName === "object" && moodOrName) {
    const backendColor = normalizeHex(moodOrName.associated_color);

    if (backendColor) {
      return backendColor;
    }
  }

  const name = String(
    typeof moodOrName === "object"
      ? moodOrName?.mood_name
      : moodOrName || ""
  ).toLowerCase();

  if (name.includes("alegr") || name.includes("otim") || name.includes("feliz")) return "#F4B942";
  if (name.includes("calma") || name.includes("tranquil")) return "#55B7D9";
  if (name.includes("triste")) return "#5B7FC7";
  if (name.includes("raiva") || name.includes("irrit")) return "#E45757";
  if (name.includes("criativ")) return "#9B5DE5";
  if (name.includes("esperan")) return "#55A86B";
  if (name.includes("vital") || name.includes("energia")) return "#F28C38";
  if (name.includes("amor") || name.includes("rom")) return "#E768A2";
  if (name.includes("ansied") || name.includes("ansios")) return "#8B78B8";
  if (name.includes("surpres")) return "#2FB7A8";

  return "#B68235";
}

export function getMoodSoftColor(moodOrName) {
  const color = getMoodColor(moodOrName);

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color + "1F";
  }

  return "#F1ECE4";
}
