import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import CardItem from "../../../components/Card";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../services/redux/reducer";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import UserModel from "../../../values/models/UserModel";
import { setUser } from "../../../services/redux/slices/userSlices";
import AlbumModel from "../../../values/models/AlbumModel";
import CONNECTION_STRING from "../../../values/ConnectionString";
import { useScrollToTop } from "@react-navigation/native";

type AlbumState = {
  albums: AlbumModel[];
  loading: boolean;
};

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

function HomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const INITIAL_STATE = {
    albums: [],
    loading: true,
  };

  const [state, setState] = React.useState<AlbumState>(INITIAL_STATE);
  const { albums, loading } = state;
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

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

  React.useEffect(() => {
    console.log("Test");
  }, [albums, loading]);

  async function getUser() {
    const token = await AsyncStorage.getItem("userToken");
    console.log(token);

    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url =
        "http://" +
        CONNECTION_STRING.string +
        ":5000/api/user/" +
        decoded.nameid;
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
        console.log(err);
      }
    } else {
      const url =
        "http://" + CONNECTION_STRING.string + ":5000/api/user/" + user.id;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = Axios.get(url, config);
        console.log((await response).data);
      } catch (err) {
        console.log(err);
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
        "http://" +
        CONNECTION_STRING.string +
        "/api/user/" +
        decoded.nameid +
        "/albums/all";
      const response = await Axios.get(url, config);
      const album = response.data;
      setState({
        albums: album,
        loading: false,
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          ref={ref}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.group}>
            {albums.map((album) => (
              <CardItem key={album["id"]} album={album} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
