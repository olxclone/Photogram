import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  Alert,
  Button,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { height, padding, width } from "../../Utils/constants/styles";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import { Tab } from "../../Components/customTab/Tab";
import { Transitioning, Transition } from "react-native-reanimated";
import ProfileHeader from "../../Components/headers/ProfileHeader";

function Profile({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(0);
  const [following, setFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState();
  const _isMounted = React.useRef(true);

  const handleDelete = (postId) => {
    Alert.alert(
      "Delete post",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed!"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => deletePost(postId),
        },
      ],
      { cancelable: false }
    );
  };

  const fetchChatUser = async () => {
    await firestore()
      .collection("users")
      .doc(route.params.uid)
      .onSnapshot((data) => {
        setChatUser(data.data());
      });
  };

  const deletePost = (postId) => {
    firestore()
      .collection("Posts")
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        _isMounted.current = true;
        if (documentSnapshot.exists) {
          const { image } = documentSnapshot.data();
          if (image !== null) {
            const storageRef = storage().refFromURL(image);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
              .delete()
              .then(() => {
                deleteFirestoreData(postId);
              })
              .catch((e) => {
                console.log("Error while deleting the image. ", e);
              });
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = (postId) => {
    firestore()
      .collection("posts")
      .doc(postId)
      .delete()
      .then(() => {
        console.log(postId);
        Alert.alert(
          "Post deleted!",
          "Your post has been deleted successfully!"
        );
        setDeleted(true);
      })
      .catch((e) => console.log("Error deleting post.", e));
  };

  const onFollow = () => {
    try {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          following: firestore.FieldValue.arrayUnion(route.params.uid),
        })
        .then(() => {
          firestore()
            .collection("users")
            .doc(route.params ? route.params.uid : "")
            .update({
              followers: firestore.FieldValue.arrayUnion(
                auth().currentUser.uid
              ),
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onUnFollow = () => {
    try {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          following: firestore.FieldValue.arrayRemove(route.params.uid),
        })
        .then(() => {
          firestore()
            .collection("users")
            .doc(route.params ? route.params.uid : "")
            .update({
              followers: firestore.FieldValue.arrayRemove(
                auth().currentUser.uid
              ),
            });
        })
        .then(setFollowing(false));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection("Posts")
        .where(
          "uid",
          "==",
          route.params ? route.params.uid : auth().currentUser.uid
        )
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              uid,
              displayName,
              postText,
              image,
              createdAt,
              userImage,
              following,
              followers,
            } = doc.data();
            list.push({
              uid,
              followers,
              following,
              id: doc.id,
              displayName,
              postText,
              image,
              createdAt,
              userImage,
            });
          });
        });

      setPosts(list);
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const selectTab = (tabIndex) => {
    ref.current.animateNextTransition();
    setIsSelected(tabIndex);
  };

  const getUser = async () => {
    await firestore()
      .collection("users")
      .doc(route.params ? route.params.uid : auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  const getCurrentUser = async () => {
    await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setCurrentUser(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getCurrentUser();
    fetchChatUser();
  }, [currentUser]);

  useEffect(() => {
    ref.current.animateNextTransition();
    getUser();
    fetchPosts();
    if (
      currentUser
        ? currentUser.following.indexOf(
            route.params ? route.params.uid : null
          ) > -1
        : "7KCwD3cW1CW8ehN5r8Oa0ykkxIz2"
    ) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [following]);

  let ref = React.createRef();

  const transition = (
    <Transition.Together>
      <Transition.In
        type="slide-right"
        durationMs={5000}
        interpolation={"easeInOut"}
      />
      <Transition.In type="fade" durationMs={5000} />
      <Transition.Change />
    </Transition.Together>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileHeader
        navigation={navigation}
        userName={userData ? userData.userName : "Test"}
      />
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg !== ""
                ? userData.userImg
                : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png"
              : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png",
            // uri : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
          }}
        />
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>
              {userData ? userData.followers.length : 0}
            </Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Following",
                  route.params ? userData : currentUser
                )
              }
            >
              <Text style={styles.userInfoTitle}>
                {!route.params
                  ? currentUser
                    ? currentUser.following.length
                    : 1
                  : userData
                  ? userData.following.length
                  : null}
              </Text>
              <Text style={styles.userInfoSubTitle}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.userName}>
        {userData ? userData.userName || "Test" : "Test"}
      </Text>
      <Text style={styles.aboutUser}>
        {userData ? userData.bio || "No details added." : ""}
      </Text>
      {route.params ? (
        route.params.uid === auth().currentUser.uid ? (
          <PhotoGramButton
            backgroundColor={"#fff"}
            color={"#000"}
            fontWeight={"h1"}
            title={"Edit Profile"}
            padding={10}
            extraStyles={{
              shadowColor: "#222",
              elevation: 8,
              marginHorizontal: 12,
            }}
            onPress={() => navigation.navigate("EditScreen")}
          />
        ) : (
          <>
            {following ? (
              <PhotoGramButton
                title={"Following"}
                backgroundColor={"#fff"}
                color={"#000"}
                fontWeight={"h1"}
                padding={10}
                extraStyles={{
                  shadowColor: "#222",
                  elevation: 8,
                  marginHorizontal: 12,
                  marginVertical: 2,
                }}
                onPress={() => onUnFollow()}
              />
            ) : (
              <PhotoGramButton
                title={"Follow"}
                backgroundColor={"#fff"}
                color={"#000"}
                fontWeight={"h1"}
                padding={10}
                extraStyles={{
                  shadowColor: "#222",
                  elevation: 8,
                  marginHorizontal: 12,
                  marginVertical: 2,
                }}
                onPress={() => onFollow()}
              />
            )}

            <PhotoGramButton
              title={"Message"}
              backgroundColor={"#fff"}
              color={"#000"}
              fontWeight={"h1"}
              padding={10}
              extraStyles={{
                shadowColor: "#222",
                elevation: 6,
                marginHorizontal: 12,
                marginVertical: 12,
              }}
              onPress={() => navigation.navigate("ChatRoom", chatUser)}
            />
          </>
        )
      ) : (
        <>
          <PhotoGramButton
            title={"Edit Profile"}
            padding={10}
            onPress={() => navigation.navigate("EditScreen")}
            backgroundColor={"#fff"}
            fontWeight={"h1"}
            color={"#000"}
            extraStyles={{
              shadowColor: "#222",
              elevation: 6,
              width: width - 20,
              alignSelf: "center",
            }}
          />
        </>
      )}

      <ScrollView scrollEventThrottle={70} showsVerticalScrollIndicator={false}>
        <Transitioning.View
          ref={ref}
          transition={transition}
          style={{
            overflow: "hidden",
            marginTop: padding - 12,
            left: isSelected === 0 ? 0 : null,
            right: isSelected === 1 ? 0 : null,
            borderTopLeftRadius: isSelected === 0 ? 70 : null,
            borderBottomLeftRadius: isSelected === 0 ? 70 : null,
            borderTopRightRadius: isSelected === 1 ? 70 : null,
            borderBottomRightRadius: isSelected === 1 ? 70 : null,
            flex: 1,
            marginRight: 12,
            marginLeft: 12,
            borderBottomColor: "#000",
            borderBottomWidth: 0.7,
            alignSelf: "center",
            width: width / 2,
            padding,
            position: "absolute",
          }}
        />
        <View
          style={{
            position: "absolute",
            zIndex: 1000,
            borderTopColor: "#000",
            borderTopWidth: 0.7,
          }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={() => selectTab(0)}>
            <Tab
              icon={"md-grid"}
              isSelected={isSelected === 0 ? true : false}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => selectTab(1)}>
            <Tab icon={"people"} isSelected={isSelected === 0 ? false : true} />
          </TouchableOpacity>
        </View>

        {isSelected === 0 ? (
          <FlatList
            numColumns={3}
            key={"_"}
            keyExtractor={(item) => "_" + item.id}
            data={posts}
            renderItem={({ item }) => {
              return posts.length < 0 ? (
                <PhotogramText
                  text={"No Posts Yet"}
                  fontWeight={"h1"}
                  fontSize={18}
                />
              ) : (
                <TouchableOpacity
                  activeOpacity={3}
                  onPress={() =>
                    navigation.navigate("ImageDetails", {
                      userData: userData,
                      item: item,
                    })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      alignSelf: "center",
                      width: item.image !== null ? width / 3.2 : 0,
                      height: item.image !== null ? height / 6 : 0,
                      margin: 2,
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <PhotogramText
            text={"This feature is coming soon!"}
            fontStyle={"italic"}
            fontSize={18}
            extraStyles={{
              justifyContent: "center",
              alignSelf: "center",
              marginTop: height / 5.5,
            }}
            fontWeight={"h1"}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  userImg: {
    height: 100,
    width: 100,
    shadowColor: "#222",
    elevation: 8,
    marginLeft: 12,
    marginTop: 24,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    left: 40,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    left: 20,
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userBtn: {
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    marginVertical: 24,
  },
  userBtnTxt: {
    color: "#000000",
    alignSelf: "center",
    fontWeight: "bold",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "65%",
    marginVertical: 42,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
