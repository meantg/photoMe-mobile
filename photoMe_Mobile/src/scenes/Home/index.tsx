import { createStackNavigator, Header } from "@react-navigation/stack";
import React from "react";
import { View, Text, Button } from "react-native";
import ProfilePage from "../Profile";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./HomeScreen";

const Tab = createMaterialBottomTabNavigator();

export default function HomePage() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			shifting={true}
			activeColor="#000"
			inactiveColor="#fff"
			sceneAnimationEnabled={true}
			barStyle={{ backgroundColor: "#e8a772" }}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="home" color={color} size={26} />
					),
				}}
			/>
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
				name="Inbox"
				component={ProfilePage}
				options={{
					tabBarLabel: "Inbox",
					tabBarIcon: ({ color }) => (
						<FontAwesome5 name="inbox" size={26} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfilePage}
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
