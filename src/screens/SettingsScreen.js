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

  const options = [
    {
      title: "Preferências",
      text: "Interesses, tela inicial e exibição dos humores.",
      route: "Preferences",
      color: "#55B7D9",
    },
    {
      title: "Sobre o ShopFeel",
      text: "Entenda a proposta, o funcionamento e a identidade do projeto.",
      route: "About",
      color: "#9B5DE5",
    },
    {
      title: "Referências",
      text: "Fundamentos usados na experiência, cores e organização do aplicativo.",
      route: "References",
      color: "#55A86B",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <BrandLogo size={52} compact />
          <View>
            <Text style={styles.kicker}>SHOPFEEL</Text>
            <Text style={styles.title}>Configurações</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONTA E EXPERIÊNCIA</Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option.route}
            style={styles.block}
            onPress={() => navigation.navigate(option.route)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconBox, { backgroundColor: option.color + "20" }]}>
              <View style={[styles.iconDot, { backgroundColor: option.color }]} />
            </View>

            <View style={styles.blockText}>
              <Text style={styles.itemTitle}>{option.title}</Text>
              <Text style={styles.itemText}>{option.text}</Text>
            </View>

            <Text style={[styles.arrow, { color: option.color }]}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Sua conta</Text>
          <Text style={styles.infoText}>
            Nome e foto podem ser alterados na tela de Perfil. Seus favoritos ficam salvos na sua conta.
          </Text>
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 28,
  },
  kicker: {
    color: "#9B5DE5",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 33,
    fontFamily: "Georgia",
    marginTop: 2,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  block: {
    minHeight: 88,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
  },
  blockText: { flex: 1 },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Georgia",
  },
  itemText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  arrow: { fontSize: 28 },
  infoBox: {
    marginTop: 26,
    padding: 17,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  infoText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  logout: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  logoutText: { color: colors.danger, fontWeight: "700" },
});
