import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.100.137:3000";

export async function apiRequest(endpoint, options = {}) {
  const token = await AsyncStorage.getItem("shopfeel_token");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(API_URL + endpoint, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.error || "Erro ao conectar com o servidor"
    );
  }

  return data;
}

export function getApiAssetUrl(path) {
  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return API_URL + path;
}

export { API_URL };
