import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  MaskedViewIOS,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import TabAlbum from "../../components/TabAlbum";
import jwt_decode from "jwt-decode";
import Axios from "axios";
import UserModel from "../../values/models/UserModel";
import { useSelector, dispatch } from "react-redux";
import { setUser } from "../../services/redux/slices/userSlices";
import { RootState } from "../../services/redux/reducer";
import CONNECTION_STRING from "../../values/ConnectionString";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AlbumCard from "../../components/AlbumCard";
import CardItem from "../../components/Card";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function NewProfile({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [albums, setAlbums] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("ProfilePage");
      initNewfeed();
    });
    getToken();

    return unsubscribe;
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log(token);
  };

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
        setAlbums(album);
        setLoading(false);
      }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.landscape}>
        <Image
          source={{ uri: user["avatarUrl"] }}
          style={{ flex: 1, width: undefined, height: 100, opacity: 0.8 }}
          resizeMode="cover"
        ></Image>
        <BlurView
          intensity={80}
          tint={"light"}
          style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
        >
          <View style={{ marginLeft: 20 }}>
            <Text
              style={{
                fontSize: 30,
                color: "#ebcea2",
                fontWeight: "800",
                textShadowColor: "rgba(150, 88, 46, 0.75)",
                textShadowOffset: { width: -2, height: 2 },
                textShadowRadius: 3,
              }}
            >
              {user.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text> 121 Follow</Text>
              <Text> 500 Likes</Text>
            </View>
          </View>
        </BlurView>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            position: "absolute",
            bottom: 50,
            right: 15,
            height: 60,
            backgroundColor: "#f05454",
            borderRadius: 15,
          }}
        >
          <AntDesign name="heart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.botProfile}>
        <TouchableOpacity
          style={{
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            top: -45,
            right: 10,
            height: 70,
            backgroundColor: "#637373",
            borderRadius: 15,
            zIndex: 6,
          }}
        >
          <Entypo name="new-message" size={35} color="#fff" />
        </TouchableOpacity>
        <View style={{}}>
          <View style={styles.listAlbums}>
            <Text
              style={{
                position: "absolute",
                marginTop: 40,
                marginLeft: -10,
                fontSize: 20,
                transform: [{ rotate: "90deg" }],
              }}
            >
              Albums
            </Text>
            <ScrollView
              style={{ marginLeft: 50, backgroundColor: "#ffeadb" }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {albums.map((album, index) => {
                return <AlbumCard key={index} album={album}></AlbumCard>;
              })}
            </ScrollView>
          </View>
          <View style={styles.listPhotos}>
            <Text
              style={{
                position: "absolute",
                marginTop: 40,
                transform: [{ rotate: "90deg" }],
              }}
            >
              Photos
            </Text>
            <View>
              {albums.map((album) => {
                return (
                  <CardItem
                    key={album["id"]}
                    album={album}
                    avatarUrl={user["avatarUrl"]}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  photos: {},

  albums: {},

  listAlbums: {
    height: windowHeight / 6,
    backgroundColor: "#ff9a76",
  },

  listPhotos: {
    height: "55%",
    backgroundColor: "white",
  },

  nonBlurredContent: {
    position: "absolute",
    marginTop: 120,
  },
  botProfile: {
    width: "100%",
    height: "100%",
  },

  landscapeImg: {
    resizeMode: "contain",
  },

  landscape: {
    width: "100%",
    height: Dimensions.get("window").height / 4,
    maxHeight: 400,
  },

  container: {},
});

export default NewProfile;
