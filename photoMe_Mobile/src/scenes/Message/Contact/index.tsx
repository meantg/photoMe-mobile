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
  TouchableHighlight,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import jwt_decode from "jwt-decode";
import Axios from "axios";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../services/redux/reducer";
import UserModel from "../../../values/models/UserModel";
import CONNECTION_STRING from "../../../values/ConnectionString";
import ListContact from "./ListContact";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type User = {
  name: string;
  id : string
};

function Inbox({ navigation }) {
  const user = useSelector((state: RootState) => state.user);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [listContact, setContact] = React.useState([]);
  const [listUser, setListUser] = React.useState<User[]>();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Inbox");
      getListContact();
    });
    return unsubscribe;
  }, []);

  React.useEffect(()=>{
    getUserInfo()
  },[listContact])

  const getListContact = async () => {
    console.log("getListContact");

    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url =
        "http://" + CONNECTION_STRING.string + "/api/chat/get-list-contact";
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
          setContact(data);
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
      listContact.map(async (contactId) => {
        console.log(contactId);
        console.log("RunAPI");

        const url =
          "http://" + CONNECTION_STRING.string + "/api/user/" + contactId;
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
      });
      setListUser(dataList);
    }
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Text style={{marginLeft: 10, fontSize: 20, fontWeight : "bold", letterSpacing: 2}}>ListContact</Text>
      <ListContact listContact={listContact} listUser={listUser}></ListContact>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "100%",
    position: "absolute",
    height: "95%",
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  openButton: {
    position: "absolute",
    right: 10,
    top: -40,
    backgroundColor: "#F194FF",
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
    textAlign: "center",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    marginTop: -12,
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
  container: {},
  scrollcontainer: {
    width: "100%",
    height: "100%",
  },
});

export default Inbox;
