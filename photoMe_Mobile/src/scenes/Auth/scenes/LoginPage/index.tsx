import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Animated,
  Easing,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import UserModel from "../../../../values/models/UserModel";
import { setUser } from "../../../../services/redux/slices/userSlices";
import { RootState } from "../../../../services/redux/reducer";
import CONNECTION_STRING from "../../../../values/ConnectionString";

let deviceWidth = Dimensions.get("window").width;

export default function LoginPage({ navigation }: any) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("LoginPage");
    });

    return unsubscribe;
  }, [navigation]);

  const login = async () => {
    console.log("log in");

    if (email === "" || password === "") {
      Alert.alert(
        "Login Form not completed",
        "Please fill email & password !",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      const url = "http://" + CONNECTION_STRING.string + "/api/auth/Login";
      const data = { userName: email, password: password };
      const config = {
        headers: {
          "Content-type": "Application/json",
        },
      };
      try {
        console.log("call api");

        const response = await axios.post(url, data, config);
        if (response.status == 200) {
          const token = response.data.token;
          await AsyncStorage.setItem("userToken", token);
          const userModel: UserModel = response.data.user;
          dispatch(setUser(userModel));
          navigation.navigate("Loading");
        }
      } catch (err) {
        console.error(err);

        Alert.alert(
          "Email or Password is incorrect",
          "Please enter correct email and password !",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>𝓹𝓱𝓸𝓽𝓸𝓜𝓮</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(text: any) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry={true}
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text: any) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <Text
        style={styles.signUp}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have account? Register now{" "}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: deviceWidth / 10,
    marginBottom: 40,
    letterSpacing: 5,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#e8a772",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    padding: 15,
  },

  loginText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
  },

  signUp: {
    marginTop: 10,
    color: "#4a88d4",
    fontSize: 15,
  },

  inputText: {
    height: 50,
    color: "black",
  },

  inputView: {
    width: "80%",
    backgroundColor: "#fffae3",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#f5ebbf",
    alignItems: "center",
    justifyContent: "center",
  },
});
