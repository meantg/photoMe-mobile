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
  TextInput,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CONNECTION_STRING from "../../../../values/ConnectionString";
import ChatBox from "./ChatBox";
import jwt_decode from "jwt-decode";
import { FontAwesome } from "@expo/vector-icons";
import Highlighter from "react-native-highlight-words";
import SearchResult from "./ChatBox/SearchResult";

type User = {
  name: string;
  id: string;
};

function ListContact({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const [listContact, setContact] = React.useState([]);
  const [listUser, setListUser] = React.useState<User[]>();
  const [isLoadDone, setDone] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [isSearch, setSearchRender] = React.useState(false);
  const textInputReference = React.useRef(null);
  const NO_WIDTH_SPACE = "​";

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

  const searchFilter = async (text) => {
    setSearch(text);
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      const url = CONNECTION_STRING.string + "user/search";
      const config = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
          Accept: "application/json",
        },
      };
      const body = {
        username: text,
      };

      const jsonBody = JSON.stringify(body);
      try {
        const res = Axios.post(url, jsonBody, config);
        if ((await res).status == 200) {
          const data = (await res).data;
          setSearchResult(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (listContact) {
    return (
      <View>
        <SafeAreaView style={{ flex: 1 }}>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              paddingLeft: 20,
              borderRadius: 15,
              margin: 5,
              borderColor: "#009688",
              backgroundColor: "#FFFFFF",
            }}
            placeholder="⚲ Search someone ..."
            onChangeText={(text) => searchFilter(text)}
            clearButtonMode="always"
            onFocus={() => {
              setSearchRender(true);
            }}
            onBlur={() => {
              if (search == "") setSearchRender(false);
            }}
            value={search}
          ></TextInput>
        </SafeAreaView>
        {!isSearch ? (
          //notSearching
          <ScrollView style={styles.scrollStyle}>
            {listContact.map((user, index) => {
              return <ChatBox key={index} Contact={user}></ChatBox>;
            })}
          </ScrollView>
        ) : (
          //Searching
          <ScrollView style={styles.scrollStyle}>
            {searchResult.map((result, index) => {
              return (
                <SearchResult
                  search={search}
                  result={result}
                  key={index}
                ></SearchResult>
              );
            })}
          </ScrollView>
        )}
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
  highlighted: {
    backgroundColor: "yellow",
  },
  scrollStyle: {
    padding: 5,
    marginTop: 45,
    height: "100%",
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
    position: "absolute",
    top: -30,
    left: 50,
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
    fontSize: 16,
    color: "#424242",
  },
  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
