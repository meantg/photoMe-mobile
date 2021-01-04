import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../../../../services/redux/reducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function MessageBox({ listMessage, contact }) {
  const user = useSelector((state: RootState) => state.user);

  const senderMsg = () =>{

  }

  if (listMessage && listMessage.length) {
    return (
      <ScrollView style={styles.msgBox}>
        {listMessage.map((msg, index) => {
          if (msg["senderId"] == user.id) {
            return (
              <View
                key={index}
                style={{
                  display: "flex",
                  width: windowWidth,
                }}
              >
                <Text>{msg["content"]}</Text>
                {/* <TextInput key={1} style={styles.input}></TextInput> */}
              </View>
            );
          }
          else{
            return(
              <View></View>
            )
          }
        })}
      </ScrollView>
    );
  }
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    position: "absolute",
    width: windowWidth,
    height: 50,
    backgroundColor: "grey",
    borderBottomWidth: 1,
  },
  msgBox: {
    width: "100%",
    height: "auto",
    backgroundColor: "grey",
    padding: 15
  },
});

export default MessageBox;
