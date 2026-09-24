import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import { colors } from "../theme";

function formatPrice(cents) {
  return ((Number(cents) || 0) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ProductDetailScreen({ navigation, route }) {
  const product = route.params?.product;
  const [favorite, setFavorite] = useState(
    Boolean(route.params?.initialFavorite)
  );

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Produto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  async function openExternal() {
    if (!product.external_url) {
      Alert.alert("Produto", "Este produto ainda não possui link externo.");
      return;
    }

    const supported = await Linking.canOpenURL(product.external_url);

    if (supported) {
      await Linking.openURL(product.external_url);
    } else {
      Alert.alert("Produto", "Não foi possível abrir o link.");
    }
  }

  async function toggleFavorite() {
    try {
      if (favorite) {
        await apiRequest("/api/me/favorites/" + product.id, {
          method: "DELETE",
        });
      } else {
        await apiRequest("/api/me/favorites/" + product.id, {
          method: "POST",
        });
      }

      setFavorite((current) => !current);
    } catch (error) {
      Alert.alert("Favoritos", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.top}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹ Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFavorite}>
            <Text style={styles.heart}>{favorite ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>

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
        </View>

        <Text style={styles.store}>{product.store_name || "LOJA PARCEIRA"}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price_cents)}</Text>

        <View style={styles.divider} />

        <Text style={styles.section}>SOBRE O PRODUTO</Text>
        <Text style={styles.description}>
          {product.description || "Sem descrição cadastrada."}
        </Text>

        <TouchableOpacity style={styles.button} onPress={openExternal}>
          <Text style={styles.buttonText}>Ver produto na loja</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Você será direcionado para o site da loja responsável pela venda.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 22, paddingBottom: 40 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  back: { color: colors.goldDark, fontSize: 15 },
  heart: { fontSize: 30, color: colors.goldDark },
  imageBox: { height: 300, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  placeholder: { fontSize: 60 },
  store: { marginTop: 23, color: colors.goldDark, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" },
  title: { marginTop: 8, fontSize: 29, lineHeight: 36, color: colors.text, fontFamily: "Georgia" },
  price: { marginTop: 12, fontSize: 21, fontWeight: "700", color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 24 },
  section: { color: colors.goldDark, fontSize: 10, letterSpacing: 1.5 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  button: { height: 56, borderRadius: 14, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center", marginTop: 28 },
  buttonText: { color: colors.white, fontWeight: "700" },
  note: { textAlign: "center", color: colors.muted, fontSize: 10, marginTop: 10 },
});
