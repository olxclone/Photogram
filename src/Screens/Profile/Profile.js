import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  SafeAreaView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { height, padding, width } from "../../Utils/constants/styles";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import { Tab } from "../../Components/customTab/Tab";

import { Transitioning, Transition } from "react-native-reanimated";
import ProfileHeader from "../../Components/headers/ProfileHeader";
import { DotIndicator } from "react-native-indicators";
import { Navigation } from "react-native-navigation";

function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(0);
  const [following, setFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatUser, setChatUser] = useState();

  const fetchChatUser = async () => {
    await firestore()
      .collection("users")
      .doc(props.item.uid)
      .onSnapshot((data) => {
        setChatUser(data.data());
      });
  };

  const onFollow = () => {
    try {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          following: firestore.FieldValue.arrayUnion(props.item.uid),
        })
        .then(() => {
          firestore()
            .collection("users")
            .doc(props.item ? props.item.uid : "")
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
    setModalVisible(true);
    try {
      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .update({
          following: firestore.FieldValue.arrayRemove(props.item.uid),
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
        });
      setModalVisible(false);
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
          props.item ? props.item.uid : auth().currentUser.uid
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
      .doc(props.item ? props.item.uid : auth().currentUser.uid)
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
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setCurrentUser(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    ref.current.animateNextTransition();
    fetchPosts();
    fetchChatUser();
    getUser();
    getCurrentUser();
    if (
      currentUser
        ? currentUser.following.indexOf(props.item ? props.item.uid : null) > -1
        : ""
    ) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [following]);

  let ref = React.createRef();

  useEffect(() => {
    Navigation.events().registerScreenPoppedListener(() => {
      if (props.componentId === "HOME_PROFILE_SCREEN") {
        Navigation.mergeOptions(props.componentId, {
          bottomTabs: {
            visible: false,
          },
        });
      } else {
        return Navigation.mergeOptions(props.componentId, {
          bottomTabs: {
            visible: true,
          },
        });
      }
    });
  }, []);

  const transition = (
    <Transition.Together>
      <Transition.In
        type="slide-right"
        durationMs={200}
        interpolation={"easeInOut"}
      />
      <Transition.In type="fade" durationMs={2000} />
      <Transition.Change />
    </Transition.Together>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal visible={modalVisible}>
        <DotIndicator color="#45A4FF" />
      </Modal>
      <ProfileHeader
        // navigation={navigation}
        props={props}
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
                  "Following"
                  // route.params ? userData : currentUser
                )
              }
            >
              <Text style={styles.userInfoTitle}>
                {!props.item
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
      <View
        style={{ flex: 0, alignItems: "center", alignContent: "flex-start" }}
      >
        <Text style={styles.userName}>
          {userData ? userData.userName || "Test" : "Test"}
        </Text>
      </View>

      <Text style={styles.aboutUser}>
        {userData ? userData.bio || "No details added." : ""}
      </Text>
      {props.item ? (
        props.item.uid === auth().currentUser.uid ? (
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
            onPress={() =>
              Navigation.push(props.componentId, {
                component: {
                  name: "EDITPROFILE_SCREEN",
                  id: "EDITPROFILE_SCREEN",
                  options: {
                    bottomTabs: { visible: false },
                    animations: {
                      push: {
                        content: {
                          translationX: {
                            from: require("react-native").Dimensions.get(
                              "window"
                            ).width,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              })
            }
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
              onPress={() =>
                Navigation.push(props.componentId, {
                  component: {
                    name: "CHATROOM_SCREEN",
                    id: "CHATROOM_SCREEN",
                    options: {
                      bottomTabs: {
                        visible: false,
                      },
                    },
                    passProps: {
                      params: chatUser,
                    },
                  },
                })
              }
            />
          </>
        )
      ) : (
        <>
          <PhotoGramButton
            title={"Edit Profile"}
            padding={10}
            onPress={() =>
              Navigation.push(props.componentId, {
                component: {
                  name: "EDITPROFILE_SCREEN",
                  id: "EDITPROFILE_SCREEN",
                  options: {
                    bottomTabs: { visible: false },
                    animations: {
                      push: {
                        content: {
                          translationX: {
                            from: require("react-native").Dimensions.get(
                              "window"
                            ).width,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              })
            }
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
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={3}
            onPress={() => selectTab(0)}
          >
            <Tab
              icon={"md-grid"}
              isSelected={isSelected === 0 ? true : false}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={3}
            onPress={() => selectTab(1)}
          >
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
              return posts.length === 0 ? (
                <PhotogramText
                  text={"No Posts Yet"}
                  fontWeight={"h1"}
                  fontSize={18}
                />
              ) : posts.image !== null ? (
                <Image
                  source={{ uri: item.image }}
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    width: item.image !== null ? width / 3.2 : 0,
                    height: item.image !== null ? height / 6 : 0,
                    margin: 2,
                  }}
                />
              ) : (
                <></>
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
    marginLeft: 18,
    // flex:1,
    marginTop: 24,
    borderRadius: 75,
  },
  userName: {
    // fontSize: 18,
    // fontWeight: "bold",
    // marginTop: 10,
    // left: 40,
    // marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: width / 15,
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
