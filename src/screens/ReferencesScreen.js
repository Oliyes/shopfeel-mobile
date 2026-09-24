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

const references = [
  {
    title: "Psicologia das cores",
    text: "O projeto utiliza associações de cores como parte da linguagem visual do app. Elas servem como apoio visual para diferenciar os humores apresentados ao usuário.",
  },
  {
    title: "Experiência do usuário",
    text: "A organização das telas prioriza navegação simples, escolha rápida do humor, busca de produtos, favoritos e acesso direto às lojas parceiras.",
  },
  {
    title: "Curadoria de produtos",
    text: "As recomendações do ShopFeel são definidas no painel administrativo e associadas aos humores cadastrados no sistema.",
  },
  {
    title: "Observação",
    text: "As cores e humores do ShopFeel fazem parte da proposta do projeto e não representam avaliação psicológica, diagnóstico ou orientação de saúde.",
  },
];

export default function ReferencesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <BrandLogo size={54} compact />

        <Text style={styles.kicker}>SHOPFEEL</Text>
        <Text style={styles.title}>Referências e fundamentos</Text>
        <Text style={styles.subtitle}>
          Conceitos usados para organizar a experiência e a identidade visual do aplicativo.
        </Text>

        {references.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 40 },
  back: { color: "#9B5DE5", fontSize: 15, marginBottom: 26 },
  kicker: { color: "#9B5DE5", fontSize: 10, letterSpacing: 2, fontWeight: "700", marginTop: 16 },
  title: { color: colors.text, fontSize: 31, lineHeight: 38, fontFamily: "Georgia", marginTop: 6 },
  subtitle: { color: colors.muted, lineHeight: 20, marginTop: 9, marginBottom: 22 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 13,
  },
  cardTitle: { color: colors.text, fontSize: 17, fontFamily: "Georgia" },
  cardText: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 7 },
});
