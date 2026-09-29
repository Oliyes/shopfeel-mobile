import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Speech from "expo-speech";

export default function SpeakButton({
  text,
  accentColor = "#9B5DE5",
  label = "Ouvir conteúdo",
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  async function handlePress() {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }

    if (!text?.trim()) {
      return;
    }

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
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: accentColor,
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        speaking
          ? "Parar leitura em voz alta"
          : label
      }
      accessibilityHint="Toca para ouvir este conteúdo em voz alta."
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.icon,
          {
            color: accentColor,
          },
        ]}
      >
        {speaking ? "■" : "▶"}
      </Text>

      <Text
        style={[
          styles.label,
          {
            color: accentColor,
          },
        ]}
      >
        {speaking ? "Parar" : "Ouvir"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.78)",
  },

  icon: {
    fontSize: 12,
    fontWeight: "800",
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});
