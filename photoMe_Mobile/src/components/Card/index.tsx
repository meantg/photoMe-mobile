import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Slider from "../Slider/Slider";
import Comment from "./Comment";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONNECTION_STRING from "../../values/ConnectionString";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../services/redux/reducer";

let deviceWidth = Dimensions.get("window").width;

function CardItem({ album, HomeScreenCallBack }) {
  const navigation = useNavigation();
  const photos = album["photos"];
  const photographer = album["photographer"];
  const [likeColor, setLikeColor] = React.useState("grey");
  const [likeNumber, setLike] = React.useState(album.likesNumber);
  const [listCmt, setCmt] = React.useState([]);
  const [isCmt, setIsCmt] = React.useState(false);
  const user = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    getReviews();
    getLikes();
    console.log(album);
  }, []);

  const getReviews = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decode: any = jwt_decode(token);
      const url =
        "http://" +
        CONNECTION_STRING.string +
        "/api/review/" +
        album.id +
        "/paged?page=" +
        1 +
        "&size=" +
        2;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const res = Axios.get(url, config);
        if ((await res).status == 200) {
          const data = (await res).data;
          console.log(data);
          setCmt(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getLikes = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url =
        "http://" +
        CONNECTION_STRING.string +
        "/api/user/" +
        user.id +
        "/likes/" +
        album.id;
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = Axios.get(url, config);
        if ((await response).status == 200) {
          const data = (await response).data;
          if (data.makerId != null) {
            user.id === data.makerId
              ? setLikeColor("blue")
              : setLikeColor("grey");
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onPressLike = () => {
    if (likeColor == "blue") {
      setLikeColor("grey"), setLike(likeNumber - 1);
    } else {
      setLikeColor("blue"), setLike(likeNumber + 1);
    }
    likeAlbum(album.id);
  };

  const likeAlbum = async (albumID) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      var decoded: any = jwt_decode(token);
      const url =
        "http://" +
        CONNECTION_STRING.string +
        "/api/user/" +
        user.id +
        "/likes/like-album";
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const body = {
        AlbumId: albumID,
        MakerId: user.id,
      };
      try {
        const response = Axios.post(url, body, config);
        if ((await response).status == 200) {
          console.log("da like album" + album.title);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.cardItem1Style}>
        <View style={styles.headerStyle}>
          <Image
            source={require("../../images/iconapp.png")}
            style={styles.leftImage}
          ></Image>
          <View style={styles.headerContent}>
            <Text style={styles.textStyle}>
              {photographer.name} : {photographer.role}
            </Text>
            <Text style={styles.noteTextStyle}>
              {photographer.city} {photographer.country}
            </Text>
          </View>
        </View>
      </View>
      <Slider key={photos["id"]} photos={photos}></Slider>
      <View style={styles.likeBody}>
        <Text style={styles.like}>
          {likeNumber == 0
            ? "Chưa có ai thích album này "
            : likeNumber + " người đã thích"}
        </Text>
      </View>
      <View style={styles.actionBody}>
        <TouchableOpacity onPress={onPressLike} style={styles.actionButton1}>
          <AntDesign name="like1" size={20} color={likeColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton2}>
          <FontAwesome
            name="comments-o"
            size={20}
            color="black"
            onPress={() => {
              console.log("Comment Press");
              setIsCmt(true);
              HomeScreenCallBack(true);
              navigation.navigate("Comment", {
                listCmt: listCmt,
                album: album,
              });
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          <Text style={styles.like}>{photographer.username} </Text>
          {album.title}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.albumTypeText}>
          <Text>{album.albumType} </Text>
        </Text>
      </View>
      <Comment listCmt={listCmt}></Comment>
      <TouchableOpacity
        style={styles.loadMoreCmt}
        onPress={() => {
          navigation.navigate("Comment", { listCmt: listCmt, album: album });
        }}
      >
        <Text style={{ color: "grey" }}>Xem tat ca binh luan </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    width: deviceWidth,
    maxWidth: 700,
    minWidth: "100%",
    borderColor: "#CCC",
    flexWrap: "nowrap",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 15,
  },
  cardItem1Style: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 72,
  },
  headerStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  cardItemImagePlace: {
    backgroundColor: "#ccc",
    minHeight: 210,
    width: "100%",
    minWidth: 210,
    resizeMode: "cover",
  },
  likeBody: {
    fontWeight: "bold",
    paddingLeft: 14,
    paddingTop: 8,
  },

  like: {
    fontWeight: "bold",
    fontSize: 17,
  },
  actionBody: {
    marginBottom: -10,
    padding: 8,
    flexDirection: "row",
  },
  actionButton1: {
    padding: 8,
    height: 36,
  },
  actionText1: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9,
  },
  actionButton2: {
    padding: 8,
    height: 36,
    marginLeft: 8,
  },
  loadMoreCmt: {
    padding: 8,
    height: 36,
    marginLeft: 8,
    marginTop: -20,
  },
  actionText2: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9,
  },
  body: {
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 16,
  },
  bodyText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#424242",
  },
  albumTypeText: {
    marginTop: -10,
    lineHeight: 20,
    fontSize: 16,
    color: "#424242",
  },
});

export default CardItem;
