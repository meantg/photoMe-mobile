import React, { Component, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import SegmentedControlTab from "react-native-segmented-control-tab";
import AlbumGrid from "../../scenes/Profile/Album";
import AllPhotos from "../../scenes/Profile/AllPhotos";

function TabAlbum() {
  const [tabIndex, setIndex] = useState(0);

  const handleIndexChange = (index: any) => {
    setIndex(index);
  };

  return (
    <View style={[styles.container]}>
      <SegmentedControlTab
        values={["Photos", "Albums"]}
        borderRadius= {10}
        selectedIndex={tabIndex}
        onTabPress={handleIndexChange}
        activeTabStyle={{ backgroundColor: "#e8a772" }}
        tabsContainerDisableStyle={{backgroundColor: 'grey'}}
        tabTextStyle={{color: '#000'}}
        tabStyle={{
          borderColor: "#fff",
          width: 100,
          justifyContent: "center",
          backgroundColor: '#ddd',
          alignItems: "center",
        }}
      />
      <View style={{flex : 1, marginTop: 10}}>
        {tabIndex === 1 ? (
            <AlbumGrid/>
        ) : (
            <AllPhotos/>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100vw",
    height: 29,
    maxWidth: 400,
    justifyContent: "center",
    alignSelf: 'center'
  },
  albumGrid: {
    flex: 1
  },
});

export default TabAlbum;
