import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../../../../services/redux/reducer";

function MessageBox({ listMessage }) {
  const user = useSelector((state: RootState) => state.user);

  if (listMessage && listMessage.length ) {
    return (
      <View style={styles.msgBox}>
        {listMessage.map((msg, index) => {
          return (
            <Text key={index} >{msg["content"]}</Text>
          );
        })}
      </View>
    );
  }
  return <View>
      <ActivityIndicator/>
  </View>
}

const styles = StyleSheet.create({
  msgBox: {
    width: 80,
    height: 30,
    backgroundColor: "grey",
  },
});

export default MessageBox;
