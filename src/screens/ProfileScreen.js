import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../services/api";
import BottomNav from "../components/BottomNav";
import { colors } from "../theme";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.kicker}>SUA CONTA</Text>
          <Text style={styles.title}>Perfil</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || "S").slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.email}>{user?.email || "Carregando..."}</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={saveName}>
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settings}
            onPress={() => navigation.navigate("Settings")}
          >
            <View>
              <Text style={styles.settingsTitle}>Configurações</Text>
              <Text style={styles.settingsSubtitle}>
                Conta, sessão e preferências
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
  kicker: { color: colors.goldDark, fontSize: 10, letterSpacing: 2 },
  title: { color: colors.text, fontSize: 36, fontFamily: "Georgia", marginTop: 6 },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: "#EFE2CF", alignItems: "center", justifyContent: "center", marginTop: 28 },
  avatarText: { fontSize: 35, color: colors.goldDark, fontFamily: "Georgia" },
  email: { color: colors.muted, marginTop: 12, marginBottom: 28 },
  label: { color: colors.text, fontSize: 12, marginBottom: 7 },
  input: { height: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.surface, paddingHorizontal: 15, color: colors.text },
  button: { height: 52, borderRadius: 14, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center", marginTop: 14 },
  buttonText: { color: colors.white, fontWeight: "700" },
  settings: { marginTop: 28, paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  settingsTitle: { color: colors.text, fontSize: 16, fontFamily: "Georgia" },
  settingsSubtitle: { color: colors.muted, fontSize: 11, marginTop: 4 },
  arrow: { color: colors.goldDark, fontSize: 28 },
});
