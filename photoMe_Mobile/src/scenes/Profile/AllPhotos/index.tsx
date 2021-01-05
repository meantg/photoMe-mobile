import Axios from "axios";
import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardItem from "../../../components/Card";
import UserModel from "../../../values/models/UserModel";
import { useSelector, dispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import AlbumModel from "../../../values/models/AlbumModel";
import { RootState } from "../../../services/redux/reducer";
import { setUser } from "../../../services/redux/slices/userSlices";
import CONNECTION_STRING from "../../../values/ConnectionString";

type AlbumState = {
  albums: AlbumModel[];
  loading: boolean;
};

function AllPhotos() {
  const user = useSelector((state: RootState) => state.user);
  const INITIAL_STATE = {
    albums: [],
    loading: true,
  };

  const [state, setState] = React.useState<AlbumState>(INITIAL_STATE);
  const { albums, loading } = state;

  React.useEffect(() => {
    initNewfeed();
  }, []);

  async function initNewfeed() {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const url =
        CONNECTION_STRING.string + "user/" + decoded.nameid + "/albums/all";
      const response = await Axios.get(url, config);
      if (response.status == 200) {
        const album = response.data;
        console.log(album.length);

        setState({
          albums: album,
          loading: false,
        });
      }
    }
  }

  const renderCardAlbum = (album) => (
    <CardItem
      key={album["item"]["id"]}
      album={album["item"]}
      avatarUrl={user["avatarUrl"]}
    />
  );

  if (state.albums && !loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            data={state.albums}
            renderItem={renderCardAlbum}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
        </View>
      </SafeAreaView>
    );
  } 
    return (
      <View>
        <Text>You didn't upload anything yet !</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default AllPhotos;
