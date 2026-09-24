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
import { colors } from "../theme";

const interests = [
  ["💻", "Tecnologia"],
  ["👕", "Moda"],
  ["✨", "Beleza"],
  ["🏠", "Casa"],
  ["📚", "Livros"],
  ["🎮", "Games"],
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
        <Text style={styles.step}>PASSO 1 DE 2</Text>
        <Text style={styles.title}>Vamos deixar o ShopFeel com a sua cara.</Text>
        <Text style={styles.subtitle}>
          Escolha alguns assuntos que você gosta.
        </Text>

        <View style={styles.grid}>
          {interests.map(([emoji, label]) => {
            const active = selected.includes(label);

            return (
              <TouchableOpacity
                key={label}
                style={[styles.card, active && styles.cardActive]}
                onPress={() => toggle(label)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={[styles.cardText, active && styles.cardTextActive]}>
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
  step: { color: colors.goldDark, fontSize: 10, letterSpacing: 2, marginTop: 12 },
  title: { fontSize: 34, lineHeight: 41, fontFamily: "Georgia", color: colors.text, marginTop: 12 },
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
  cardActive: { borderColor: colors.gold, backgroundColor: "#FFF5E7" },
  emoji: { fontSize: 29 },
  cardText: { color: colors.text, fontSize: 15, fontFamily: "Georgia" },
  cardTextActive: { color: colors.goldDark },
  button: {
    height: 56,
    backgroundColor: colors.gold,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  buttonText: { color: colors.white, fontWeight: "700" },
  skip: { textAlign: "center", color: colors.muted, marginTop: 18, fontSize: 12 },
});
