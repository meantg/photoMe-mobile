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
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AlbumCard from "../../components/AlbumCard";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function NewProfile({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("ProfilePage");
    });
    getToken();

    return unsubscribe;
  }, [navigation]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    console.log(token);
  };

  return (
    <View style={styles.container}>
      <View style={styles.landscape}>
        <Image
          source={require("../../images/iconapp.png")}
          style={{ flex: 1, width: undefined, height: 100, opacity: 0.8 }}
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
            backgroundColor: "#fff",
            borderRadius: 15,
          }}
        >
          <Icon name="plus" size={30} color="#01a699" />
        </TouchableOpacity>
      </View>
      <View style={styles.botProfile}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            top: -45,
            right: 10,
            height: 70,
            backgroundColor: "#fff",
            borderRadius: 15,
            zIndex: 6,
          }}
        >
          <Icon name="plus" size={30} color="#01a699" />
        </TouchableOpacity>
        <View style={{}}>
          <View style={styles.listAlbums}>
            <Text
              style={{
                position: "absolute",
                marginTop: 40,
                transform: [{ rotate: "90deg" }],
              }}
            >
              Albums
            </Text>
            <ScrollView
              style={{ marginLeft: 50 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
              <AlbumCard></AlbumCard>
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
            <MaskedViewIOS
              style={{ flex: 1, flexDirection: "row", height: "100%" }}
              maskElement={
                <View
                  style={{
                    // Transparent background because mask is based off alpha channel.
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 60,
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Basic Mask
                  </Text>
                </View>
              }
            >
              {/* Shows behind the mask, you can put anything here, such as an image */}
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: "#324376",
                }}
              />
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: "#F5DD90",
                }}
              />
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: "#F76C5E",
                }}
              />
            </MaskedViewIOS>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photos: {},

  albums: {},

  listAlbums: {
    height: windowHeight / 6,
    backgroundColor: "grey",
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
