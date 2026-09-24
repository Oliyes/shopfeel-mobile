import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function SettingsScreen({ navigation }) {
  async function logout() {
    await AsyncStorage.multiRemove([
      "shopfeel_token",
      "shopfeel_user",
    ]);

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  function confirmLogout() {
    Alert.alert(
      "Sair da conta",
      "Deseja realmente encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <BrandLogo size={48} compact />
          <View>
            <Text style={styles.kicker}>SHOPFEEL</Text>
            <Text style={styles.title}>Configurações</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.block}
          onPress={() => navigation.navigate("About")}
        >
          <View>
            <Text style={styles.itemTitle}>Sobre o ShopFeel</Text>
            <Text style={styles.itemText}>
              Conheça a proposta, funcionamento e objetivo do aplicativo.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => navigation.navigate("References")}
        >
          <View>
            <Text style={styles.itemTitle}>Referências</Text>
            <Text style={styles.itemText}>
              Base conceitual sobre cores, humor e experiência do usuário.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.block}>
          <View>
            <Text style={styles.itemTitle}>Preferências</Text>
            <Text style={styles.itemText}>
              Suas escolhas iniciais ficam salvas neste dispositivo.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logout} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 40 },
  back: { color: "#9B5DE5", fontSize: 15, marginBottom: 28 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 26 },
  kicker: { color: "#9B5DE5", fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  title: { color: colors.text, fontSize: 33, fontFamily: "Georgia", marginTop: 2 },
  block: {
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  itemTitle: { color: colors.text, fontSize: 16, fontFamily: "Georgia" },
  itemText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 270 },
  arrow: { color: "#9B5DE5", fontSize: 27 },
  logout: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 34,
  },
  logoutText: { color: colors.danger, fontWeight: "700" },
});
