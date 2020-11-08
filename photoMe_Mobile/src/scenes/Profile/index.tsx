import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import TabAlbum from "../../components/TabAlbum";

function ProfilePage({ navigation }: any) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("ProfilePage");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
      <View style={styles.groupRow}>
        <Icon name="user-circle" style={styles.icon}></Icon>
        <View style={styles.meantg1Column}>
          <Text style={styles.meantg1}>Meantg</Text>
          <Text style={styles.photographer}>Photographer</Text>
          <Text style={styles.loremIpsum}>#hashtag #animals #love</Text>
        </View>
      </View>
      <View style={styles.personalInfo}>
        <Text style={styles.thongTinCaNhan}>THÔNG TIN CÁ NHÂN</Text>
        <Text style={styles.vịTri}>Vị trí :</Text>
        <Text style={styles.tuổi}>Tuổi :</Text>
        <Text style={styles.sdt}>SĐT :</Text>
        <Text style={styles.email}>Email :</Text>
      </View>
      </View>
      <TouchableOpacity style={[styles.btnContact]}>
        <Text style={styles.contactNow}>Contact Now</Text>
      </TouchableOpacity>
      <TabAlbum></TabAlbum>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer:{
    marginLeft: '15%'
  },
  btnContact: {
    maxWidth: 400,
    width: "80vw",
    height: 36,
    backgroundColor: "#e8a772",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },

  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 80,
  },
  contactNow: {
    color: "#fff",
    fontSize: 14,
    alignSelf: "center",
  },
  caption: {
    color: "rgba(60,61,72,1)",
    fontSize: 24,
  },
  meantg1: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 31,
  },
  photographer: {
    fontFamily: "roboto-italic",
    color: "#121212",
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "rgba(103,96,255,1)",
    marginTop: 2,
  },
  meantg1Column: {
    width: 158,
    marginLeft: 19,
    marginBottom: 6,
  },
  sRow: {
    height: 80,
    flexDirection: "row",
  },

  container: {
    backgroundColor: "#fff",
    flex: 1,
    overflow: "scroll",
  },
  group: {
    flexDirection: "row",
    overflow: "hidden",
  },
  s1: {
    height: 38,
    width: 106,
  },
  icon2: {
    color: "rgba(128,128,128,1)",
    fontSize: 29,
    marginLeft: 4,
    marginTop: 5,
  },
  s1Row: {
    height: 38,
    flexDirection: "row",
    flex: 1,
  },
  materialButtonTransparentHamburger1: {
    height: 36,
    width: 36,
    marginLeft: 70,
  },
  groupRow: {
    position: "relative",
    flexDirection: "row",
    marginTop: 16,
  },
  personalInfo: {
    flexWrap: "nowrap",
    justifyContent: "space-around",
    marginTop: 15,
  },
  thongTinCaNhan: {
    fontFamily: "roboto-700",
    color: "#121212",
    letterSpacing: 2,
    fontSize: 17,
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    margin: "null",
  },
  vịTri: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    margin: "null",
  },
  tuổi: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    margin: "null",
  },
  sdt: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    margin: "null",
  },
  email: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginRight: 0,
    marginLeft: 0,
    marginTop: 0,
    margin: "null",
  },
  materialButtonPrimary: {
    height: 36,
    width: 267,
    borderWidth: 0,
    borderColor: "rgba(233,135,135,1)",
    borderRadius: 19,
    backgroundColor: "rgba(242,119,93,1)",
    marginTop: 29,
    alignSelf: "center",
  },
  cupertinoSegmentWithIcons: {
    height: 56,
    width: 375,
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 5,
    shadowOpacity: 0.13,
    shadowRadius: 0,
    marginTop: 17,
  },
  albums: {
    width: 355,
    height: 341,
    marginTop: 20,
    marginLeft: 10,
  },
  group2: {
    width: 355,
    height: 110,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(236,231,231,1)",
    borderStyle: "solid",
    marginRight: 6,
    marginLeft: 6,
  },
  image3: {
    width: 110,
    height: 110,
    transform: [
      {
        rotate: "-90.00deg",
      },
    ],
    borderWidth: 1,
    borderColor: "rgba(244,239,239,1)",
    marginRight: 6,
    marginLeft: 6,
  },
  image2: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(238,233,233,1)",
    marginRight: 6,
    marginLeft: 6,
  },
  group3: {
    width: 355,
    height: 110,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  image4: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(236,231,231,1)",
    borderStyle: "solid",
    marginRight: 6,
    marginLeft: 6,
  },
  image5: {
    width: 110,
    height: 110,
    transform: [
      {
        rotate: "-90.00deg",
      },
    ],
    borderWidth: 1,
    borderColor: "rgba(244,239,239,1)",
    marginRight: 6,
    marginLeft: 6,
  },
  image6: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(238,233,233,1)",
    marginRight: 6,
    marginLeft: 6,
  },
  group4: {
    width: 355,
    height: 110,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 7,
  },
  image7: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(236,231,231,1)",
    borderStyle: "solid",
    marginRight: 6,
    marginLeft: 6,
  },
  image8: {
    width: 110,
    height: 110,
    transform: [
      {
        rotate: "-90.00deg",
      },
    ],
    borderWidth: 1,
    borderColor: "rgba(244,239,239,1)",
    marginRight: 6,
    marginLeft: 6,
  },
  image9: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "rgba(238,233,233,1)",
    marginRight: 6,
    marginLeft: 6,
  },
});

export default ProfilePage;
