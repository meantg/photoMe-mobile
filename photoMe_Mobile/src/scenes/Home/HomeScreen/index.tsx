import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CardItem from "../../../components/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/redux/reducer";
import Axios from "axios";

function HomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("HomePage");
      console.log(user);
    });
    initNewfeed();
    return unsubscribe;
  }, [navigation]);

  async function getUser(){
	const token = await AsyncStorage.getItem("userToken");
	const url = "http://localhost:5000/api/user/"+ user.id;
  }

  async function initNewfeed() {
	const token = await AsyncStorage.getItem("userToken");
	console.log(token);
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const url = "http://localhost:5000/api/user/" + user.id + "/albums/all";
	const response = await Axios.get(url, config);
	if(response.status == 200){
		console.log(response.data);
	}
  }

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <CardItem style={styles.cardItem}></CardItem>
        <CardItem style={styles.cardItem}></CardItem>
        <CardItem style={styles.materialCard35}></CardItem>
        <CardItem style={styles.materialCard35}></CardItem>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  group: {},
  cardItem: {
    bottom: 64,
    marginTop: 15,
    marginBottom: 15,
  },
  materialCard35: {
    marginTop: 15,
  },
});

export default HomeScreen;
