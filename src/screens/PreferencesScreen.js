import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

const interests = [
  ["💻", "Tecnologia", "#55B7D9"],
  ["👕", "Moda", "#E768A2"],
  ["✨", "Beleza", "#9B5DE5"],
  ["🏠", "Casa", "#F4C542"],
  ["📚", "Livros", "#55A86B"],
  ["🎮", "Games", "#5B7FC7"],
];

export default function PreferencesScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [startScreen, setStartScreen] = useState("Home");
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [saved, setSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, [])
  );

  async function loadPreferences() {
    const [
      savedInterests,
      savedStartScreen,
      savedDescriptions,
    ] = await Promise.all([
      AsyncStorage.getItem("shopfeel_interests"),
      AsyncStorage.getItem("shopfeel_start_screen"),
      AsyncStorage.getItem("shopfeel_show_mood_descriptions"),
    ]);

    if (savedInterests) {
      setSelected(JSON.parse(savedInterests));
    }

    if (savedStartScreen) {
      setStartScreen(savedStartScreen);
    }

    if (savedDescriptions !== null) {
      setShowDescriptions(savedDescriptions === "true");
    }

    setSaved(false);
  }

  function toggleInterest(label) {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
    setSaved(false);
  }

  async function savePreferences() {
    await Promise.all([
      AsyncStorage.setItem(
        "shopfeel_interests",
        JSON.stringify(selected)
      ),
      AsyncStorage.setItem(
        "shopfeel_start_screen",
        startScreen
      ),
      AsyncStorage.setItem(
        "shopfeel_show_mood_descriptions",
        String(showDescriptions)
      ),
    ]);

    setSaved(true);
    Alert.alert("Preferências", "Suas preferências foram salvas.");
  }

  async function restoreDefaults() {
    setSelected([]);
    setStartScreen("Home");
    setShowDescriptions(true);

    await Promise.all([
      AsyncStorage.removeItem("shopfeel_interests"),
      AsyncStorage.removeItem("shopfeel_start_screen"),
      AsyncStorage.removeItem("shopfeel_show_mood_descriptions"),
    ]);

    setSaved(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <BrandLogo size={50} compact />
          <View>
            <Text style={styles.kicker}>PERSONALIZAÇÃO</Text>
            <Text style={styles.title}>Preferências</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seus interesses</Text>
        <Text style={styles.sectionText}>
          Você pode atualizar os temas escolhidos no primeiro acesso.
        </Text>

        <View style={styles.grid}>
          {interests.map(([emoji, label, accent]) => {
            const active = selected.includes(label);

            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.interestCard,
                  active && {
                    borderColor: accent,
                    backgroundColor: accent + "18",
                  },
                ]}
                onPress={() => toggleInterest(label)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
                <Text
                  style={[
                    styles.interestText,
                    active && { color: accent },
                  ]}
                >
                  {label}
                </Text>
                {active && (
                  <Text style={[styles.check, { color: accent }]}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Ao abrir o app</Text>
        <Text style={styles.sectionText}>
          Escolha qual tela aparece primeiro quando sua sessão já estiver conectada.
        </Text>

        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[
              styles.choice,
              startScreen === "Home" && styles.choiceSelected,
            ]}
            onPress={() => {
              setStartScreen("Home");
              setSaved(false);
            }}
          >
            <Text style={styles.choiceIcon}>⌂</Text>
            <Text style={styles.choiceTitle}>Início</Text>
            <Text style={styles.choiceText}>Abre a Home do ShopFeel.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choice,
              startScreen === "Mood" && styles.choiceSelected,
            ]}
            onPress={() => {
              setStartScreen("Mood");
              setSaved(false);
            }}
          >
            <Text style={styles.choiceIcon}>☺</Text>
            <Text style={styles.choiceTitle}>Humor</Text>
            <Text style={styles.choiceText}>Vai direto para a escolha do humor.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.sectionTitle}>Descrição dos humores</Text>
            <Text style={styles.sectionText}>
              Mostrar o pequeno texto explicativo em cada card de humor.
            </Text>
          </View>

          <Switch
            value={showDescriptions}
            onValueChange={(value) => {
              setShowDescriptions(value);
              setSaved(false);
            }}
            trackColor={{
              false: "#D9D9D9",
              true: "#D8C4EF",
            }}
            thumbColor={
              showDescriptions
                ? "#9B5DE5"
                : "#F3F3F3"
            }
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePreferences}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "Preferências salvas ✓" : "Salvar preferências"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={restoreDefaults}
        >
          <Text style={styles.resetText}>Restaurar padrão</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 45 },
  back: { color: "#9B5DE5", fontSize: 15, marginBottom: 26 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontFamily: "Georgia",
  },
  sectionText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  interestCard: {
    width: "48%",
    height: 76,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 13,
    marginBottom: 12,
    justifyContent: "center",
  },
  emoji: { fontSize: 21 },
  interestText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: "Georgia",
    marginTop: 5,
  },
  check: {
    position: "absolute",
    top: 10,
    right: 12,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  choice: {
    width: "48%",
    minHeight: 126,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
  },
  choiceSelected: {
    borderColor: "#9B5DE5",
    backgroundColor: "#F5EEFB",
  },
  choiceIcon: {
    fontSize: 25,
    color: "#9B5DE5",
  },
  choiceTitle: {
    marginTop: 10,
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  choiceText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  switchText: { flex: 1 },
  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#9B5DE5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  resetButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  resetText: {
    color: colors.muted,
    fontSize: 12,
  },
});
