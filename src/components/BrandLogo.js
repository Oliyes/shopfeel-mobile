import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function BrandLogo({ size = 74, compact = false }) {
  return (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        compact && styles.compact,
      ]}
    >
      <Image
        source={require("../../assets/shopfeel-logo.jpg")}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  compact: {
    borderWidth: 1,
    borderColor: "#E8E2DA",
  },
});
