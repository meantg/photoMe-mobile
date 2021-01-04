import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

function Comment({ listCmt }) {
  const cmts = listCmt;

  if (cmts && cmts.length) {
    return (
      <View style={{ display: "flex", marginTop: 10, }}>
        {cmts.map((cmt) => {
          const time: string = cmt["updatedAt"];
          const days = time.substr(0, 10);
          const hour = time.substr(11, 8);
          return (
            <View key={cmt["id"]} style={styles.body}>
              <Image
                source={require("../../../images/iconapp.png")}
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
                <Text style={styles.bodyText}>
                  <Text style={styles.like}> {cmt["maker"].name} </Text>
                  {cmt["reviewMessage"]}
                </Text>
                <Text style={{ color: "grey" }}>
                  {" "}
                  {hour} {days}{" "}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  } else {
    // return (
    //   <View>
    //     <Text style={{ marginLeft: 15, marginBottom: 15}}>Chua ai binh luan ve anh nay </Text>
    //   </View>
    // );
  }
  return null;
}

export default Comment;

const styles = StyleSheet.create({
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
});
