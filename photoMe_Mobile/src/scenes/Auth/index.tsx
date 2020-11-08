import React from "react";
import {  Dimensions, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-community/async-storage";
import LoginPage from "./scenes/LoginPage";
import LoggingInPage from "../Home/HomePage/Loading";
import RegisterPage from "./scenes/RegisterPage";

const Stack = createStackNavigator();
let deviceWidth = Dimensions.get('window').width;

export default function AuthPage() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e8a772",
    padding: 10
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
