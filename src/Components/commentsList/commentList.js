import React, { useState, useEffect } from "react";
import { View, Text, Alert, Image } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { height, padding, width } from "../../Utils/constants/styles";
import { PhotogramText } from "../Text/PhotoGramText";
import auth from "@react-native-firebase/auth";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Navigation } from "react-native-navigation";

export default function CommentList({ item, props, params }) {
  const [userData, setUserData] = useState();
  const [liked, setLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(false);
  const [visible, setVisible] = useState(false);

  const getUser = async () => {
    await firestore()
      .collection("users")
      .doc(item.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, []);
  };

  let likeComment = (id) => {
    try {
      disLiked
        ? firestore()
            .collection("Posts")
            .doc(params)
            .collection("comments")
            .doc(id)
            .update({
              disLikes: firestore.FieldValue.arrayRemove(
                auth().currentUser.uid
              ),
            })
            .then(() => {
              firestore()
                .collection("Posts")
                .doc(params)
                .collection("comments")
                .doc(id)
                .update({
                  likes: !liked
                    ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                    : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                });
            })
        : firestore()
            .collection("Posts")
            .doc(params)
            .collection("comments")
            .doc(id)
            .update({
              likes: !liked
                ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
            });
    } catch (err) {
      console.log(err);
    }
  };

  let disLikeComment = (id) => {
    try {
      liked
        ? firestore()
            .collection("Posts")
            .doc(params)
            .collection("comments")
            .doc(id)
            .update({
              likes: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
            })
            .then(() => {
              firestore()
                .collection("Posts")
                .doc(params)
                .collection("comments")
                .doc(id)
                .update({
                  disLikes: !disLiked
                    ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                    : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                });
            })
        : firestore()
            .collection("Posts")
            .doc(params)
            .collection("comments")
            .doc(id)
            .update({
              disLikes: !disLiked
                ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
            });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    if (item.likes.indexOf(auth().currentUser.uid) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    if (item.disLikes.indexOf(auth().currentUser.uid) > -1) {
      setDisLiked(true);
    } else {
      setDisLiked(false);
    }
  }, [disLiked, liked]);

  let likeIcon = liked ? "like1" : "like2";
  let disLikeIcon = disLiked ? "dislike1" : "dislike2";
  let likeIconColor = liked === true ? "#000" : "#333";
  let dislikeColor = disLiked === true ? "#000" : "#333";

  return (
    <View style={{ backgroundColor: "#FFF" }}>
      <View style={{ borderBottomColor: "#333", borderBottomWidth: 0.5 }} />
      <View style={{ flexDirection: "column", marginVertical: padding - 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              width: 50,
              borderRadius: 55,
              padding,
              height: 50,
              marginLeft: 12,
            }}
            source={{
              uri: userData
                ? userData.userImg
                  ? userData.userImg
                  : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png"
                : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png",
            }}
          />
          <View>
            <PhotogramText
              text={userData ? "@" + userData.userName : "Test"}
              fontWeight={"h1"}
              fontSize={14}
              extraStyles={{ marginLeft: padding - 10 }}
            />
            <TouchableOpacity onPress={() => setVisible(true)}>
              <PhotogramText
                numberOfLines={31}
                extraStyles={{ marginLeft: 24, marginRight: width / 3.5 }}
                text={item.commentText}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => likeComment(item.id)}>
                <AntDesign
                  name={likeIcon}
                  style={{ marginLeft: 24, marginVertical: 8 }}
                  color={likeIconColor}
                  size={24}
                />
              </TouchableOpacity>
              <Text style={{ fontWeight: "bold", marginLeft: 6 }}>
                {item.likes.length}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => disLikeComment(item.id)}>
                <AntDesign
                  name={disLikeIcon}
                  style={{ marginVertical: 8, marginLeft: 24 }}
                  size={24}
                  color={dislikeColor}
                />
              </TouchableOpacity>
              <Text style={{ fontWeight: "bold", marginLeft: 6 }}>
                {item.disLikes.length}
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="comment"
            onPress={() =>
              Navigation.push(props.componentId, {
                component: {
                  name: "REPLIES_SCREEN",
                  id: "REPLIES_SCREEN",
                  passProps: {
                    userData,
                    item,
                  },
                },
              })
            }
            style={{
              marginHorizontal: 24,
              marginVertical: 8,
            }}
            size={24}
            color="black"
          />
        </View>
      </View>
      <Modal visible={visible} animationType="fade">
        <View
          style={{
            padding: padding - 14,
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: "#ffff",
            shadowColor: "#000",
            elevation: 8,
          }}
        >
          <TouchableOpacity onPress={() => setVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <PhotogramText
            fontSize={18}
            fontWeight={"h1"}
            text={`Commented By ${userData ? userData.userName : "Test"}`}
          />
          {/* <Text>{}</Text> */}
        </View>
        <Image
          style={{
            width: 50,
            borderRadius: 55,
            padding,
            height: 50,
            marginLeft: 12,
          }}
          source={{
            uri: userData
              ? userData.userImg.length !== 0
                ? userData.userImg
                : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png"
              : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png",
          }}
        />
        <PhotogramText
          text={userData ? "@" + userData.userName : "Test"}
          fontWeight={"h1"}
          fontSize={14}
          extraStyles={{ marginLeft: padding - 10 }}
        />
        <PhotogramText
          numberOfLines={30}
          extraStyles={{ marginHorizontal: padding }}
          text={item.commentText}
        />
      </Modal>
    </View>
  );
}
