import moment from "moment";
import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Icon from "@expo/vector-icons";

export default function RegisterPage({ navigation }: any) {
  React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  console.log('RegisterPage');
		});
	
		return unsubscribe;
    }, [navigation]);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setrePassword] = React.useState("");
  const time = useRef(moment().format().substring(0, 19));

  const register = async () => {
    console.log("register");
    if (password !== rePassword) {
      Alert.alert(
        "Password & rePassword not the same",
        "Please enter again !",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      fetch("http://10.0.2.2:5000/api/auth/Register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
          rePassword: rePassword,
          created: time.current,
        }),
      })
        .then((res) => {
          if (res.status == 201) {
            console.log("RegisterDone");
            Alert.alert(
              "Register DONE !",
              "Now you can use your account. Thanks for register",
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("OK Pressed");
                    navigation.navigate("LoginPage");
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            Alert.alert(
              "Email or Password is incorrect",
              "Please enter correct email and password !",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.iconApp}
        source={require("../../../../images/iconapp.png")}
      ></Image>
      <Text style={styles.appName}>𝓹𝓱𝓸𝓽𝓸𝓜𝓮</Text>
      <Text style={styles.text}>Join us NOW !</Text>
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
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry={true}
          style={styles.inputText}
          placeholder="Re-Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text: any) => setrePassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.registerBtn} onPress={register}>
        <Text style={styles.registerText}>REGISTER NOW</Text>
      </TouchableOpacity>
      <Text style={styles.hintText}>
        *Fill all the field to finish Register
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
          width: 150,
          position: "absolute",
          top: 40,
          left: 10,
          height: 30,
          backgroundColor: "#60d680",
          borderRadius: 30,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: 'bold' }}> Back to Login </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 40,
    letterSpacing: 5,
    marginTop: -20,
  },

  hintText: {
    color: "#c74a44",
  },

  registerBtn: {
    width: "80%",
    backgroundColor: "#e8a772",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
  },

  registerText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
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

  text: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 20,
  },

  iconApp: {
    display: "flex",
  },

  container: {
    flex: 1,
    backgroundColor: "#f5ebbf",
    alignItems: "center",
    justifyContent: "center",
  },
});
