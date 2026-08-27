import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ route, navigation }) {
  const user = route.params?.user;

  async function handleLogout() {
    await AsyncStorage.removeItem("shopfeel_token");
    await AsyncStorage.removeItem("shopfeel_user");

    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShopFeel</Text>

      <Text style={styles.success}>
        Login realizado com sucesso!
      </Text>

      {user && (
        <Text style={styles.user}>
          Olá, {user.name}!
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 20,
  },

  success: {
    fontSize: 18,
    marginBottom: 10,
  },

  user: {
    fontSize: 22,
    fontWeight: "bold",
  },

  button: {
    marginTop: 35,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },

  buttonText: {
    fontWeight: "bold",
  },
});