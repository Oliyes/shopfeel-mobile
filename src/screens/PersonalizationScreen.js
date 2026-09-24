import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

const interests = [
  ["💻", "Tecnologia", "#55B7D9"],
  ["👕", "Moda", "#E768A2"],
  ["✨", "Beleza", "#9B5DE5"],
  ["🏠", "Casa", "#F4B942"],
  ["📚", "Livros", "#55A86B"],
  ["🎮", "Games", "#5B7FC7"],
];

export default function PersonalizationScreen({ navigation, route }) {
  const [selected, setSelected] = useState([]);

  function toggle(label) {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  async function continueFlow() {
    await AsyncStorage.setItem(
      "shopfeel_interests",
      JSON.stringify(selected)
    );

    navigation.replace("Mood", {
      user: route.params?.user,
      firstAccess: true,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandRow}>
          <BrandLogo size={48} compact />
          <View>
            <Text style={styles.brand}>SHOPFEEL</Text>
            <Text style={styles.step}>PASSO 1 DE 2</Text>
          </View>
        </View>

        <Text style={styles.title}>Vamos deixar o ShopFeel com a sua cara.</Text>
        <Text style={styles.subtitle}>
          Escolha alguns assuntos que você gosta.
        </Text>

        <View style={styles.grid}>
          {interests.map(([emoji, label, accent]) => {
            const active = selected.includes(label);

            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.card,
                  active && {
                    borderColor: accent,
                    backgroundColor: accent + "18",
                  },
                ]}
                onPress={() => toggle(label)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={[styles.cardText, active && { color: accent }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={continueFlow}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={continueFlow}>
          <Text style={styles.skip}>Pular por enquanto</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 24, paddingBottom: 35 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    marginBottom: 24,
  },
  brand: { color: "#9B5DE5", fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  step: { color: colors.muted, fontSize: 10, letterSpacing: 1.2, marginTop: 3 },
  title: { fontSize: 34, lineHeight: 41, fontFamily: "Georgia", color: colors.text },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 12, marginBottom: 28 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    justifyContent: "space-between",
  },
  emoji: { fontSize: 29 },
  cardText: { color: colors.text, fontSize: 15, fontFamily: "Georgia" },
  button: {
    height: 56,
    backgroundColor: "#9B5DE5",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  buttonText: { color: colors.white, fontWeight: "700" },
  skip: { textAlign: "center", color: colors.muted, marginTop: 18, fontSize: 12 },
});
