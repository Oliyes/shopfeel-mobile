import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import { getMoodEmoji } from "../utils/moods";
import { colors } from "../theme";

export default function MoodScreen({ navigation, route }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoods();
  }, []);

  async function loadMoods() {
    try {
      setLoading(true);
      const data = await apiRequest("/api/mobile/moods");
      setMoods(data.moods || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.step}>
          {route.params?.firstAccess ? "PASSO 2 DE 2" : "SEU MOMENTO"}
        </Text>

        <Text style={styles.title}>Como você está se sentindo hoje?</Text>
        <Text style={styles.subtitle}>
          Escolha o humor que mais combina com o seu momento.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={styles.moodCard}
                onPress={() =>
                  navigation.navigate("Recommendations", {
                    mood,
                    user: route.params?.user,
                  })
                }
              >
                <Text style={styles.emoji}>
                  {getMoodEmoji(mood.mood_name)}
                </Text>
                <Text style={styles.name}>{mood.mood_name}</Text>
                {!!mood.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {mood.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
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
  step: { color: colors.goldDark, fontSize: 10, letterSpacing: 2, marginTop: 8 },
  title: { color: colors.text, fontSize: 35, lineHeight: 42, fontFamily: "Georgia", marginTop: 12 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 12, marginBottom: 28 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  moodCard: {
    width: "48%",
    minHeight: 148,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  emoji: { fontSize: 34, marginBottom: 15 },
  name: { color: colors.text, fontSize: 17, fontFamily: "Georgia", marginBottom: 6 },
  description: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  back: { textAlign: "center", color: colors.goldDark, marginTop: 8 },
});
