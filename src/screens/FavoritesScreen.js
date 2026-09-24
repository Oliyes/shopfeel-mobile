import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function FavoritesScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  async function loadFavorites() {
    try {
      setLoading(true);
      const data = await apiRequest("/api/me/favorites");
      setProducts(data.products || []);
    } catch (error) {
      Alert.alert("Favoritos", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(productId) {
    try {
      await apiRequest("/api/me/favorites/" + productId, {
        method: "DELETE",
      });

      setProducts((current) =>
        current.filter((product) => product.id !== productId)
      );
    } catch (error) {
      Alert.alert("Favoritos", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <BrandLogo size={45} compact />
            <View>
              <Text style={styles.kicker}>SUA SELEÇÃO</Text>
              <Text style={styles.title}>Favoritos</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            Produtos que você guardou para ver novamente.
          </Text>

          {loading ? (
            <ActivityIndicator color="#E768A2" style={{ marginTop: 50 }} />
          ) : products.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>♡</Text>
              <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
              <Text style={styles.emptyText}>
                Toque no coração de um produto para salvá-lo aqui.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite
                  onFavorite={() => removeFavorite(product.id)}
                  onPress={() =>
                    navigation.navigate("ProductDetail", {
                      product,
                      initialFavorite: true,
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>

        <BottomNav navigation={navigation} active="Favorites" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  container: { padding: 22, paddingBottom: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  kicker: { color: "#E768A2", fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  title: { color: colors.text, fontSize: 34, fontFamily: "Georgia", marginTop: 2 },
  subtitle: { color: colors.muted, marginTop: 14, marginBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  emptyBox: {
    marginTop: 50,
    padding: 30,
    borderWidth: 1,
    borderColor: "#F2C6D9",
    borderRadius: 20,
    backgroundColor: "#FFF5F9",
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 42, color: "#E768A2" },
  emptyTitle: { fontSize: 19, fontFamily: "Georgia", color: colors.text, marginTop: 12 },
  emptyText: { textAlign: "center", color: colors.muted, marginTop: 8, lineHeight: 19 },
});
