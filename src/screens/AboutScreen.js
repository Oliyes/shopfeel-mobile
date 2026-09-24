import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.brand}>
          <BrandLogo size={94} />
          <Text style={styles.brandName}>Shopfeel</Text>
          <Text style={styles.tagline}>Mais que compras, bem-estar.</Text>
        </View>

        <Text style={styles.title}>Sobre o ShopFeel</Text>

        <Text style={styles.text}>
          O ShopFeel é um aplicativo de recomendação de produtos baseado no humor do usuário.
          A proposta é transformar o momento emocional em uma experiência de descoberta,
          apresentando produtos selecionados conforme o humor escolhido.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como funciona</Text>
          <Text style={styles.cardText}>
            O usuário escolhe um humor, recebe uma curadoria de produtos relacionada a ele
            e pode pesquisar, favoritar e acessar a loja responsável pela venda.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identidade visual</Text>
          <Text style={styles.cardText}>
            As cores fazem parte da experiência: cada humor possui uma cor associada,
            reforçando visualmente a sensação representada naquele momento.
          </Text>
        </View>

        <View style={styles.colorRow}>
          {["#F4C542","#5BA7E1","#E45757","#9B5DE5","#55A86B","#F28C38","#E768A2","#9CA3AF","#2F3136","#FFFFFF"].map((color) => (
            <View
              key={color}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                color === "#FFFFFF" && styles.whiteDot,
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 40 },
  back: { color: "#9B5DE5", fontSize: 15 },
  brand: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  brandName: { fontSize: 31, fontFamily: "Georgia", color: colors.text, marginTop: 10 },
  tagline: { color: colors.muted, fontSize: 12, marginTop: 4 },
  title: { fontSize: 31, fontFamily: "Georgia", color: colors.text, marginBottom: 14 },
  text: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  card: {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardTitle: { color: colors.text, fontSize: 17, fontFamily: "Georgia" },
  cardText: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 7 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24 },
  colorDot: { width: 24, height: 24, borderRadius: 12 },
  whiteDot: { borderWidth: 1, borderColor: "#C9CDD3" },
});
