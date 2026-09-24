import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.kicker}>CONTA</Text>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.block}>
        <Text style={styles.itemTitle}>Preferências</Text>
        <Text style={styles.itemText}>
          Suas escolhas iniciais ficam salvas neste dispositivo.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.itemTitle}>Sobre o ShopFeel</Text>
        <Text style={styles.itemText}>
          Recomendações de produtos de acordo com o seu humor.
        </Text>
      </View>

      <TouchableOpacity style={styles.logout} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  back: { color: colors.goldDark, fontSize: 15, marginBottom: 40 },
  kicker: { color: colors.goldDark, fontSize: 10, letterSpacing: 2 },
  title: { color: colors.text, fontSize: 35, fontFamily: "Georgia", marginTop: 7, marginBottom: 25 },
  block: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemTitle: { color: colors.text, fontSize: 16, fontFamily: "Georgia" },
  itemText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  logout: { height: 52, borderWidth: 1, borderColor: colors.danger, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 34 },
  logoutText: { color: colors.danger, fontWeight: "700" },
});
