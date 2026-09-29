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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import { colors } from "../theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email.trim()) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      setStep("reset");

      Alert.alert(
        "Verifique seu e-mail",
        data.message ||
          "Enviamos um código de recuperação."
      );
    } catch (error) {
      Alert.alert(
        "Recuperação de senha",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!code.trim()) {
      Alert.alert(
        "Atenção",
        "Digite o código enviado para seu e-mail."
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Senha curta",
        "A nova senha deve ter pelo menos 8 caracteres."
      );
      return;
    }

    if (password !== confirm) {
      Alert.alert(
        "Atenção",
        "As senhas não são iguais."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: code.trim(),
            password,
          }),
        }
      );

      Alert.alert(
        "Senha alterada",
        data.message ||
          "Sua senha foi alterada com sucesso.",
        [
          {
            text: "Entrar",
            onPress: () =>
              navigation.replace("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível alterar a senha",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => {
              if (step === "reset") {
                setStep("email");
                return;
              }

              navigation.goBack();
            }}
          >
            <Text style={styles.back}>
              ‹ Voltar
            </Text>
          </TouchableOpacity>

          <Text style={styles.kicker}>
            ACESSO
          </Text>

          <Text style={styles.title}>
            {step === "email"
              ? "Esqueceu a senha?"
              : "Crie uma nova senha"}
          </Text>

          <Text style={styles.subtitle}>
            {step === "email"
              ? "Informe o e-mail cadastrado. Vamos enviar um código para confirmar que a conta é sua."
              : "Digite o código de 6 números que enviamos para seu e-mail e escolha uma nova senha."}
          </Text>

          {step === "email" ? (
            <>
              <Text style={styles.label}>
                E-mail
              </Text>

              <TextInput
                style={styles.input}
                placeholder="voce@email.com"
                placeholderTextColor={
                  colors.muted
                }
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="E-mail para recuperação de senha"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color={colors.white}
                  />
                ) : (
                  <Text
                    style={styles.buttonText}
                  >
                    Enviar código
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.emailSent}>
                Código enviado para{" "}
                {email.trim().toLowerCase()}
              </Text>

              <Text style={styles.label}>
                Código de recuperação
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.codeInput,
                ]}
                placeholder="000000"
                placeholderTextColor={
                  colors.muted
                }
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(value) =>
                  setCode(
                    value.replace(
                      /[^0-9]/g,
                      ""
                    )
                  )
                }
                accessibilityLabel="Código de recuperação"
              />

              <Text style={styles.label}>
                Nova senha
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Mínimo de 8 caracteres"
                placeholderTextColor={
                  colors.muted
                }
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Nova senha"
              />

              <Text style={styles.label}>
                Confirmar nova senha
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite a nova senha novamente"
                placeholderTextColor={
                  colors.muted
                }
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                accessibilityLabel="Confirmar nova senha"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={
                  handleResetPassword
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color={colors.white}
                  />
                ) : (
                  <Text
                    style={styles.buttonText}
                  >
                    Alterar senha
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text
                  style={styles.resendText}
                >
                  Enviar outro código
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },

  back: {
    color: colors.goldDark,
    fontSize: 15,
    marginBottom: 50,
  },

  kicker: {
    color: colors.goldDark,
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 8,
  },

  title: {
    fontSize: 35,
    fontFamily: "Georgia",
    color: colors.text,
  },

  subtitle: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 7,
    marginTop: 4,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: colors.surface,
    color: colors.text,
    marginBottom: 15,
  },

  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
  },

  emailSent: {
    color: "#7B4AB5",
    fontSize: 12,
    marginBottom: 22,
  },

  button: {
    height: 54,
    marginTop: 4,
    backgroundColor: colors.gold,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: colors.white,
    fontWeight: "700",
  },

  resendButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  resendText: {
    color: "#9B5DE5",
    fontWeight: "700",
    fontSize: 12,
  },
});
