import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";
import { getMoodEmoji, getMoodColor, getMoodSoftColor } from "../utils/moods";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function MoodScreen({ navigation, route }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMoods();
    }, [])
  );

  async function loadMoods() {
    try {
      setLoading(true);
      const [data, savedDescriptions] = await Promise.all([
        apiRequest("/api/mobile/moods"),
        AsyncStorage.getItem("shopfeel_show_mood_descriptions"),
      ]);

      setMoods(data.moods || []);

      if (savedDescriptions !== null) {
        setShowDescriptions(savedDescriptions === "true");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandRow}>
          <BrandLogo size={48} compact />

          <View>
            <Text style={styles.brand}>SHOPFEEL</Text>
            <Text style={styles.step}>
              {route.params?.firstAccess ? "PASSO 2 DE 2" : "SEU MOMENTO"}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Como você está se sentindo hoje?</Text>
        <Text style={styles.subtitle}>
          Cada humor tem sua própria cor e uma curadoria diferente para você.
        </Text>

        {loading ? (
          <ActivityIndicator color="#9B5DE5" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
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
                  onPress={() =>
                    navigation.navigate("Recommendations", {
                      mood,
                      user: route.params?.user,
                    })
                  }
                >
                  <View style={[styles.emojiCircle, { backgroundColor: moodColor }]}>
                    <Text style={styles.emoji}>
                      {getMoodEmoji(mood.mood_name)}
                    </Text>
                  </View>

                  <Text style={styles.name}>{mood.mood_name}</Text>

                  {showDescriptions && !!mood.description && (
                    <Text style={styles.description} numberOfLines={2}>
                      {mood.description}
                    </Text>
                  )}

                  <View style={[styles.accent, { backgroundColor: moodColor }]} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!route.params?.firstAccess && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>Voltar</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 23,
  },
  brand: {
    color: "#9B5DE5",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  step: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 3,
  },
  title: {
    color: colors.text,
    fontSize: 35,
    lineHeight: 42,
    fontFamily: "Georgia",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodCard: {
    width: "48%",
    minHeight: 166,
    borderWidth: 1.2,
    borderRadius: 21,
    padding: 16,
    marginBottom: 14,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emoji: { fontSize: 27 },
  name: {
    color: colors.text,
    fontSize: 17,
    fontFamily: "Georgia",
    marginBottom: 6,
  },
  description: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  accent: {
    marginTop: "auto",
    height: 4,
    width: 36,
    borderRadius: 2,
  },
  back: { textAlign: "center", color: "#9B5DE5", marginTop: 8 },
});
