import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import CardItem from "../../../components/Card";

function AllPhotos() {
  return (
    <View style={styles.container}>
      <CardItem/>
      <CardItem/>
      <CardItem/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },

});

export default AllPhotos;
