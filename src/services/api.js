import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch as expoFetch } from "expo/fetch";
import { File } from "expo-file-system";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.100.137:3000";

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
      data?.error || "Erro ao conectar com o servidor"
    );
  }

  return data;
}

export async function apiRequest(endpoint, options = {}) {
  const token = await AsyncStorage.getItem("shopfeel_token");

  const response = await fetch(API_URL + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
  });

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
