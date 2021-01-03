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

function ChatBox({contact}) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const getMessage = async (id) => {
    // const pos = listUser.map(funSction(e) { return e.name; }).indexOf(name);
    console.log(id);

    // const token = await AsyncStorage.getItem("userToken");
    // if(token != null){
    //     const url = "http://" + CONNECTION_STRING.string + "/api/chat/get-talk-message/" +
    // }
  };

  return (
    <View  style={styles.body}>
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
        <View>
          <Text style={styles.bodyText}>{contact.name}</Text>
          <Text style={{ color: "grey" }}></Text>
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          onShow={() => getMessage(contact.id)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

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

export default ChatBox;
