import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  getMoodEmoji,
  getMoodColor,
  getMoodSoftColor,
} from "../utils/moods";
import BrandLogo from "../components/BrandLogo";
import SpeakButton from "../components/SpeakButton";
import { colors } from "../theme";

export default function RecommendationsScreen({
  navigation,
  route,
}) {
  const mood = route.params?.mood;

  const [products, setProducts] =
    useState([]);

  const [favoriteIds, setFavoriteIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      loadRecommendations();
      loadFavorites();
    }, [mood?.id])
  );

  async function loadRecommendations() {
    if (!mood?.id) return;

    try {
      setLoading(true);

      const data =
        await apiRequest(
          "/api/mobile/recommendations/" +
            mood.id
        );

      setProducts(
        data.products || []
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      const data =
        await apiRequest(
          "/api/me/favorites"
        );

      setFavoriteIds(
        (data.products || []).map(
          (product) =>
            Number(product.id)
        )
      );
    } catch {
      setFavoriteIds([]);
    }
  }

  async function toggleFavorite(
    product
  ) {
    const id =
      Number(product.id);

    const isFavorite =
      favoriteIds.includes(id);

    try {
      await apiRequest(
        "/api/me/favorites/" + id,
        {
          method:
            isFavorite
              ? "DELETE"
              : "POST",
        }
      );

      setFavoriteIds(
        (current) =>
          isFavorite
            ? current.filter(
                (item) =>
                  item !== id
              )
            : [
                ...current,
                id,
              ]
      );
    } catch (error) {
      Alert.alert(
        "Favoritos",
        error.message
      );
    }
  }

  const moodColor =
    getMoodColor(mood);

  const moodSoft =
    getMoodSoftColor(mood);

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor:
            moodSoft,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >
        <View style={styles.top}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text
              style={[
                styles.back,
                {
                  color:
                    moodColor,
                },
              ]}
            >
              ‹ Voltar
            </Text>
          </TouchableOpacity>

          <BrandLogo
            size={42}
            compact
          />
        </View>

        <View
          style={[
            styles.moodBadge,
            {
              backgroundColor:
                moodColor,
            },
          ]}
        >
          <Text style={styles.emoji}>
            {getMoodEmoji(
              mood?.mood_name
            )}
          </Text>
        </View>

        <Text
          style={[
            styles.kicker,
            {
              color:
                moodColor,
            },
          ]}
        >
          ESCOLHA SHOPFEEL
        </Text>

        <Text style={styles.title}>
          Para o seu momento de{" "}
          {mood?.mood_name ||
            "hoje"}
        </Text>

        <Text style={styles.subtitle}>
          Selecionamos produtos que combinam com esse humor.
        </Text>

        <SpeakButton
          text={
            "Você escolheu " +
            (mood?.mood_name ||
              "este humor") +
            ". Selecionamos produtos que combinam com esse momento."
          }
          accentColor={
            moodColor
          }
          label="Ouvir resumo das recomendações"
        />

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                moodColor,
            },
          ]}
        />

        {loading ? (
          <ActivityIndicator
            color={moodColor}
            style={{
              marginTop: 50,
            }}
          />
        ) : products.length ===
          0 ? (
          <View style={styles.empty}>
            <Text
              style={
                styles.emptyTitle
              }
            >
              Ainda não há produtos nessa curadoria.
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Cadastre produtos no painel web e relacione-os a esse humor.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map(
              (product) => {
                const isFavorite =
                  favoriteIds.includes(
                    Number(
                      product.id
                    )
                  );

                return (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    favorite={
                      isFavorite
                    }
                    onFavorite={() =>
                      toggleFavorite(
                        product
                      )
                    }
                    onPress={() =>
                      navigation.navigate(
                        "ProductDetail",
                        {
                          product,
                          initialFavorite:
                            isFavorite,
                        }
                      )
                    }
                  />
                );
              }
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.homeButton,
            {
              borderColor:
                moodColor,
            },
          ]}
          onPress={() =>
            navigation.navigate(
              "Home",
              {
                user:
                  route.params
                    ?.user,
              }
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Ir para o início"
        >
          <Text
            style={[
              styles.homeButtonText,
              {
                color:
                  moodColor,
              },
            ]}
          >
            Ir para o início
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
    },

    container: {
      flexGrow: 1,
      padding: 22,
      paddingBottom: 35,
    },

    top: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginTop: 18,
      marginBottom: 24,
    },

    back: {
      fontSize: 15,
    },

    moodBadge: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom: 14,
    },

    emoji: {
      fontSize: 34,
    },

    kicker: {
      fontSize: 10,
      letterSpacing: 2,
      fontWeight: "700",
    },

    title: {
      color: colors.text,
      fontSize: 32,
      lineHeight: 39,
      fontFamily: "Georgia",
      marginTop: 8,
    },

    subtitle: {
      color: colors.muted,
      marginTop: 9,
      marginBottom: 17,
    },

    divider: {
      height: 4,
      width: 54,
      borderRadius: 2,
      marginTop: 18,
      marginBottom: 24,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    empty: {
      padding: 24,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 18,
      marginTop: 14,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontFamily: "Georgia",
    },

    emptyText: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 8,
    },

    homeButton: {
      height: 52,
      borderWidth: 1,
      borderRadius: 14,
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 12,
      backgroundColor:
        "rgba(255,255,255,0.55)",
    },

    homeButtonText: {
      fontWeight: "700",
    },
  });
