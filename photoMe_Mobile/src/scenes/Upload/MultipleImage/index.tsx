import { ImageBrowser } from "expo-image-picker-multiple";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as ImageManipulator from 'expo-image-manipulator';

function MultipleImage({ navigation }) {

  const _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return <TouchableOpacity onPress={onSubmit}>
      <Text style={{color: "blue", fontSize: 300}} onPress={onSubmit}>Done   </Text>
    </TouchableOpacity>
  }

  const updateHandler = (count, onSubmit) => {
    navigation.setOptions({
      title: `Selected ${count} files`,
      headerRight: () => _renderDoneButton(count, onSubmit)
    });
  };

  const renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  const _getHeaderLoader = () => (
    <ActivityIndicator size='small' color={'#0580FF'}/>
  );

  const  _processImageAsync = async (uri) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: { width: 1000 }}],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const imagesCallback = (callback) => {
    navigation.setOptions({
      headerRight: () => _getHeaderLoader()
    });

    callback.then(async (photos) => {
      // const cPhotos = [];
      // photos.map(async (photo)=>{
      //   const pPhoto = await _processImageAsync(photo.uri);
      //   const img = {
      //     uri : pPhoto.uri,
      //     name : photo.filename,
      //     type : 'image/jpg'
      //   }
      //   cPhotos.push(img)
      // })
      navigation.navigate('Upload');
    })
    .catch((e) => console.log(e));
  };

  return (
    <View style={{display: "flex", height: "100%"}}>
      <ImageBrowser
        max={10}
        onChange={updateHandler}
        callback={imagesCallback}
        renderSelectedComponent={renderSelectedComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF'
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff'
  }
})

export default MultipleImage;
