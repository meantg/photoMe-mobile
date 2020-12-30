import React from "react";
import {
  AsyncStorage,
  Button,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import LoginPage from "./src/scenes/Auth/scenes/LoginPage";
import RegisterPage from "./src/scenes/Auth/scenes/RegisterPage";
import LoggingInPage from "./src/scenes/Home/HomePage/Loading";
import HomePage from "./src/scenes/Home/index";
import { Entypo, Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import store from "./src/services/redux/store";
import { Provider } from "react-redux";
import { decode, encode } from "base-64";
import { TouchableOpacity } from "react-native-gesture-handler";

const globalAny: any = global;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();
let deviceWidth = Dimensions.get("window").width;

export default function App() {
  const [userToken, setToken] = React.useState<string | null>(null);
  const [loggedIn, setLogin] = React.useState(false);

  async function getUserToken() {
    const token = await AsyncStorage?.getItem("userToken");
    console.log(token);
    // if (token !== null) {
    //   console.log("setLogin");
    //   setLogin(true);
    // }
  }

  React.useEffect(() => {
    getUserToken();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {!loggedIn ? (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Login"
          >
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Loading" component={LoggingInPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen
              name="𝓹𝓱𝓸𝓽𝓸𝓜𝓮"
              component={HomePage}
              options={{
                headerStyle: {
                  backgroundColor: "#e8a772",
                },
                headerTitleStyle: {
                  alignSelf: "center",
                  fontSize: deviceWidth / 14,
                  marginBottom: 10,
                },
                headerShown: true,
                headerBackTitleVisible: true,
                headerLeft: () => <ToHome  />,
                headerRight: () => <HeaderBackButton label="Logout"  />
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="𝓹𝓱𝓸𝓽𝓸𝓜𝓮">
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen
              name="𝓹𝓱𝓸𝓽𝓸𝓜𝓮"
              component={HomePage}
              options={{
                headerStyle: {
                  backgroundColor: "#e8a772",
                },
                headerTitleStyle: {
                  alignSelf: "center",
                  fontSize: deviceWidth / 13,
                  marginBottom: 10,
                },
                headerShown: true,
                headerBackTitleVisible: true,
                // headerLeft: () => <ToHome />,
                // headerRight: () => <ToSettings />,
                headerBackTitle: "Back"
              }}
            />
            <Stack.Screen name="ImgPicker" component={ImgPicker} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
}

function ToHome() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => {
            console.log("Logout");
          }}>
        <Entypo
          name="home"
          size={26}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

function ImgPicker() {
  return <View style={styles.header}>Hello</View>;
}

function ToSettings() {
  return (
    <View style={styles.header}>
      <Foundation name="list" size={26} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e8a772",
    padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
