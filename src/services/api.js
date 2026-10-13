import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch as expoFetch } from "expo/fetch";
import { File } from "expo-file-system";

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "http://10.0.2.2:3000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 12000;

console.log("[ShopFeel] API:", API_URL);

async function parseResponse(response) {
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
      data?.error ||
        data?.message ||
        `Erro ${response.status} ao conectar com o servidor.`
    );
  }

  return data;
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(
        "O servidor demorou para responder. Verifique se o backend está ligado e tente novamente."
      );
    }

    throw new Error(
      "Não foi possível conectar ao backend do ShopFeel. Confira a rede e o endereço da API."
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = await AsyncStorage.getItem("shopfeel_token");

  const response = await fetchJsonWithTimeout(API_URL + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
  });

  return parseResponse(response);
}

export async function checkApiConnection() {
  const response = await fetchJsonWithTimeout(
    API_URL + "/health",
    { method: "GET" },
    6000
  );

  return parseResponse(response);
}

export async function uploadProfilePhoto(fileUri) {
  const token = await AsyncStorage.getItem("shopfeel_token");

  if (!token) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const file = new File(fileUri);
  const formData = new FormData();

  formData.append("photo", file);

  const response = await expoFetch(
    API_URL + "/api/me/photo",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    }
  );

  return parseResponse(response);
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
