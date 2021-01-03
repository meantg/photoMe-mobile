import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  TouchableHighlight,
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RootState } from "../../services/redux/reducer";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import AlbumModel from "../../values/models/AlbumModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import CONNECTION_STRING from "../../values/ConnectionString";
import { ImageBrowser } from "expo-image-picker-multiple";
import * as Permissions from "expo-permissions";
import { createStackNavigator } from "@react-navigation/stack";

const Upload = createStackNavigator();

type _Image = {
  localUri: string;
};

const Stack = createStackNavigator();

function UploadPage({ navigation }) {
  const [album, setAlbum] = React.useState<AlbumModel | null>(null);
  const [askModal, setModalVisible] = React.useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [selectedImage, setSelectedImage] = React.useState<_Image | null>(null);
  const [isUpload, setUpload] = React.useState(false);
  const [showImagePicker, setShowImagePicker] = React.useState(false);

  const [title, onChangeTitle] = React.useState(
    "What do you think about your picture ?"
  );
  const [albumType, onChangeDes] = React.useState("Describe your pic ");
  const [desHeight, setHeight] = React.useState(80);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Upload Page");
      setSelectedImage(null);
    });
  }, []);

  const getPermissionAsync = async () => {
    if (Platform.OS == "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  let openImage = async () => {
    getPermissionAsync();
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (pickerResult.cancelled == true) {
      return;
    } else if (!pickerResult.cancelled) {
      console.log(pickerResult.uri);
      if (Platform.OS == "web") {
        setSelectedImage({ localUri: pickerResult.uri });
        console.log(pickerResult.uri);
      } else {
        setSelectedImage({ localUri: pickerResult.uri });
      }
    }
  };

  function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const takeImage = async () => {
    if (Platform.OS == "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }

    let permissionResult = await ImagePicker.getCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (pickerResult.cancelled == true) {
      return;
    } else if (!pickerResult.cancelled) {
      console.log(pickerResult.uri);
      if (Platform.OS == "web") {
        setSelectedImage({ localUri: pickerResult.uri });
        console.log(pickerResult.uri);
      } else {
        setSelectedImage({ localUri: pickerResult.uri });
      }
    }
  };

  const uploadImage = async () => {
    const token = await AsyncStorage.getItem("userToken");

    const data = new FormData();
    if (selectedImage?.localUri != null) {
      // const image = DataURIToBlob(selectedImage.localUri);
      if (Platform.OS == "web") {
        const image = DataURIToBlob(selectedImage.localUri);
        data.append("Files", image);
      } else {
        let localUri = selectedImage.localUri;
        let filename = localUri.split("/").pop();
        if (filename != null) {
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          const source: any = { uri: localUri, type: type, name: filename };
          data.append("Files", source);
        }
        console.log("blog");
      }
      data.append("Title", title);
      data.append("AlbumType", albumType);
    }

    const url =
      "http://" +
      CONNECTION_STRING.string +
      "/api/user/" +
      user.id +
      "/albums/upload-album";
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log(data);

    try {
      const response = Axios.post(url, data, config);
      console.log((await response).status);
      if ((await response).status == 201) console.log("Upload success");
      navigation.navigate("Home");
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    }
    setUpload(true);
  };

  if (selectedImage !== null) {
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={110}
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "white",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.cardItem1Style}>
            <View style={styles.headerStyle}>
              <Image
                source={require("../../images/iconapp.png")}
                style={styles.leftImage}
              ></Image>
              <View style={styles.headerContent}>
                <Text style={styles.textStyle}>{user.name}</Text>
                <Text style={styles.noteTextStyle}>
                  {user.city} {user.country}
                </Text>
              </View>
            </View>
          </View>
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
          <Image
            source={{
              uri: selectedImage.localUri,
            }}
            style={styles.thumbnail}
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
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
          <Text style={styles.uploadText}>UPLOAD</Text>
          <AntDesign name="upload" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  } else {
    const onPress = () =>
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Single Image", "Multiple Image"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            openImage();
          } else if (buttonIndex === 2) {
            navigation.navigate("MultipleImage");
          }
        }
      );

    return (
      <View style={styles.container1}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require("../../images/gallery.png")}
            style={{ width: 150, height: 150, alignSelf: "center" }}
          ></Image>
          <Text
            style={{
              fontSize: 30,
              color: "black",
              letterSpacing: 2,
              fontWeight: "600",
            }}
          >
            From Gallery
          </Text>
          <Text style={{ alignSelf: "center", letterSpacing: 1 }}>
            Upload from your mobile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takeImage}>
          <Image
            source={require("../../images/opencamera.png")}
            style={{
              width: 150,
              height: 150,
              marginTop: 35,
              alignSelf: "center",
            }}
          ></Image>
          <Text
            style={{
              fontSize: 30,
              color: "black",
              letterSpacing: 2,
              fontWeight: "600",
            }}
          >
            From Camera
          </Text>
          <Text style={{ alignSelf: "center", letterSpacing: 1 }}>
            Upload your shoots
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    display: "flex",
    flexDirection: "row",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  leftImage: {
    height: 40,
    width: 40,
    backgroundColor: "#CCC",
    borderRadius: 20,
  },
  headerContent: {
    paddingLeft: 16,
    justifyContent: "center",
  },
  noteTextStyle: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    opacity: 0.5,
  },
  headerStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardItem1Style: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
    height: 72,
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

  uploadText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 5,
  },
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container1: {
    justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  thumbnail: {
    marginTop: 10,
    marginBottom: 5,
    width: "100%",
    height: 300,
    resizeMode: "cover",
    backgroundColor: "#854379",
  },
  touch: {},
  emptyStay: {
    textAlign: "center",
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
});
export default UploadPage;
