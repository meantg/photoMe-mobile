import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RootState } from "../../services/redux/reducer";
import { useSelector, dispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import AlbumModel from "../../values/models/AlbumModel";
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";

type _Image = {
  localUri: string;
};

function UploadPage({ navigation }) {
  const [album, setAlbum] = React.useState<AlbumModel | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [selectedImage, setSelectedImage] = React.useState<_Image | null>(null);
  const [isUpload, setUpload] = React.useState(false);

  const [title, onChangeTitle] = React.useState(
    "What do you think about your picture ?"
  );
  const [albumType, onChangeDes] = React.useState("Describe your pic ");
  const [desHeight, setHeight] = React.useState(40);

  let openImage = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      return;
    } else if (!pickerResult.cancelled) {
      setSelectedImage({ localUri: pickerResult.uri });
    }
    console.log(pickerResult);
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

  const uploadImage = async () => {
    const token = await AsyncStorage.getItem("userToken");

    const data = new FormData();
    if (selectedImage?.localUri != null) {
      const image = DataURIToBlob(selectedImage?.localUri);
      data.append("Files", image, "test.png");
      data.append("Title", title);
      data.append("AlbumType", albumType);
    }

    const url =
      "http://10.0.2.2:5000/api/user/" + user.id + "/albums/upload-album";
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

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
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TextInput
          style={{
            width: "100%",
            height: desHeight,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImage}>
        <Text>Hello</Text>
      </TouchableOpacity>
      {/* <AssetsSelector
            options={{
                assetsType: ['photo', 'video'],
                noAssetsText: 'No media found.',
                maxSelections: 5,
                margin: 3,
                portraitCols: 4,
                landscapeCols: 5,
                widgetWidth: 100,
                widgetBgColor: '#23254',
                videoIcon: {
                    Component: Ionicons,
                    iconName: 'ios-videocam',
                    color: 'white',
                    size: 20,
                },
                selectedIcon: {
                    Component: Ionicons,
                    iconName: 'ios-checkmark-circle-outline',
                    color: 'white',
                    bg: '#ffffff50',
                    size: 22,
                },
                defaultTopNavigator: {
                    continueText: 'Finish',
                    goBackText: 'Back',
                    buttonBgColor: 'black',
                    buttonTextColor: '#ffffff50',
                    midTextColor: 'black',
                    backFunction: ()=>{ navigation.navigator("Home")},
                    doneFunction: ()=>{ navigation.navigator("Home")},
                },
                noAssets:{
                    Component:CustomNoAssetsComponent
                },
            }}
        /> */}
    </View>
  );
}

function CustomNoAssetsComponent(){
  return(
    <View>
      CustomNoAssetsComponent
    </View>
  )
}

const styles = StyleSheet.create({
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
  textStyle: {
    fontSize: 16,
    color: "#000",
    lineHeight: 20,
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
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    padding: 20,
  },

  uploadText: {
    color: "white",
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
