import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AlbumCard() {
  return (
    <View style={styles.imgContainer}>
      <MaterialCommunityIcons
        name="checkbox-multiple-blank-outline"
        size={24}
        color="black"
        style={{ position: "absolute", right: 5, top: 5, color: "#d3caca" }}
      />
      <Image
        source={require("../../images/iconapp.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    padding: 2,
  },

  container: {},
  group2: {
    height: 110,
    flexDirection: "row",
    marginBottom: 2,
  },
  image: {
    width: 120,
    maxWidth: 140,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(236,231,231,1)",
  }
});

export default AlbumCard;
