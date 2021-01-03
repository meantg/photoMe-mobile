import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableHighlight, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CONNECTION_STRING from "../../../../values/ConnectionString";
import ChatBox from "./ChatBox";

type User = {
  name: string;
};

function ListContact({ listUser, listContact }) {
  const users = listUser;
  const [modalVisible, setModalVisible] = React.useState(false);

  const getMessage = async (id) => {
    // const pos = listUser.map(funSction(e) { return e.name; }).indexOf(name);
    console.log(id);
      
      
    // const token = await AsyncStorage.getItem("userToken");
    // if(token != null){
    //     const url = "http://" + CONNECTION_STRING.string + "/api/chat/get-talk-message/" +
    // }

  }

  if (users && users.length) {
      console.log(users);
      
    return (
      <ScrollView
        style={{ display: "flex", marginTop: 10, backgroundColor: "white" }}
      >
        {users.map((contact, index) => {
          <ChatBox key={index} contact = { contact}></ChatBox>
        })}
      </ScrollView>
    );
  }
  return null;
}

export default ListContact;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        height: "90%",
        position : "absolute",
        bottom: 0,
        alignItems: "center",
        elevation: 5
      },
      closeButton: {
        backgroundColor: "#fc9b8a",
        position: "absolute",
        right: 0,
        top: -55,
        width : 80,
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
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
    fontSize: 16,
    color: "#424242",
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
