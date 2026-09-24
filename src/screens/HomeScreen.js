import React, { useCallback, useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";
import { getMoodEmoji, getMoodColor, getMoodSoftColor } from "../utils/moods";
import BottomNav from "../components/BottomNav";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function HomeScreen({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [])
  );

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
            <View style={styles.brandWrap}>
              <BrandLogo size={44} compact />

              <View>
                <Text style={styles.kicker}>SHOPFEEL</Text>
                <Text style={styles.greeting}>
                  {firstName ? "Olá, " + firstName + "." : "Olá."}
                </Text>
              </View>
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
            <View style={styles.heroDots}>
              {["#F4B942","#55A86B","#55B7D9","#5B7FC7","#9B5DE5","#E768A2"].map((color) => (
                <View key={color} style={[styles.heroDot, { backgroundColor: color }]} />
              ))}
            </View>

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

            <TouchableOpacity onPress={() => navigation.navigate("Mood", { user })}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#9B5DE5" />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodRow}
            >
              {moods.map((mood) => {
                const moodColor = getMoodColor(mood);

                return (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodCard,
                      {
                        borderColor: moodColor,
                        backgroundColor: getMoodSoftColor(mood),
                      },
                    ]}
                    onPress={() => openMood(mood)}
                  >
                    <View style={[styles.moodIconCircle, { backgroundColor: moodColor }]}>
                      <Text style={styles.moodEmoji}>
                        {getMoodEmoji(mood.mood_name)}
                      </Text>
                    </View>

                    <Text style={styles.moodName} numberOfLines={2}>
                      {mood.mood_name}
                    </Text>

                    <View style={[styles.colorLine, { backgroundColor: moodColor }]} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <Text style={styles.sectionLabel}>ATALHOS</Text>

          <View style={styles.shortcuts}>
            <TouchableOpacity
              style={[styles.shortcut, styles.searchShortcut]}
              onPress={() => navigation.navigate("Search")}
            >
              <Text style={[styles.shortcutIcon, { color: "#55B7D9" }]}>⌕</Text>
              <Text style={styles.shortcutTitle}>Pesquisar</Text>
              <Text style={styles.shortcutText}>
                Encontre um produto pelo nome.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shortcut, styles.favoriteShortcut]}
              onPress={() => navigation.navigate("Favorites")}
            >
              <Text style={[styles.shortcutIcon, { color: "#E768A2" }]}>♡</Text>
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
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  kicker: { color: "#9B5DE5", fontSize: 9, letterSpacing: 2 },
  greeting: {
    color: colors.text,
    fontSize: 25,
    fontFamily: "Georgia",
    marginTop: 2,
  },
  profileCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#F1E8FA",
    borderWidth: 1,
    borderColor: "#D8C4EF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileLetter: {
    color: "#7B4AB5",
    fontSize: 17,
    fontFamily: "Georgia",
  },
  hero: {
    backgroundColor: colors.text,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    overflow: "hidden",
  },
  heroDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroEyebrow: { color: "#F4B942", fontSize: 9, letterSpacing: 1.8 },
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
    backgroundColor: "#9B5DE5",
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
    color: colors.text,
    fontSize: 10,
    letterSpacing: 1.6,
    marginBottom: 12,
    fontWeight: "700",
  },
  seeAll: { color: "#9B5DE5", fontSize: 11, marginBottom: 12 },
  moodRow: { gap: 10, paddingRight: 20, marginBottom: 28 },
  moodCard: {
    width: 112,
    height: 124,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
  },
  moodIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  moodEmoji: { fontSize: 24 },
  moodName: { color: colors.text, fontSize: 13, fontFamily: "Georgia" },
  colorLine: {
    height: 3,
    borderRadius: 2,
    width: 38,
  },
  shortcuts: { flexDirection: "row", justifyContent: "space-between" },
  shortcut: {
    width: "48%",
    padding: 17,
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  searchShortcut: {
    borderColor: "#BFE6F2",
  },
  favoriteShortcut: {
    borderColor: "#F2C6D9",
  },
  shortcutIcon: { fontSize: 28 },
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
