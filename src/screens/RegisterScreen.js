import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Senha curta", "Use pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Atenção", "As senhas não são iguais.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      await AsyncStorage.setItem("shopfeel_token", data.token);
      await AsyncStorage.setItem("shopfeel_user", JSON.stringify(data.customer));

      navigation.replace("Personalization", {
        user: data.customer,
      });
    } catch (error) {
      Alert.alert("Não foi possível criar a conta", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹ Voltar</Text>
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <BrandLogo size={58} compact />
            <View>
              <Text style={styles.brandName}>Shopfeel</Text>
              <Text style={styles.brandText}>Sua experiência começa aqui.</Text>
            </View>
          </View>

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Descubra produtos que combinam com o seu momento.
          </Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo de 8 caracteres"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor={colors.muted}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>
              Já possui uma conta? <Text style={styles.link}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  back: { color: colors.goldDark, fontSize: 15, marginBottom: 24 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 26,
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: colors.text,
  },
  brandText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  title: { color: colors.text, fontSize: 35, fontFamily: "Georgia", marginBottom: 8 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 28 },
  label: { color: colors.text, fontSize: 12, marginBottom: 7, marginTop: 4 },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: colors.text,
  },
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#55A86B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
  loginText: { textAlign: "center", marginTop: 24, color: colors.muted, fontSize: 13 },
  link: { color: "#9B5DE5", fontWeight: "700" },
});
