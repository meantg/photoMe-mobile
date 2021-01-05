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
                  height: 30,
                  alignSelf: "flex-end",
                  justifyContent:"center",
                  borderRadius: 25,
                  backgroundColor: "#ff9a76"
                }}
              >
                <Text style={{color: '#ffffff', alignSelf: 'center', fontSize : 20}} >{"  "}{msg["content"]} {" "}</Text>
                {/* <TextInput key={1} style={styles.input}></TextInput> */}
              </View>
            );
          }
          else {
            return(
              <View
                key={index}
                style={{
                  display: "flex",
                  height: 30,
                  justifyContent:"center",
                  alignSelf: "flex-start",
                  borderRadius: 25,
                  backgroundColor: "grey"
                }}
              >
                <Text style={{color: '#ffffff', alignSelf: 'center',  fontSize : 20}} >{"  "}{msg["content"]} {"   "}</Text>
                {/* <TextInput key={1} style={styles.input}></TextInput> */}
              </View>
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
    padding: 15,
    marginTop: 10
  },
});

export default MessageBox;
