import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
  Alert,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import CONNECTION_STRING from "../../../../../values/ConnectionString";
import MessageBox from "./MessageBox";

function ChatBox({ listUser }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [listMsg, setListMsg] = React.useState([]);

  const getMessage = async (id) => {
    console.log(id);

    const token = await AsyncStorage.getItem("userToken");
    if (token !== null) {
      const url =
        "http://" +
        CONNECTION_STRING.string +
        "/api/chat/get-talk-messages/" +
        id;
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
          setListMsg(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={{ display: "flex", flexDirection: "row", width: "100%" }}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../../../../../images/iconapp.png")}
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
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.bodyText}>{listUser.name}</Text>
          <Text style={{ color: "grey" }}></Text>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          onShow={() => getMessage(listUser.id)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{listUser.name}</Text>
                <MessageBox listMessage={listMsg}  ></MessageBox>

              <TouchableHighlight
                style={{
                  ...styles.closeButton,
                  backgroundColor: "#f7a48b",
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    height: "90%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#fc9b8a",
    position: "absolute",
    right: 0,
    top: -35,
    width: 80,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    position: "absolute",
    top: -30,
    left: 0,
    fontSize: 30,
    textAlign: "center",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 12,
    paddingBottom: 26,
    paddingRight: 16,
  },
  bodyText: {
    lineHeight: 20,
    fontSize: 20,
    marginTop: 10,
    color: "#424242",
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default ChatBox;
