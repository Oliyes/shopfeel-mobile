import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme";

const items = [
  { route: "Home", label: "Início", icon: "⌂" },
  { route: "Search", label: "Pesquisar", icon: "⌕" },
  { route: "Favorites", label: "Favoritos", icon: "♡" },
  { route: "Profile", label: "Perfil", icon: "◯" },
];

export default function BottomNav({ navigation, active }) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = active === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.item}
            onPress={() => {
              if (!selected) navigation.navigate(item.route);
            }}
            activeOpacity={0.75}
          >
            <Text style={[styles.icon, selected && styles.selected]}>
              {item.icon}
            </Text>

            <Text style={[styles.label, selected && styles.selected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingBottom: 8,
    paddingTop: 8,
  },
  item: {
    minWidth: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  icon: {
    fontSize: 27,
    color: colors.muted,
    lineHeight: 28,
  },
  label: {
    fontSize: 10,
    color: colors.muted,
  },
  selected: {
    color: colors.goldDark,
    fontWeight: "700",
  },
});
