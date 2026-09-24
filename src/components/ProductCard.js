import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../theme";

function formatPrice(cents) {
  const value = (Number(cents) || 0) / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ProductCard({
  product,
  onPress,
  onFavorite,
  favorite = false,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageBox}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholder}>🛍️</Text>
        )}

        {onFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {favorite ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.store} numberOfLines={1}>
        {product.store_name || "Loja parceira"}
      </Text>

      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <Text style={styles.price}>
        {formatPrice(product.price_cents)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
  },
  imageBox: {
    height: 126,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    fontSize: 38,
  },
  favoriteButton: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    fontSize: 21,
    color: colors.goldDark,
  },
  store: {
    fontSize: 10,
    color: colors.goldDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  name: {
    minHeight: 38,
    fontSize: 15,
    lineHeight: 19,
    color: colors.text,
    fontFamily: "Georgia",
  },
  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
