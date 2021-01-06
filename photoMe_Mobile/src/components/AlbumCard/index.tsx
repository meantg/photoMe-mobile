import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AlbumCard({ album }) {
  return (
    <View style={styles.imgContainer}>
      <Image
        source={{ uri: album.photos[0].url }}
        resizeMode="contain"
        style={styles.image}
      ></Image>
      <MaterialCommunityIcons
        name="checkbox-multiple-blank-outline"
        size={24}
        color="#fff"
        style={{ position: "absolute", right: 5, top: 5, color: "#d3caca" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    padding: 2,
    justifyContent: 'center',
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
  },
});

export default AlbumCard;
