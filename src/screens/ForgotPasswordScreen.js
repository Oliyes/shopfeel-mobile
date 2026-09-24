import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  function handleSend() {
    if (!email.trim()) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    Alert.alert(
      "Recuperação de senha",
      "Essa tela já está pronta. O envio automático de e-mail pode ser conectado depois."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.kicker}>ACESSO</Text>
      <Text style={styles.title}>Esqueceu a senha?</Text>
      <Text style={styles.subtitle}>
        Informe seu e-mail para iniciar a recuperação.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="voce@email.com"
        placeholderTextColor={colors.muted}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  back: { color: colors.goldDark, fontSize: 15, marginBottom: 50 },
  kicker: { color: colors.goldDark, letterSpacing: 2, fontSize: 10, marginBottom: 8 },
  title: { fontSize: 35, fontFamily: "Georgia", color: colors.text },
  subtitle: { color: colors.muted, lineHeight: 21, marginTop: 8, marginBottom: 30 },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  button: {
    height: 54,
    marginTop: 16,
    backgroundColor: colors.gold,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700" },
});
