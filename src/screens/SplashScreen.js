import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem("shopfeel_token");
      const savedUser = await AsyncStorage.getItem("shopfeel_user");

      if (token && savedUser) {
        navigation.replace("Home", {
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
      <Text style={styles.kicker}>SHOPFEEL</Text>
      <Text style={styles.logo}>Shopfeel</Text>
      <Text style={styles.tagline}>Mais que compras, bem-estar.</Text>
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
  kicker: {
    fontSize: 11,
    letterSpacing: 3,
    color: colors.goldDark,
    marginBottom: 10,
  },
  logo: {
    fontSize: 44,
    color: colors.text,
    fontFamily: "Georgia",
  },
  tagline: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
  },
  loader: {
    marginTop: 36,
  },
});
