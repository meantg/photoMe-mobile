import { FontAwesome } from "@expo/vector-icons";
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
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CONNECTION_STRING from "../../../../../values/ConnectionString";
import MessageBox from "./MessageBox";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../../../services/redux/reducer";
import ChatSocketService from "../../../../../services/signalr";
import MessageModel from "../../../../../values/models/MessageModel";
import signalR, { HubConnection } from "@microsoft/signalr";

type User = {
  name: string;
  id: string;
};



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function ChatBox({ Contact }) {
  const user = useSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [listMsg, setListMsg] = React.useState<MessageModel[]>();
  const [listUser, setListUser] = React.useState<User[]>();
  const [isLoadDone, setDone] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [connection, setConnection] = React.useState<HubConnection>();
  const [listMessage, setListMessage] = React.useState<MessageModel[]>();

  React.useEffect(() => {
    // connectChatHub();
    getUserInfo();
  }, []);

  const connectChatHub = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token !== null) {
      console.log("connected");
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          "https://photomeapi20201204143027.azurewebsites.net/chatsocket",
          {
            accessTokenFactory: () => token,
          }
        )
        .configureLogging(signalR.LogLevel.Information)
        .build();
      setConnection(newConnection);
      newConnection.start().then(() => {
        console.log("connected");
      });
    }
  };

  const getMessage = async () => {
    console.log("GetMsg");

    const token = await AsyncStorage.getItem("userToken");
    if (token !== null) {
      const url =
        CONNECTION_STRING.string + "chat/get-talk-messages/" + Contact;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const res = Axios.get(url, config);
        if ((await res).status == 200) {
          const data = (await res).data;

          setListMsg(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getUserInfo = async () => {
    console.log("getUserInfo");
    const dataList: User[] = [];

    const token = await AsyncStorage.getItem("userToken");

    if (token !== null) {
      console.log("RunAPI");

      const url = CONNECTION_STRING.string + "user/" + Contact;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const res = Axios.get(url, config);
        if ((await res).status == 200) {
          const data = (await res).data;
          if (data !== null) {
            console.log("getUserDone");
            const _user: User = { name: data.userName, id: data.id };
            dataList.push(_user);
          }
        }
      } catch (err) {
        console.log(err);
      }
      setListUser(dataList);
      setDone(true);
    }
  };

  const findName = (ContactID) => {
    if (listUser) {
      const index = listUser.findIndex((x) => x.id === ContactID);
      return listUser[index].name;
    }
  };

  const sendMsg = async () => {
    if (msg != "") {
      const token = await AsyncStorage.getItem("userToken");
      const listMessage: MessageModel[] = [];
      
      if (token != null) {
        const url = CONNECTION_STRING.string + "chat/send/" + Contact;
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
          receiverId: Contact,
        };

        const jsonBody = JSON.stringify(body);

        try {
          const res = await Axios.post(url, jsonBody, config);
          if (res.status == 200) {
            console.log(res.data);
            console.log("SendDone");
            const newMessage : MessageModel = {
              senderId : res.data.senderId,
              receiverId : res.data.receiverId,
              content: res.data.content,
              type: 'send'
            };
            listMessage.push(newMessage);

          }
        } catch (err) {
          console.log(err);
        }

        setListMsg(listMessage);
      }
    }
  };

  if (listUser && isLoadDone) {
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
            <Text style={styles.bodyText}>{findName(Contact)}</Text>
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
            onShow={() => getMessage()}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{findName(Contact)}</Text>
              <KeyboardAvoidingView
                keyboardVerticalOffset={110}
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <MessageBox
                  listMessage={listMsg}
                  contact={Contact}
                ></MessageBox>
                <View style={{ position: "relative" }}>
                  <TextInput
                    returnKeyType="send"
                    autoFocus={true}
                    keyboardAppearance="dark"
                    clearButtonMode="always"
                    key={Contact}
                    placeholder="Type something ..."
                    blurOnSubmit={false}
                    style={styles.inputInbox}
                    onChangeText={(text) => {
                      setMsg(text);
                    }}
                    onSubmitEditing={sendMsg}
                    value={msg}
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
  return null;
}

const styles = StyleSheet.create({
  inputInbox: {
    width: windowWidth - 40,
    padding: 15,
    borderWidth: 4,
    borderRadius: 50,
    borderColor: "#637373",
  },
  input: {
    width: "100%",
    height: 50,
  },
  centeredView: {
    flex: 1,
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
  closeButton: {
    position: "absolute",
    right: -50,
    top: -45,
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
