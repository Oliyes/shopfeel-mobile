function normalizeHex(value) {
  const color = String(value || "").trim();

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return null;
}

const namedColors = {
  amarelo: "#F4C542",
  azul: "#5BA7E1",
  vermelho: "#E45757",
  roxo: "#9B5DE5",
  "roxo / lilás": "#9B5DE5",
  lilas: "#B083E8",
  "lilás": "#B083E8",
  verde: "#55A86B",
  laranja: "#F28C38",
  rosa: "#E768A2",
  cinza: "#9CA3AF",
  preto: "#2F3136",
  branco: "#FFFFFF",
};

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function getMoodEmoji(name) {
  const value = normalizeName(name);

  if (value.includes("alegr") || value.includes("otim") || value.includes("feliz")) return "😊";
  if (value.includes("calma") || value.includes("seren")) return "😌";
  if (value.includes("raiva") || value.includes("paix")) return "😠";
  if (value.includes("criativ") || value.includes("mist")) return "🤩";
  if (value.includes("equil") || value.includes("esperan")) return "🌱";
  if (value.includes("entusias") || value.includes("vital")) return "⚡";
  if (value.includes("compaix") || value.includes("ternura")) return "🥰";
  if (value.includes("tédio") || value.includes("tedio") || value.includes("neutral")) return "😐";
  if (value.includes("luto") || value.includes("poder")) return "🖤";
  if (value.includes("paz") || value.includes("clareza")) return "🤍";

  return "🙂";
}

export function getMoodColor(moodOrName) {
  if (typeof moodOrName === "object" && moodOrName) {
    const backendColor = normalizeHex(moodOrName.associated_color);

    if (backendColor) {
      return backendColor;
    }

    const namedBackendColor =
      namedColors[normalizeName(moodOrName.associated_color)];

    if (namedBackendColor) {
      return namedBackendColor;
    }
  }

  const name = normalizeName(
    typeof moodOrName === "object"
      ? moodOrName?.mood_name
      : moodOrName
  );

  if (name.includes("alegr") || name.includes("otim")) return namedColors.amarelo;
  if (name.includes("calma") || name.includes("seren")) return namedColors.azul;
  if (name.includes("raiva") || name.includes("paix")) return namedColors.vermelho;
  if (name.includes("criativ") || name.includes("mist")) return namedColors.roxo;
  if (name.includes("equil") || name.includes("esperan")) return namedColors.verde;
  if (name.includes("entusias") || name.includes("vital")) return namedColors.laranja;
  if (name.includes("compaix") || name.includes("ternura")) return namedColors.rosa;
  if (name.includes("tédio") || name.includes("tedio") || name.includes("neutral")) return namedColors.cinza;
  if (name.includes("luto") || name.includes("poder")) return namedColors.preto;
  if (name.includes("paz") || name.includes("clareza")) return namedColors.branco;

  return "#9B5DE5";
}

export function getMoodBorderColor(moodOrName) {
  const color = getMoodColor(moodOrName).toUpperCase();

  if (color === "#FFFFFF") return "#C9CDD3";
  if (color === "#2F3136") return "#2F3136";

  return color;
}

export function getMoodSoftColor(moodOrName) {
  const color = getMoodColor(moodOrName).toUpperCase();

  if (color === "#FFFFFF") return "#FFFFFF";
  if (color === "#2F3136") return "#ECEDEF";
  if (color === "#9CA3AF") return "#F1F2F3";

  return color + "1F";
}

export function getMoodTextColor(moodOrName) {
  const color = getMoodColor(moodOrName).toUpperCase();

  if (color === "#FFFFFF") return "#6B7280";
  return color;
}
