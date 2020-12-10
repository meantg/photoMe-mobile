import React from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const height = width * 0.8;

function Slider( {photos} ) {
  const images = photos;

  if (images && images.length) {
    return (
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={true}
          indicatorStyle='white'
        >
          {images.map((image) => (
            <Image key={image["id"]} style={styles.image} source={{uri :image["url"]}} />
          ))}
        </ScrollView>
      </View>
    );
  }
  console.log("Please provide images");
  return null;
}

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    height,
  },
  image: {
    width ,
    height,
  },
});
