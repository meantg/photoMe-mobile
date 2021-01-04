import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CONNECTION_STRING from "../../../../values/ConnectionString";
import ChatBox from "./ChatBox";
import jwt_decode from "jwt-decode";
import { SearchBar } from 'react-native-elements';

type User = {
  name: string;
  id: string;
};

function ListContact({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const [listContact, setContact] = React.useState([]);
  const [listUser, setListUser] = React.useState<User[]>();
  const [isLoadDone, setDone] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Inbox");
      getListContact();
      // getUserInfo();
    });
    return unsubscribe;
  }, []);

  // React.useEffect(() => {
  //     console.log("SetDone");
  //     if(listUser === []){
  //       getUserInfo();
  //     }
  //     setDone(true);
  // }, [listUser]);

  const getListContact = async () => {
    console.log("getListContact");

    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url = CONNECTION_STRING.string + "chat/get-list-contact";
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

        const url = +CONNECTION_STRING.string + "user/" + contactId;
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
      setDone(true);
    }
  };

  if (listContact) {
    return (
      <View>
        <SearchBar></SearchBar>
        <ScrollView style={styles.scrollStyle}>
          {listContact.map((user, index) => {
            return <ChatBox key={index} Contact={user}></ChatBox>;
          })}
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
}

export default ListContact;

const styles = StyleSheet.create({
  scrollStyle: {
    padding: 5,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    top: -55,
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
    fontSize: 16,
    color: "#424242",
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
