import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
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
};

function HomeScreen({ navigation, route }) {
  const user = useSelector((state: RootState) => state.user);
  const INITIAL_STATE = {
    albums: [],
  };

  const [state, setState] = React.useState<AlbumState>(INITIAL_STATE);
  const { albums } = state;
  const [isDone, setDone] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [isCmt, setIsCmt] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  React.useEffect(() => {
    console.log(isCmt);

    if (route.params?.param) {
      setIsCmt(route.params.param);
    }
  }, [route.params?.isCmt]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setLoading(true);
    initNewfeed();
    console.log("reload");
    wait(2000).then(() => {
      console.log("reload done");
      setRefreshing(false);
    });
  }, []);

  //InitNewfeed
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("HomePage");
      console.log(user);
    });
    getUser();
    initNewfeed();
    setPage(page + 1);
    return unsubscribe;
  }, []);

  async function getUser() {
    const token = await AsyncStorage.getItem("userToken");
    console.log(token);

    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url = CONNECTION_STRING.string + "user/" + decoded.nameid;
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
      const url = CONNECTION_STRING.string + "/api/user/" + user.id;
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
        CONNECTION_STRING.string +
        "user/" +
        decoded.nameid +
        "/albums/paged?page=" +
        page +
        "&pageSize=2";
      try {
        const response = await Axios.get(url, config);
        const album = response.data;
        setState({
          albums: album,
        });
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  }

  async function loadMoreAlbum() {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const url =
        CONNECTION_STRING.string +
        "user/" +
        decoded.nameid +
        "/albums/paged?page=" +
        page +
        "&pageSize=4";
      const response = await Axios.get(url, config);
      const album = response.data;
      if (album) {
        setState({
          albums: albums.concat(album),
        });
      }
      setLoading(false);
    }
  }

  const renderCardAlbum = (album) => (
    <CardItem
      key={album["item"]["id"]}
      album={album["item"]}
      avatarUrl={user["avatarUrl"]}
    />
  );

  const loadMore = () => {
    console.log("ReachEnd");
    console.log(isCmt);

    if (loading == false) {
      setLoading(true);
      setPage(page + 1);
      loadMoreAlbum();
    }
  };

  const renderLoading = () => {
    return loading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    ) : null;
  };

  const renderEmpty = () => {
    return (
      <View>
        <Text>Đã hết album rồi !!!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ref={ref}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={albums}
          renderItem={renderCardAlbum}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderLoading}
          ListEmptyComponent={renderEmpty}
        ></FlatList>
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
  loading: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default HomeScreen;
