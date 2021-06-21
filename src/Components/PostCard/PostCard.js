import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import auth from "@react-native-firebase/auth";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import { padding, width, height } from "../../Utils/constants/styles";
import { Card } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { PhotogramText } from "../Text/PhotoGramText";
import { TapGestureHandler } from "react-native-gesture-handler";

function PostCard({ item, navigation, onDelete, scale }) {
  const [userData, setUserData] = useState();
  const [likes, setLikes] = useState();
  const [favorited, setfavorited] = useState(false);
  const [liked, setLiked] = useState();
  const DoublePress = useRef();
  const [comments, setComments] = useState();

  const getUser = async () => {
    firestore()
      .collection("users")
      .doc(item.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    if (item.favorited.indexOf(auth().currentUser.uid) > -1) {
      setfavorited(true);
    } else {
      setfavorited(false);
    }
  }, [favorited, item]);

  useEffect(() => {
    getUser();
    getAllComments();
    if (item.likes.indexOf(auth().currentUser.uid) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    setLikes(item.likes.length);
    return () => null;
  }, [likes, liked, favorited, item]);

  const setUpdates = (postId) => {
    try {
      firestore()
        .collection("Posts")
        .doc(postId)
        .update({
          likes: !liked
            ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
            : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        });
    } catch (e) {
      console.log(e);
    }
  };

  let AddAsfavorited = (postId) => {
    try {
      firestore()
        .collection("Posts")
        .doc(postId)
        .update({
          favorited: !favorited
            ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
            : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
        });
    } catch (error) {}
  };

  let getAllComments = () => {
    firestore()
      .collection("Posts")
      .doc(item.id)
      .collection("comments")
      .onSnapshot((data) => {
        const Allcomments = data.docs.map((doc) => {
          const id = doc.id;
          return { id };
        });
        setComments(Allcomments.length);
      });
  };

  let likeIcon = liked ? "like1" : "like2";
  let FavoritedIconColor = favorited ? "#D6453A" : "#333";
  let FavoritedIcon = favorited ? "heart" : "hearto";
  let likeIconColor = liked === true ? "#000" : "#333";

  return (
    <TapGestureHandler numberOfTaps={2} ref={DoublePress} maxDelayMs={200} onHandlerStateChange={() => AddAsfavorited()}>
      <View
        style={{
          width,
          marginVertical: 20,
          alignSelf: "center",
          borderRadius: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            elevation: 8,
            marginHorizontal: 18,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeProfile", item)}
            style={{ flexDirection: "row" }}
          >
            <Image
              style={{
                width: width / 7,
                margin: padding - 4,
                borderRadius: 75,
                height: width / 7,
              }}
              source={{
                uri: userData
                  ? userData.userImg ||
                    "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png"
                  : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png",
              }}
            />
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "8%",
                color: "#000",
                fontWeight: "bold",
                fontSize: padding - 8,
              }}
            >
              {userData ? userData.userName : "Test"}
            </Text>
          </TouchableOpacity>
          <Text style={{ position: "absolute", top: height/14, left: "27%" }}>
            {moment(item.createdAt.toDate()).fromNow()}
          </Text>
          <Card.Divider />
          <Text
            style={{
              fontSize: padding - 6,
              marginBottom: 16,
              marginHorizontal: 24,
            }}
          >
            {item.postText}
          </Text>
          <Image
            resizeMode="cover"
            source={{ uri: item.image }}
            style={{
              width: item.image ? width - 42 : 0,
              alignSelf: "center",
              height: item.image ? height / 2.7 : 0,
            }}
          />
          <View>
            {auth().currentUser.uid === item.uid ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={32}
                    color="black"
                    style={{ marginVertical: padding - 4, marginLeft: 42 }}
                    onPress={() => {
                      navigation.navigate("Comments", {
                        docId: item.id,
                      });
                    }}
                  />
                  <PhotogramText
                    text={comments}
                    fontWeight={"h1"}
                    fontSize={22}
                    extraStyles={{ marginTop: padding - 2, marginLeft: 6 }}
                  />
                </View>
                <AntDesign
                  name="delete"
                  style={{
                    marginBottom: 15,
                    marginTop: 12,
                    marginHorizontal: 24,
                  }}
                  onPress={() => onDelete(item.id)}
                  size={32}
                  color="black"
                />
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-end",
                    top: 0,
                    position: "absolute",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={liked ? 0 : 0}
                    onPress={() => setUpdates(item.id)}
                  >
                    <AntDesign
                      name={likeIcon}
                      size={32}
                      color={likeIconColor}
                      style={{
                        marginHorizontal: 42,
                        marginVertical: padding - 4,
                      }}
                    />
                    <PhotogramText
                      fontSize={22}
                      text={likes}
                      fontWeight={"h1"}
                      extraStyles={{
                        position: "absolute",
                        right: 24,
                        top: -46,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginTop: padding - 3,
                      marginLeft: 6,
                    }}
                    activeOpacity={favorited ? 0.1 : 0}
                    onPress={() => AddAsfavorited(item.id)}
                  >
                    <AntDesign
                      name={FavoritedIcon}
                      size={32}
                      color={FavoritedIconColor}
                      style={{ marginLeft: 24 }}
                    />
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="comment-text-outline"
                      size={32}
                      color="black"
                      style={{ marginVertical: padding - 4, marginLeft: 32 }}
                      onPress={() => {
                        navigation.navigate("Comments", {
                          docId: item.id,
                        });
                      }}
                    />
                    <PhotogramText
                      text={comments}
                      fontWeight={"h1"}
                      fontSize={22}
                      extraStyles={{ marginTop: padding - 2, marginLeft: 6 }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </TapGestureHandler>
  );
}
export default PostCard;
