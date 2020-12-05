import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CardItem from "../../../components/Card";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../services/redux/reducer";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import UserModel from "../../../values/models/UserModel";
import { setUser } from "../../../services/redux/slices/userSlices";
import AlbumModel from "../../../values/models/AlbumModel";

type AlbumState = {
  albums: AlbumModel[];
  loading: boolean;
};

function HomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const INITIAL_STATE = {
    albums: [],
    loading: true,
  };

  const [state, setState] = React.useState<AlbumState>(INITIAL_STATE);
  const { albums, loading } = state;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("HomePage");
      getUser();
      initNewfeed();
    });
    if (loading === true) {
      getUser();
      initNewfeed();
    }
    console.log(user);
    return unsubscribe;
  }, [loading]);

  async function getUser() {
    const token = await AsyncStorage.getItem("userToken");
    console.log(token);

    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url = "http://10.0.2.2:5000/api/user/" + decoded.nameid;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = Axios.get(url, config);
        if ((await response).status == 200) {
          const userModel: UserModel = (await response).data.user;
          dispatch(setUser(userModel));
        }
      } catch (err) {
        // console.log(err);
      }
    } else {
      const url = "http://10.0.2.2:5000/api/user/" + user.id;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = Axios.get(url, config);
        console.log((await response).data);
      } catch (err) {
        //   console.log(err);
      }
    }
  }

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
        "http://10.0.2.2:5000/api/user/" + decoded.nameid + "/albums/all";
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
      <View style={styles.group}>
        {albums.map((album) => (
          <CardItem key={album["id"]} album={album}/>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  group: {},
  cardItem: {
    bottom: 64,
    marginTop: 15,
    marginBottom: 15,
  },
});

export default HomeScreen;
