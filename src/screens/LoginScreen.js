import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import { colors } from "../theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      await AsyncStorage.setItem("shopfeel_token", data.token);
      await AsyncStorage.setItem(
        "shopfeel_user",
        JSON.stringify(data.customer)
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
            params: { user: data.customer },
          },
        ],
      });
    } catch (error) {
      Alert.alert("Não foi possível entrar", error.message);
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
          <Text style={styles.kicker}>SHOPFEEL</Text>
          <Text style={styles.logo}>Shopfeel</Text>

          <Text style={styles.title}>Bem-vinda de volta.</Text>
          <Text style={styles.subtitle}>
            Entre para descobrir produtos que combinam com o seu momento.
          </Text>

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
            placeholder="Sua senha"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgot}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.createText}>Criar uma conta</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Mais que compras, bem-estar.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 26,
    paddingVertical: 40,
  },
  kicker: {
    color: colors.goldDark,
    fontSize: 10,
    letterSpacing: 3,
    textAlign: "center",
  },
  logo: {
    color: colors.text,
    fontSize: 41,
    fontFamily: "Georgia",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 48,
  },
  title: {
    fontSize: 30,
    fontFamily: "Georgia",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 9,
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 7,
  },
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
  forgot: {
    alignSelf: "flex-end",
    color: colors.goldDark,
    fontSize: 12,
    marginBottom: 20,
  },
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  createButton: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  createText: {
    color: colors.goldDark,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    marginTop: 34,
    color: colors.muted,
    fontSize: 11,
  },
});
