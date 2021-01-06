import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CONNECTION_STRING from "../../../../values/ConnectionString";
import { RootState } from "../../.../../../../services/redux/reducer";
import { useSelector } from "react-redux";
import Axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function UploadMultiple({ route, navigation }) {
  const user = useSelector((state: RootState) => state.user);
  const [album, setAlbum] = React.useState([]);
  const [desHeight, setHeight] = React.useState(80);
  const [albumType, onChangeDes] = React.useState("Describe your pic ");
  const [title, onChangeTitle] = React.useState(
    "What do you think about your picture ?"
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Upload Multiple");
      setAlbum(route.params.albums);
    });
  }, []);

  const uploadImage = async () => {
    const token = await AsyncStorage.getItem("userToken");

    const data = new FormData();
    console.log(album);
    const files: any = album;
    album.map((img) => {
      data.append("Files", img);
    });

    data.append("Title", title);
    data.append("AlbumType", albumType);
    console.log(data);

    const url =
      CONNECTION_STRING.string + "user/" + user.id + "/albums/upload-album";
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const res = Axios.post(url, data, config);
      if ((await res).status == 201) {
        console.log("Upload Multiple Success");
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (album && album.length) {
    return (
      <View style={{ display: "flex", width: "100%", height: "100%" }}>
        <ScrollView
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={true}
          indicatorStyle="white"
          style={{ height: "100%" }}
        >
          {album.map((image, index) => (
            <View key={index} style={{}}>
              <Image
                style={{ width: windowWidth, height: 300 }}
                resizeMode="contain"
                source={{ uri: image["uri"] }}
              />
            </View>
          ))}
        </ScrollView>
        <TextInput
          style={{
            width: "100%",
            height: 40,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "black",
            marginLeft: 2,
          }}
          onChangeText={(text) => onChangeTitle(text)}
          maxLength={80}
          value={title}
        />
        <TextInput
          style={{
            width: "100%",
            height: 100,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "black",
            marginLeft: 2,
          }}
          onContentSizeChange={(event) => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
          maxLength={120}
          onChangeText={(text) => onChangeDes(text)}
          multiline={true}
          value={albumType}
        />
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
          <Text style={styles.uploadText}>UPLOAD</Text>
          <AntDesign name="upload" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  uploadText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 5,
  },
  uploadBtn: {
    width: "80%",
    backgroundColor: "#e8a772",
    display: "flex",
    flexDirection: "row",
    borderRadius: 25,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 40,
    position: "absolute",
    bottom: 5,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UploadMultiple;
