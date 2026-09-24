import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { apiRequest, getApiAssetUrl } from "../services/api";
import BottomNav from "../components/BottomNav";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  async function loadProfile() {
    try {
      const data = await apiRequest("/api/me");
      setUser(data.customer);
      setName(data.customer?.name || "");
    } catch (error) {
      Alert.alert("Perfil", error.message);
    }
  }

  async function saveName() {
    if (!name.trim()) return;

    try {
      const data = await apiRequest("/api/me", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });

      setUser(data.customer);

      await AsyncStorage.setItem(
        "shopfeel_user",
        JSON.stringify(data.customer)
      );

      Alert.alert("Perfil", "Nome atualizado com sucesso.");
    } catch (error) {
      Alert.alert("Perfil", error.message);
    }
  }

  async function changePhoto() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso às fotos para escolher uma imagem de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      const formData = new FormData();

      formData.append("photo", {
        uri: asset.uri,
        name: asset.fileName || "shopfeel-profile.jpg",
        type: asset.mimeType || "image/jpeg",
      });

      setUploadingPhoto(true);

      const data = await apiRequest("/api/me/photo", {
        method: "POST",
        body: formData,
      });

      const updatedUser = {
        ...user,
        photo: data.photo,
      };

      setUser(updatedUser);

      await AsyncStorage.setItem(
        "shopfeel_user",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      Alert.alert(
        "Foto de perfil",
        error.message || "Não foi possível alterar a foto."
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  const photoUrl = getApiAssetUrl(user?.photo);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <BrandLogo size={48} compact />

            <View>
              <Text style={styles.kicker}>SUA CONTA</Text>
              <Text style={styles.title}>Perfil</Text>
            </View>
          </View>

          <View style={styles.photoArea}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={changePhoto}
              disabled={uploadingPhoto}
              activeOpacity={0.8}
            >
              {photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.photo}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {(user?.name || "S").slice(0, 1).toUpperCase()}
                </Text>
              )}

              {uploadingPhoto && (
                <View style={styles.photoLoading}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={changePhoto}
              disabled={uploadingPhoto}
            >
              <Text style={styles.changePhoto}>
                {uploadingPhoto
                  ? "Enviando foto..."
                  : "Alterar foto de perfil"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.email}>
            {user?.email || "Carregando..."}
          </Text>

          <Text style={styles.label}>Nome</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={saveName}
          >
            <Text style={styles.buttonText}>
              Salvar alterações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settings}
            onPress={() => navigation.navigate("Settings")}
          >
            <View>
              <Text style={styles.settingsTitle}>
                Configurações
              </Text>

              <Text style={styles.settingsSubtitle}>
                Sobre, referências, preferências e sessão
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNav navigation={navigation} active="Profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  container: { padding: 22, paddingBottom: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  kicker: {
    color: "#55A86B",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontFamily: "Georgia",
    marginTop: 2,
  },
  photoArea: {
    alignItems: "flex-start",
    marginTop: 28,
  },
  avatar: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: "#F1E8FA",
    borderWidth: 2,
    borderColor: "#D8C4EF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 35,
    color: "#7B4AB5",
    fontFamily: "Georgia",
  },
  changePhoto: {
    color: "#9B5DE5",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  email: {
    color: colors.muted,
    marginTop: 14,
    marginBottom: 28,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 7,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#CFE7D5",
    borderRadius: 14,
    backgroundColor: colors.surface,
    paddingHorizontal: 15,
    color: colors.text,
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#55A86B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
  },
  settings: {
    marginTop: 28,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Georgia",
  },
  settingsSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
    maxWidth: 250,
  },
  arrow: {
    color: "#9B5DE5",
    fontSize: 28,
  },
});
