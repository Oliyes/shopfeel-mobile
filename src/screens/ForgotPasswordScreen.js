import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import BrandLogo from "../components/BrandLogo";
import SpeakButton from "../components/SpeakButton";
import { colors } from "../theme";

const RESEND_SECONDS = 60;

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const normalizedEmail = useMemo(
    () => email.trim().toLowerCase(),
    [email]
  );

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const codeIsValid = /^\d{6}$/.test(code);
  const passwordIsValid = password.length >= 8;
  const passwordsMatch = password === confirm && confirm.length > 0;

  async function sendCode({ isResend = false } = {}) {
    if (!normalizedEmail) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    if (!emailIsValid) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    if (isResend && secondsLeft > 0) {
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      });

      setStep("reset");
      setSecondsLeft(RESEND_SECONDS);

      Alert.alert(
        isResend ? "Novo código enviado" : "Verifique seu e-mail",
        data.message ||
          "Se o e-mail estiver cadastrado, você receberá um código de recuperação."
      );
    } catch (error) {
      Alert.alert("Recuperação de senha", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!codeIsValid) {
      Alert.alert(
        "Código inválido",
        "Digite os 6 números enviados para o seu e-mail."
      );
      return;
    }

    if (!passwordIsValid) {
      Alert.alert(
        "Senha curta",
        "A nova senha deve ter pelo menos 8 caracteres."
      );
      return;
    }

    if (!passwordsMatch) {
      Alert.alert(
        "Senhas diferentes",
        "Confirme a nova senha exatamente como foi digitada acima."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: normalizedEmail,
          code,
          password,
        }),
      });

      Alert.alert(
        "Senha alterada com sucesso",
        data.message || "Agora você já pode entrar com sua nova senha.",
        [
          {
            text: "Ir para o login",
            onPress: () => navigation.replace("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Não foi possível alterar a senha", error.message);
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    if (step === "reset") {
      setStep("email");
      setCode("");
      setPassword("");
      setConfirm("");
      return;
    }

    navigation.goBack();
  }

  const speechText =
    step === "email"
      ? "Recuperação de senha. Digite o e-mail cadastrado no ShopFeel e toque em Enviar código. Se o e-mail existir, você receberá um código de seis números."
      : "Digite o código de seis números recebido por e-mail. Depois, crie uma nova senha com pelo menos oito caracteres, confirme a senha e toque em Alterar senha.";

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
          <TouchableOpacity
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Text style={styles.back}>‹ Voltar</Text>
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <BrandLogo size={48} compact />
            <View>
              <Text style={styles.kicker}>SEGURANÇA</Text>
              <Text style={styles.stepText}>
                {step === "email" ? "ETAPA 1 DE 2" : "ETAPA 2 DE 2"}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>
            {step === "email" ? "Recupere sua senha" : "Crie uma nova senha"}
          </Text>

          <Text style={styles.subtitle}>
            {step === "email"
              ? "Informe o e-mail usado na sua conta. Vamos enviar um código temporário para confirmar a recuperação."
              : "Use o código recebido por e-mail. Por segurança, ele expira depois de alguns minutos."}
          </Text>

          <View style={styles.audioWrap}>
            <SpeakButton
              text={speechText}
              accentColor="#B68235"
              label="Ouvir instruções de recuperação de senha"
            />
          </View>

          {step === "email" ? (
            <>
              <Text style={styles.label}>E-mail da conta</Text>
              <TextInput
                style={[
                  styles.input,
                  email.length > 0 && !emailIsValid && styles.inputError,
                ]}
                placeholder="voce@email.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={() => sendCode()}
                accessibilityLabel="E-mail da conta"
                accessibilityHint="Digite o e-mail usado no cadastro do ShopFeel."
              />

              {email.length > 0 && !emailIsValid && (
                <Text style={styles.helperError}>Digite um e-mail válido.</Text>
              )}

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Como funciona</Text>
                <Text style={styles.infoText}>
                  Você receberá um código de 6 números no e-mail informado. Esse código será usado para criar uma nova senha.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => sendCode()}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Enviar código de recuperação"
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Enviar código</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.sentBox}>
                <Text style={styles.sentTitle}>Código solicitado</Text>
                <Text style={styles.sentEmail}>{normalizedEmail}</Text>
                <Text style={styles.sentHint}>
                  Confira também as pastas Spam ou Lixo eletrônico.
                </Text>
              </View>

              <Text style={styles.label}>Código de recuperação</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.codeInput,
                  code.length > 0 && !codeIsValid && styles.inputError,
                ]}
                placeholder="000000"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(value) =>
                  setCode(value.replace(/[^0-9]/g, ""))
                }
                accessibilityLabel="Código de recuperação de seis números"
              />

              {code.length > 0 && !codeIsValid && (
                <Text style={styles.helperError}>O código deve ter 6 números.</Text>
              )}

              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                style={[
                  styles.input,
                  password.length > 0 && !passwordIsValid && styles.inputError,
                ]}
                placeholder="Mínimo de 8 caracteres"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Nova senha"
              />

              {password.length > 0 && !passwordIsValid && (
                <Text style={styles.helperError}>
                  Use pelo menos 8 caracteres.
                </Text>
              )}

              <Text style={styles.label}>Confirmar nova senha</Text>
              <TextInput
                style={[
                  styles.input,
                  confirm.length > 0 && !passwordsMatch && styles.inputError,
                ]}
                placeholder="Digite a nova senha novamente"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                accessibilityLabel="Confirmar nova senha"
              />

              {confirm.length > 0 && !passwordsMatch && (
                <Text style={styles.helperError}>As senhas ainda não coincidem.</Text>
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Alterar senha"
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Alterar senha</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => sendCode({ isResend: true })}
                disabled={loading || secondsLeft > 0}
                accessibilityRole="button"
                accessibilityLabel="Enviar outro código"
              >
                <Text
                  style={[
                    styles.resendText,
                    secondsLeft > 0 && styles.resendDisabled,
                  ]}
                >
                  {secondsLeft > 0
                    ? `Enviar outro código em ${secondsLeft}s`
                    : "Enviar outro código"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeEmailButton}
                onPress={() => setStep("email")}
                accessibilityRole="button"
                accessibilityLabel="Usar outro e-mail"
              >
                <Text style={styles.changeEmailText}>Usar outro e-mail</Text>
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
    paddingBottom: 44,
  },
  back: {
    color: colors.goldDark,
    fontSize: 15,
    marginBottom: 26,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
  },
  kicker: {
    color: colors.goldDark,
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: "700",
  },
  stepText: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 3,
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontFamily: "Georgia",
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 16,
  },
  audioWrap: {
    marginBottom: 24,
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
    marginBottom: 7,
  },
  inputError: {
    borderColor: colors.danger,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
  },
  helperError: {
    color: colors.danger,
    fontSize: 11,
    marginBottom: 13,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 18,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  infoText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  sentBox: {
    backgroundColor: "#F5EEFB",
    borderWidth: 1,
    borderColor: "#DFCFF0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  sentTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Georgia",
  },
  sentEmail: {
    color: "#7B4AB5",
    fontWeight: "700",
    fontSize: 12,
    marginTop: 5,
  },
  sentHint: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },
  button: {
    height: 54,
    marginTop: 10,
    backgroundColor: colors.gold,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  resendButton: {
    minHeight: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  resendText: {
    color: "#9B5DE5",
    fontWeight: "700",
    fontSize: 12,
  },
  resendDisabled: {
    color: colors.muted,
  },
  changeEmailButton: {
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  changeEmailText: {
    color: colors.goldDark,
    fontSize: 12,
  },
});
