import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AlbumGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.group2Column}>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
          <MaterialCommunityIcons
              name="checkbox-multiple-blank-outline"
              size={24}
              color="black"
              style={{position: 'absolute', right:5, top:5, color: '#d3caca'}}
            />
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../images/iconapp.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    padding: 2,
  },

  container: {},
  group2: {
    width: 355,
    height: 110,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 2,
  },
  image: {
    width: "31vw",
    maxWidth: 140,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(236,231,231,1)",
    borderStyle: "solid",
  },
  group2Column: {
    width: 355,
  },

  group2ColumnFiller: {
    flex: 1,
    justifyContent: "center",
  },
});

export default AlbumGrid;
