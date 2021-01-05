import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableHighlight,
  TextInput,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Highlighter from "react-native-highlight-words";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONNECTION_STRING from "../../../../../../values/ConnectionString";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../../../../services/redux/reducer";
import Axios from "axios";

const windowWidth = Dimensions.get("window").width;

function SearchResult({ result, search }) {
  const user = useSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [inputHeight, setHeight] = React.useState(0);
  const [msg, setMsg] = React.useState("");

  console.log("RenderResult");

  const onPostComment = async () => {
    if (msg != "") {
      console.log("PostComment");
      setMsg("");

      const token = await AsyncStorage.getItem("userToken");
      if (token != null) {
        const url = CONNECTION_STRING.string + "review/new-review";
        const config = {
          headers: {
            Authorization: "Bearer " + token,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        };
        const body = {
          content: msg,
          senderId: user.id,
          receiverId: result["id"],
        };

        const jsonBody = JSON.stringify(body);

        try {
          const response = await Axios.post(url, jsonBody, config);
          if ((await response).status == 200) {
            console.log(response.data);
            const newMessage = response.data;
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
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: result["avatarUrl"] }}
          resizeMode="contain"
          style={{
            width: 40,
            maxWidth: 140,
            height: 40,
            borderWidth: 1,
            borderRadius: 90,
            marginRight: 5,
            borderColor: "rgba(236,231,231,1)",
          }}
        ></Image>
        <View style={{}}>
          <Highlighter
            highlightStyle={{ backgroundColor: "yellow" }}
            searchWords={[search]}
            textToHighlight={result["name"]}
          />
          <Text style={{ color: "grey" }}></Text>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          style={{}}
          onShow={() => {}}
        >
          <View style={styles.modalView}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                position: "absolute",
                top: -35,
                left: -5,
              }}
              source={{ uri: result["avatarUrl"] }}
            ></Image>
            <Text style={styles.modalText}>{result["name"]}</Text>
            <KeyboardAvoidingView
              keyboardVerticalOffset={110}
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                style={{ height: "auto", alignSelf: "center", marginTop: 200 }}
              >
                <Text>You haven't messege to {result["name"]} yet !</Text>
              </View>
              <View style={{ position: "absolute", bottom: inputHeight }}>
                <TextInput
                  value={msg}
                  returnKeyType="send"
                  autoFocus={true}
                  keyboardAppearance="dark"
                  clearButtonMode="always"
                  placeholder="Type something ..."
                  onFocus={() => {
                    setHeight(270);
                  }}
                  onBlur={() => {
                    setHeight(0);
                  }}
                  style={styles.inputInbox}
                  onSubmitEditing={onPostComment}
                  blurOnSubmit={false}
                  onChangeText={(text) => {setMsg(text)}}
                ></TextInput>
              </View>
            </KeyboardAvoidingView>
            <TouchableHighlight
              style={{
                ...styles.closeButton,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome name="close" size={24} color="red" />
            </TouchableHighlight>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputInbox: {
    width: windowWidth - 40,
    padding: 15,
    borderWidth: 4,
    borderRadius: 50,
    borderColor: "#637373",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    height: "90%",
    position: "absolute",
    bottom: 0,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    position: "absolute",
    top: -30,
    left: 50,
    fontSize: 30,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: -45,
    top: -45,
    width: 80,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default SearchResult;
