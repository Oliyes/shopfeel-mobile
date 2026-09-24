import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getApiAssetUrl } from "../services/api";
import { colors } from "../theme";

const items = [
  { route: "Home", label: "Início", icon: "⌂" },
  { route: "Search", label: "Pesquisar", icon: "⌕" },
  { route: "Favorites", label: "Favoritos", icon: "♡" },
  { route: "Profile", label: "Perfil", icon: "◯" },
];

export default function BottomNav({
  navigation,
  active,
  profilePhoto = null,
}) {
  const [savedPhoto, setSavedPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadSavedPhoto();
    }, [])
  );

  async function loadSavedPhoto() {
    try {
      const savedUser =
        await AsyncStorage.getItem("shopfeel_user");

      if (!savedUser) {
        setSavedPhoto(null);
        return;
      }

      const parsedUser =
        JSON.parse(savedUser);

      setSavedPhoto(
        parsedUser?.photo || null
      );
    } catch {
      setSavedPhoto(null);
    }
  }

  const currentPhoto =
    profilePhoto || savedPhoto;

  const photoUrl =
    getApiAssetUrl(currentPhoto);

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected =
          active === item.route;

        const isProfile =
          item.route === "Profile";

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.item}
            onPress={() => {
              if (!selected) {
                navigation.navigate(item.route);
              }
            }}
            activeOpacity={0.75}
          >
            {isProfile && photoUrl ? (
              <View
                style={[
                  styles.profileIconWrap,
                  selected &&
                    styles.profileIconSelected,
                ]}
              >
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.profileImage}
                />
              </View>
            ) : (
              <Text
                style={[
                  styles.icon,
                  selected && styles.selected,
                ]}
              >
                {item.icon}
              </Text>
            )}

            <Text
              style={[
                styles.label,
                selected && styles.selected,
              ]}
            >
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

  profileIconWrap: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: "#F1E8FA",
  },

  profileIconSelected: {
    borderWidth: 2,
    borderColor: "#9B5DE5",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  label: {
    fontSize: 10,
    color: colors.muted,
  },

  selected: {
    color: "#7B4AB5",
    fontWeight: "700",
  },
});
