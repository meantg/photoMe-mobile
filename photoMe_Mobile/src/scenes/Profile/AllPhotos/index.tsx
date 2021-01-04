import Axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
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
    console.log(user);
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
        CONNECTION_STRING.string +"user/" + decoded.nameid + "/albums/all";
      const response = await Axios.get(url, config);
      const album = response.data;
      setState({
        albums: album,
        loading: false,
      });
    }
  }

  return (
    <View style={styles.container}>
      {albums.map((album) => (
        <CardItem key={album["id"]} album={album} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AllPhotos;
