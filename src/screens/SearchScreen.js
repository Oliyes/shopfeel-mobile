import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import BrandLogo from "../components/BrandLogo";
import { PRODUCT_CATEGORIES } from "../utils/categories";
import { colors } from "../theme";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      loadFavorites();
    }, [])
  );

  async function loadProducts() {
    try {
      setLoading(true);

      // Busca até 100 produtos para permitir combinar texto + categoria no app.
      const endpoint = search.trim()
        ? "/api/mobile/products?limit=100&search=" + encodeURIComponent(search.trim())
        : "/api/mobile/products?limit=100";

      const data = await apiRequest(endpoint);
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      const data = await apiRequest("/api/me/favorites");

      setFavoriteIds(
        (data.products || []).map((product) => Number(product.id))
      );
    } catch {
      setFavoriteIds([]);
    }
  }

  async function toggleFavorite(product) {
    const id = Number(product.id);
    const isFavorite = favoriteIds.includes(id);

    try {
      await apiRequest("/api/me/favorites/" + id, {
        method: isFavorite ? "DELETE" : "POST",
      });

      setFavoriteIds((current) =>
        isFavorite
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
    } catch (error) {
      Alert.alert("Favoritos", error.message);
    }
  }

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;

    return products.filter(
      (product) => product.interest_category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <BrandLogo size={45} compact />

            <View>
              <Text style={styles.kicker}>DESCUBRA</Text>
              <Text style={styles.title}>Pesquisar</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="O que você procura?"
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Pesquisar produtos"
            accessibilityHint="Digite o nome de um produto."
          />

          <Text style={styles.categoryLabel}>BUSCAR POR CATEGORIA</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory("")}
              accessibilityRole="button"
              accessibilityState={{ selected: !selectedCategory }}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  !selectedCategory && styles.categoryChipTextActive,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            {PRODUCT_CATEGORIES.map((category) => {
              const active = selectedCategory === category.value;

              return (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={"Categoria " + category.label}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {category.emoji} {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.resultLabel}>
            {selectedCategory
              ? "PRODUTOS DA CATEGORIA"
              : search
              ? "RESULTADOS"
              : "PRODUTOS DISPONÍVEIS"}
          </Text>

          {loading ? (
            <ActivityIndicator
              color="#55B7D9"
              style={{ marginTop: 40 }}
            />
          ) : (
            <View style={styles.grid}>
              {filteredProducts.map((product) => {
                const isFavorite = favoriteIds.includes(Number(product.id));

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    favorite={isFavorite}
                    onFavorite={() => toggleFavorite(product)}
                    onPress={() =>
                      navigation.navigate("ProductDetail", {
                        product,
                        initialFavorite: isFavorite,
                      })
                    }
                  />
                );
              })}
            </View>
          )}

          {!loading && filteredProducts.length === 0 && (
            <Text style={styles.empty}>
              Nenhum produto encontrado nessa categoria.
            </Text>
          )}
        </ScrollView>

        <BottomNav navigation={navigation} active="Search" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
  },
  container: {
    padding: 22,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  kicker: {
    color: "#55B7D9",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontFamily: "Georgia",
    marginTop: 2,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#BFE6F2",
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    color: colors.text,
  },
  categoryLabel: {
    marginTop: 18,
    marginBottom: 10,
    color: "#397F99",
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  categoryRow: {
    gap: 8,
    paddingRight: 12,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  categoryChipActive: {
    backgroundColor: "#DDF3FA",
    borderColor: "#55B7D9",
  },
  categoryChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#2F728A",
  },
  resultLabel: {
    marginTop: 26,
    marginBottom: 14,
    color: "#397F99",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 50,
  },
});
