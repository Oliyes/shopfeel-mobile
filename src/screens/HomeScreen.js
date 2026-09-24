import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import { getMoodEmoji } from "../utils/moods";
import BottomNav from "../components/BottomNav";
import { colors } from "../theme";

export default function HomeScreen({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    try {
      setLoading(true);

      if (!user) {
        const saved = await AsyncStorage.getItem("shopfeel_user");
        if (saved) setUser(JSON.parse(saved));
      }

      const data = await apiRequest("/api/mobile/moods");
      setMoods(data.moods || []);
    } finally {
      setLoading(false);
    }
  }

  function openMood(mood) {
    navigation.navigate("Recommendations", {
      mood,
      user,
    });
  }

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>SHOPFEEL</Text>
              <Text style={styles.greeting}>
                {firstName ? "Olá, " + firstName + "." : "Olá."}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileCircle}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.profileLetter}>
                {(user?.name || "S").slice(0, 1).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>SEU HUMOR, SUA ESCOLHA</Text>
            <Text style={styles.heroTitle}>
              Como você está se sentindo hoje?
            </Text>
            <Text style={styles.heroText}>
              Escolha um humor e descubra produtos selecionados para esse momento.
            </Text>

            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate("Mood", { user })}
            >
              <Text style={styles.heroButtonText}>Escolher meu humor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>HUMORES</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Mood", { user })}
            >
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.gold} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodRow}
            >
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={styles.moodCard}
                  onPress={() => openMood(mood)}
                >
                  <Text style={styles.moodEmoji}>
                    {getMoodEmoji(mood.mood_name)}
                  </Text>

                  <Text style={styles.moodName} numberOfLines={2}>
                    {mood.mood_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={styles.sectionLabel}>ATALHOS</Text>

          <View style={styles.shortcuts}>
            <TouchableOpacity
              style={styles.shortcut}
              onPress={() => navigation.navigate("Search")}
            >
              <Text style={styles.shortcutIcon}>⌕</Text>
              <Text style={styles.shortcutTitle}>Pesquisar</Text>
              <Text style={styles.shortcutText}>
                Encontre um produto pelo nome.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcut}
              onPress={() => navigation.navigate("Favorites")}
            >
              <Text style={styles.shortcutIcon}>♡</Text>
              <Text style={styles.shortcutTitle}>Favoritos</Text>
              <Text style={styles.shortcutText}>
                Reveja o que você mais gostou.
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} active="Home" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  container: { padding: 22, paddingBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  kicker: { color: colors.goldDark, fontSize: 9, letterSpacing: 2 },
  greeting: {
    color: colors.text,
    fontSize: 27,
    fontFamily: "Georgia",
    marginTop: 4,
  },
  profileCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#EFE2CF",
    borderWidth: 1,
    borderColor: "#DEC6A1",
    alignItems: "center",
    justifyContent: "center",
  },
  profileLetter: {
    color: colors.goldDark,
    fontSize: 17,
    fontFamily: "Georgia",
  },
  hero: {
    backgroundColor: colors.text,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },
  heroEyebrow: { color: "#D9B77A", fontSize: 9, letterSpacing: 1.8 },
  heroTitle: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 35,
    fontFamily: "Georgia",
    marginTop: 8,
  },
  heroText: {
    color: "#D7D1CA",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginTop: 20,
  },
  heroButtonText: { color: colors.white, fontWeight: "700", fontSize: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    color: colors.goldDark,
    fontSize: 10,
    letterSpacing: 1.6,
    marginBottom: 12,
  },
  seeAll: { color: colors.muted, fontSize: 11, marginBottom: 12 },
  moodRow: { gap: 10, paddingRight: 20, marginBottom: 28 },
  moodCard: {
    width: 105,
    height: 112,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 14,
    justifyContent: "space-between",
  },
  moodEmoji: { fontSize: 31 },
  moodName: { color: colors.text, fontSize: 13, fontFamily: "Georgia" },
  shortcuts: { flexDirection: "row", justifyContent: "space-between" },
  shortcut: {
    width: "48%",
    padding: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  shortcutIcon: { color: colors.goldDark, fontSize: 28 },
  shortcutTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Georgia",
    marginTop: 10,
  },
  shortcutText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },
});
