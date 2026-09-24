import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BrandLogo from "../components/BrandLogo";
import { colors } from "../theme";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem("shopfeel_token");
      const savedUser = await AsyncStorage.getItem("shopfeel_user");

      if (token && savedUser) {
        const savedStartScreen =
          await AsyncStorage.getItem("shopfeel_start_screen");

        const startScreen =
          savedStartScreen === "Mood"
            ? "Mood"
            : "Home";

        navigation.replace(startScreen, {
          user: JSON.parse(savedUser),
        });
      } else {
        navigation.replace("Login");
      }
    }, 1300);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BrandLogo size={142} />

      <Text style={styles.logoText}>Shopfeel</Text>
      <Text style={styles.tagline}>Mais que compras, bem-estar.</Text>

      <View style={styles.colorRow}>
        {["#F4B942","#55A86B","#55B7D9","#5B7FC7","#9B5DE5","#E768A2","#E45757"].map((color) => (
          <View key={color} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>

      <ActivityIndicator style={styles.loader} color={colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  logoText: {
    marginTop: 18,
    fontSize: 42,
    color: colors.text,
    fontFamily: "Georgia",
  },
  tagline: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
  },
  colorRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loader: {
    marginTop: 30,
  },
});
