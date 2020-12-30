import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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
            width: 70,
            position: "absolute",
            bottom: -30,
            right: 10,
            height: 70,
            backgroundColor: "#fff",
            borderRadius: 15,
            zIndex: 6
          }}
        >
          <Icon name="plus" size={30} color="#01a699" />
        </TouchableOpacity>
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
      <ScrollView style={styles.botProfile}>
        <View style={{display: "flex", flexDirection: "row"}}>
        <View style={styles.leftBotProfile}>
          <Text style={{marginTop: 40, marginBottom: 100 ,transform: [{rotate: '90deg'}]}}>Albums</Text>
          <Text style={{marginBottom: 50 ,transform: [{rotate: '90deg'}]}}>Photos</Text>
        </View>
        <View style={styles.rightBotProfile}>
          <View style={styles.albums}>
            <Text>Albums</Text>
          </View>
          <View style={styles.photos}>
            <Text>Photos</Text>
          </View>
        </View>
        </View>
       
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  photos: {},

  albums: {},

  rightBotProfile: {
    width: "80%",
  },

  leftBotProfile: {
    width: "15%",
    height: "100%",
    backgroundColor: "grey",
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

  container: {
  },
});

export default NewProfile;
