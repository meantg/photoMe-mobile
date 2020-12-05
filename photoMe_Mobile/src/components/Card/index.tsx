import React, { Component, useEffect } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Carousel from "react-native-banner-carousel";
import Slider from "../Slider/Slider";

let deviceWidth = Dimensions.get("window").width;

function CardItem({ album }) {
  const photos = album["photos"];
  const photographer = album["photographer"];

  return (
    <View style={[styles.container]}>
      <View style={styles.cardItem1Style}>
        <View style={styles.headerStyle}>
          <Image
            source={require("../../images/iconapp.png")}
            style={styles.leftImage}
          ></Image>
          <View style={styles.headerContent}>
            <Text style={styles.textStyle}>
              {photographer.name} : {photographer.role}
            </Text>
            <Text style={styles.noteTextStyle}>
              {photographer.city} {photographer.country}
            </Text>
          </View>
        </View>
      </View>
      <Slider key={photos["id"]} photos={photos}></Slider>
      <View style={styles.likeBody}>
        <Text style={styles.like}>{album.likesNumber} lượt thích</Text>
      </View>
      <View style={styles.actionBody}>
        <TouchableOpacity style={styles.actionButton1}>
          <AntDesign name="like2" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton2}>
          <FontAwesome name="comments-o" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          <Text style={styles.like}>{photographer.username} </Text>
          {album.title} 
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          <Text>{album.albumType} </Text>
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          <Text style={styles.like}>datvt99 </Text>
          Very noice
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    width: deviceWidth,
    maxWidth: 700,
    minWidth: "100%",
    borderColor: "#CCC",
    flexWrap: "nowrap",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 15,
  },
  cardItem1Style: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 72,
  },
  headerStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  leftImage: {
    height: 40,
    width: 40,
    backgroundColor: "#CCC",
    borderRadius: 20,
  },
  headerContent: {
    paddingLeft: 16,
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 16,
    color: "#000",
    lineHeight: 20,
  },
  noteTextStyle: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    opacity: 0.5,
  },
  cardItemImagePlace: {
    backgroundColor: "#ccc",
    minHeight: 210,
    width: "100%",
    minWidth: 210,
    resizeMode: "cover",
  },
  likeBody: {
    fontWeight: "bold",
    paddingLeft: 14,
    paddingTop: 8,
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
  actionBody: {
    padding: 8,
    flexDirection: "row",
  },
  actionButton1: {
    padding: 8,
    height: 36,
  },
  actionText1: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9,
  },
  actionButton2: {
    padding: 8,
    height: 36,
    marginLeft: 8,
  },
  actionText2: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9,
  },
  body: {
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 16,
  },
  bodyText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#424242",
  },
});

export default CardItem;
