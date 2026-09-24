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

const steps = [
  ["1", "Escolha seu humor", "Selecione o estado que mais representa o seu momento."],
  ["2", "Receba uma curadoria", "O ShopFeel mostra produtos relacionados ao humor escolhido."],
  ["3", "Explore e favorite", "Pesquise produtos, salve favoritos e volte neles quando quiser."],
  ["4", "Acesse a loja", "Ao escolher um produto, você pode seguir para a loja responsável pela venda."],
];

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={styles.brand}>
          <BrandLogo size={96} />
          <Text style={styles.brandName}>ShopFeel</Text>
          <Text style={styles.tagline}>Sinta. Escolha. Descubra.</Text>
        </View>

        <Text style={styles.eyebrow}>SOBRE O PROJETO</Text>
        <Text style={styles.title}>Uma experiência de compra guiada pelo seu momento.</Text>

        <Text style={styles.text}>
          O ShopFeel é um aplicativo de recomendação de produtos de acordo com o humor do usuário.
          Em vez de começar por uma categoria tradicional, a experiência começa pela forma como a pessoa
          está se sentindo naquele momento.
        </Text>

        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>O que o ShopFeel faz?</Text>
          <Text style={styles.highlightText}>
            Conecta humores a uma curadoria de produtos cadastrada no painel administrativo.
            O aplicativo não vende diretamente: ele ajuda o usuário a descobrir opções e o direciona
            para a loja responsável pela venda.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Como funciona</Text>

        {steps.map(([number, title, text], index) => {
          const stepColors = ["#F4C542", "#55B7D9", "#9B5DE5", "#55A86B"];
          const accent = stepColors[index];

          return (
            <View key={number} style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: accent }]}>
                <Text style={styles.stepNumberText}>{number}</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{title}</Text>
                <Text style={styles.stepText}>{text}</Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Cores e humores</Text>
        <Text style={styles.text}>
          A identidade visual usa cores associadas aos humores cadastrados no sistema.
          Isso ajuda a diferenciar as experiências e reforça visualmente cada escolha feita no aplicativo.
        </Text>

        <View style={styles.colorGrid}>
          {[
            ["Amarelo", "#F4C542"],
            ["Azul", "#5BA7E1"],
            ["Vermelho", "#E45757"],
            ["Roxo", "#9B5DE5"],
            ["Verde", "#55A86B"],
            ["Laranja", "#F28C38"],
            ["Rosa", "#E768A2"],
            ["Cinza", "#9CA3AF"],
            ["Preto", "#2F3136"],
            ["Branco", "#FFFFFF"],
          ].map(([label, color]) => (
            <View key={label} style={styles.colorItem}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  color === "#FFFFFF" && styles.whiteDot,
                ]}
              />
              <Text style={styles.colorLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Importante</Text>
          <Text style={styles.noteText}>
            O ShopFeel usa humor e cor como parte da experiência de navegação e recomendação.
            O aplicativo não realiza diagnóstico psicológico nem substitui orientação profissional.
          </Text>
        </View>

        <Text style={styles.version}>ShopFeel • versão do projeto TCC</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 44 },
  back: { color: "#9B5DE5", fontSize: 15 },
  brand: { alignItems: "center", marginTop: 18, marginBottom: 32 },
  brandName: {
    fontSize: 32,
    fontFamily: "Georgia",
    color: colors.text,
    marginTop: 10,
  },
  tagline: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  eyebrow: {
    color: "#9B5DE5",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },
  title: {
    fontSize: 30,
    lineHeight: 37,
    fontFamily: "Georgia",
    color: colors.text,
    marginTop: 7,
    marginBottom: 14,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
  },
  highlight: {
    marginTop: 20,
    padding: 19,
    borderRadius: 18,
    backgroundColor: "#F5EEFB",
    borderWidth: 1,
    borderColor: "#DFCFF0",
  },
  highlightTitle: {
    color: colors.text,
    fontSize: 17,
    fontFamily: "Georgia",
  },
  highlightText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: "Georgia",
    marginTop: 28,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: "row",
    gap: 13,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  stepContent: { flex: 1 },
  stepTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  stepText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 10,
  },
  colorItem: {
    width: "30%",
    alignItems: "center",
    gap: 6,
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  whiteDot: {
    borderWidth: 1,
    borderColor: "#C9CDD3",
  },
  colorLabel: {
    color: colors.muted,
    fontSize: 10,
  },
  note: {
    marginTop: 28,
    padding: 17,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  noteText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  version: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 10,
    marginTop: 28,
  },
});
