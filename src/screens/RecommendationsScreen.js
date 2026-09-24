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
import ProductCard from "../components/ProductCard";
import { getMoodEmoji } from "../utils/moods";
import { colors } from "../theme";

export default function RecommendationsScreen({ navigation, route }) {
  const mood = route.params?.mood;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [mood?.id]);

  async function loadRecommendations() {
    if (!mood?.id) return;

    try {
      setLoading(true);
      const data = await apiRequest(
        "/api/mobile/recommendations/" + mood.id
      );
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.emoji}>{getMoodEmoji(mood?.mood_name)}</Text>
        <Text style={styles.kicker}>ESCOLHA SHOPFEEL</Text>
        <Text style={styles.title}>
          Para o seu momento de {mood?.mood_name || "hoje"}
        </Text>
        <Text style={styles.subtitle}>
          Selecionamos produtos que combinam com esse humor.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 50 }} />
        ) : products.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Ainda não há produtos nessa curadoria.
            </Text>
            <Text style={styles.emptyText}>
              Cadastre produtos no painel web e relacione-os a esse humor.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate("ProductDetail", { product })
                }
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            navigation.navigate("Home", {
              user: route.params?.user,
            })
          }
        >
          <Text style={styles.homeButtonText}>Ir para o início</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 22, paddingBottom: 35 },
  back: { color: colors.goldDark, fontSize: 15, marginBottom: 24 },
  emoji: { fontSize: 42, marginBottom: 12 },
  kicker: { color: colors.goldDark, fontSize: 10, letterSpacing: 2 },
  title: { color: colors.text, fontSize: 32, lineHeight: 39, fontFamily: "Georgia", marginTop: 8 },
  subtitle: { color: colors.muted, marginTop: 9, marginBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  empty: { padding: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginTop: 14 },
  emptyTitle: { color: colors.text, fontSize: 18, fontFamily: "Georgia" },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  homeButton: { height: 52, borderWidth: 1, borderColor: colors.gold, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 12 },
  homeButtonText: { color: colors.goldDark, fontWeight: "700" },
});
