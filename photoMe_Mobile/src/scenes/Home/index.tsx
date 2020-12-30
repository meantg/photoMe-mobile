import { createStackNavigator, Header } from "@react-navigation/stack";
import React from "react";
import { View, Text, Button } from "react-native";
import ProfilePage from "../Profile";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./HomeScreen";
import UploadPage from "../Upload";
import NewProfile from "../Profile/profile";
import CommentScreen from "./HomeScreen/CommentScreen";

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();

export default function HomePage() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      shifting={true}
      activeColor="#000"
      inactiveColor="#e2dada"
      sceneAnimationEnabled={true}
      barStyle={{ backgroundColor: "#e8a772", display: "flex" }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      >
        {() => (
          <HomeStack.Navigator
            mode="modal"
            screenOptions={{
              headerShown: true,
            }}
          >
            <HomeStack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <HomeStack.Screen
              name="Comment"
              component={CommentScreen}
              options={{ headerShown: false, headerStyle: { height: 40 } }}
            />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-search-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadPage}
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircleo" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={NewProfile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function SearchScreen() {
  return (
    <View>
      <Text>SearchScreen</Text>
    </View>
  );
}
