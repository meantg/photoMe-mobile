import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "@react-navigation/stack";
import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Image,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Comment from "../../../../components/Card/Comment";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import CONNECTION_STRING from "../../../../values/ConnectionString";
import Axios from "axios";
import { useSelector, dispatch } from "../../../../../node_modules/react-redux";
import { RootState } from "../../../../services/redux/reducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function CommentScreen({ navigation, route }) {
  const user = useSelector((state: RootState) => state.user);
  const [isCmt, setIsCmt] = React.useState(true);
  const [cmtInput, setInput] = React.useState("");
  const [inputHeight, setHeight] = React.useState(0);
  const [listCmt, setCmt] = React.useState([]);
  const album = route.params.album;

  const goBack = () => {
    setIsCmt(false);
    navigation.goBack("Home", {
      param: isCmt,
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Comment");
    });
    getComments();
  }, []);

  const getComments = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decode: any = jwt_decode(token);
      const url = CONNECTION_STRING.string + "review/" + album.id;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const res = Axios.get(url, config);
        if ((await res).status == 200) {
          const data = (await res).data;
          console.log(data);
          setCmt(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onPostComment = async () => {
    if (cmtInput != "") {
      console.log("PostComment");
      setInput("");

      const token = await AsyncStorage.getItem("userToken");
      if (token != null) {
        var decoded: any = jwt_decode(token);
        const url = CONNECTION_STRING.string + "review/new-review";
        const config = {
          headers: {
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        };
        const body = {
          albumId: album.id,
          makerId: user.id,
          reviewMessage: cmtInput,
        };

        const jsonBody = JSON.stringify(body);

        try {
          const response = await Axios.post(url, jsonBody, config);
          if ((await response).status == 200) {
            console.log(response.data);
            const newCmt = response.data;
            console.log(newCmt);
            newCmt["maker"] = { name: user.name, avatarUrl: user.avatarUrl };
            setCmt(listCmt.concat(newCmt));
            console.log(newCmt);

            console.log("cmt done");
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      console.log("Cmt null");
    }
  };

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <TouchableOpacity
        onPress={goBack}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#ffeadb",
          height: 40,
        }}
      >
        <MaterialCommunityIcons
          style={{ marginLeft: 20 }}
          name="keyboard-backspace"
          size={24}
          color="black"
        />
        <Text style={{ color: "black", letterSpacing: 2, fontWeight: "600" }}>
          {" "}
          COMMENT
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.bodyText}>
          <Text style={styles.like}> {album.photographer.name}</Text>{" "}
          {album.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#424242",
            marginLeft: 15,
            marginTop: -15,
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          {album.albumType}
        </Text>
        <Text
          style={{
            marginLeft: 5,
            marginBottom: 5,
            fontSize: 15,
            letterSpacing: 2,
            fontWeight: "bold",
          }}
        >
          OTHER COMMENT
        </Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        ></TouchableWithoutFeedback>
        <ScrollView style={{ marginTop: 15, marginBottom: 80 }}>
          <Comment listCmt={listCmt}></Comment>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#679b9b",
          bottom: inputHeight,
          padding: 20,
          position: "absolute",
        }}
      >
        <Image
          source={{ uri: user.avatarUrl }}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
            borderWidth: 1,
            borderRadius: 90,
            marginRight: 5,
            borderColor: "rgba(236,231,231,1)",
          }}
        ></Image>
        <TextInput
          // value={this.state.email}
          style={{
            borderWidth: 1,
            borderRadius: 20,
            marginRight: 20,
            padding: 10,
            borderColor: "white",
            color: "white",
            height: 40,
            width: "85%",
          }}
          placeholder="WRITE YOUR COMMENTS HERE"
          placeholderTextColor="white"
          onChangeText={(text) => {
            setInput(text);
          }}
          keyboardAppearance="dark"
          clearButtonMode="always"
          value={cmtInput}
          blurOnSubmit={false}
          onSubmitEditing={onPostComment}
          onFocus={() => {
            setHeight(270);
          }}
          onBlur={() => {
            setHeight(0);
          }}
          maxLength={80}
          returnKeyType="send"
          autoFocus={true}
        />
      </View>
    </View>
  );
}

export default CommentScreen;

const styles = StyleSheet.create({
  bodyText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#424242",
    marginLeft: 12,
    marginBottom: 20,
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
