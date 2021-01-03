import React, { Component, useEffect } from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../../../services/redux/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as signalR from "@microsoft/signalr";
import CONNECTION_STRING from "../../../../values/ConnectionString";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function LoggingInPage({navigation} : any) {
	const isAnimating = React.useRef(false);
	const [iconSize, setIcon] = React.useState(new Animated.Value(100));
	const user = useSelector((state: RootState) => state.user);

	const startAnimation = () => {
		Animated.timing(iconSize, {
			useNativeDriver: false,
			toValue: 1200,
			duration: 1400,
			easing: Easing.back(0.5),
		}).start(() => isAnimating.current);
	};

	const awaitAnimation = async() =>{
		return new Promise((resolve) =>{
			setTimeout(()=>{resolve('result')},1050);
		})
	}

	const connectChatHub = async () => {
		const token = await AsyncStorage.getItem("userToken");
		if (token !== null) {
		  const connection = new signalR.HubConnectionBuilder()
			.withUrl("http://" + CONNECTION_STRING.string + "/chatsocket", {
			  accessTokenFactory: () => token,
			})
			.configureLogging(signalR.LogLevel.Information)
			.build();
	
		  connection.start().then(() => {
			console.log("connected");
		  });
		}
	  };

	useEffect(() => {
		connectChatHub();
		const loadScreen = async () => {
			startAnimation();
			const loading = await awaitAnimation();
			if(loading !== null){
				console.log("Login done!");
				navigation.navigate("𝓹𝓱𝓸𝓽𝓸𝓜𝓮");
			}
		}
		loadScreen();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#fff",
			}}
		>
			<AnimatedIcon
				name={"logo-instagram"}
				style={{
					textAlign: "center",
					fontSize: iconSize,
				}}
				color={"#e8a772"}
			/>
			<Text style={styles.loggingText}>Welcome {user.name} !</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loggingText: {
		fontSize: 20,
		fontStyle: "italic",
		fontWeight: "bold",
	},

	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
