import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import * as Speech from "expo-speech";

const screenTexts = {
  Splash:
    "ShopFeel. Mais que compras, bem-estar. O aplicativo está carregando.",
  Login:
    "Tela de login do ShopFeel. Digite seu e-mail e sua senha para entrar. Você também pode recuperar sua senha ou criar uma nova conta.",
  Register:
    "Tela de criação de conta. Preencha seu nome, e-mail, crie uma senha com pelo menos oito caracteres e confirme a senha.",
  ForgotPassword:
    "Tela de recuperação de senha. Informe seu e-mail para receber um código e criar uma nova senha.",
  Personalization:
    "Tela de personalização. Escolha os assuntos de que você gosta, como tecnologia, moda, beleza, casa, livros e games. Depois, toque em Continuar.",
  Home:
    "Tela inicial do ShopFeel. Aqui você pode escolher seu humor, pesquisar produtos, acessar favoritos e seu perfil.",
  Mood:
    "Tela de escolha de humor. Selecione como você está se sentindo para receber uma curadoria de produtos relacionada ao seu momento.",
  Recommendations:
    "Tela de recomendações. Aqui aparecem os produtos selecionados para o humor escolhido. Você pode abrir um produto ou favoritar usando a estrela.",
  Search:
    "Tela de pesquisa. Digite o nome de um produto para procurar no catálogo. Você também pode favoritar produtos usando a estrela.",
  Favorites:
    "Tela de favoritos. Aqui ficam os produtos que você salvou para consultar novamente.",
  ProductDetail:
    "Tela de detalhes do produto. Aqui você encontra nome, loja, preço, descrição, opção de favorito e o botão para acessar a loja responsável pela venda.",
  Profile:
    "Tela de perfil. Aqui você pode alterar sua foto, editar seu nome, salvar alterações e acessar as configurações.",
  Settings:
    "Tela de configurações. Aqui você pode acessar preferências, informações sobre o ShopFeel, referências e sair da conta.",
  Preferences:
    "Tela de preferências. Aqui você pode alterar seus interesses, escolher a tela inicial do aplicativo e definir se deseja visualizar as descrições dos humores.",
  About:
    "Tela Sobre o ShopFeel. Aqui você encontra a proposta, o funcionamento e a identidade do projeto.",
  References:
    "Tela de referências e fundamentos. Aqui estão os conceitos utilizados na experiência, nas cores e na curadoria do ShopFeel.",
};

const screensWithOwnAudio = new Set([
  "Login",
  "Register",
  "ForgotPassword",
  "Home",
  "Mood",
  "Recommendations",
  "ProductDetail",
  "About",
  "References",
]);

export default function GlobalAccessibilityButton({ routeName }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    Speech.stop();
    setSpeaking(false);
  }, [routeName]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (screensWithOwnAudio.has(routeName)) {
    return null;
  }

  async function handlePress() {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }

    const text =
      screenTexts[routeName] ||
      "Tela do ShopFeel. Use os controles disponíveis para navegar pelo aplicativo.";

    await Speech.stop();
    setSpeaking(true);

    Speech.speak(text, {
      language: "pt-BR",
      rate: 0.92,
      pitch: 1,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.wrapper}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel={
          speaking
            ? "Parar leitura da tela"
            : "Ouvir instruções desta tela"
        }
        accessibilityHint="Toca para ouvir uma descrição em voz alta da tela atual."
      >
        <Text style={styles.icon}>
          {speaking ? "■" : "🔊"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 16,
    top: 54,
    zIndex: 9999,
    elevation: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,253,249,0.96)",
    borderWidth: 1.5,
    borderColor: "#9B5DE5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  icon: {
    fontSize: 20,
    color: "#7B4AB5",
  },
});
