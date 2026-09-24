import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import { colors } from "../theme";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadProducts() {
    try {
      setLoading(true);
      const endpoint = search.trim()
        ? "/api/mobile/products?search=" + encodeURIComponent(search.trim())
        : "/api/mobile/products";

      const data = await apiRequest(endpoint);
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.kicker}>DESCUBRA</Text>
          <Text style={styles.title}>Pesquisar</Text>

          <TextInput
            style={styles.input}
            placeholder="O que você procura?"
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
          />

          <Text style={styles.resultLabel}>
            {search ? "RESULTADOS" : "PRODUTOS DISPONÍVEIS"}
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
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

          {!loading && products.length === 0 && (
            <Text style={styles.empty}>Nenhum produto encontrado.</Text>
          )}
        </ScrollView>

        <BottomNav navigation={navigation} active="Search" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1 },
  container: { padding: 22, paddingBottom: 20 },
  kicker: { color: colors.goldDark, fontSize: 10, letterSpacing: 2 },
  title: { color: colors.text, fontSize: 36, fontFamily: "Georgia", marginTop: 6, marginBottom: 20 },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    color: colors.text,
  },
  resultLabel: { marginTop: 26, marginBottom: 14, color: colors.goldDark, fontSize: 10, letterSpacing: 1.5 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  empty: { textAlign: "center", color: colors.muted, marginTop: 50 },
});
