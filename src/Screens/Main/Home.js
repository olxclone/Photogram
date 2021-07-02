import React, { useEffect, useState, useRef } from "react";
import {
  View,
  RefreshControl,
  Alert,
  ScrollView,
  SafeAreaView,
  Text,
  Animated,
  BackHandler,
} from "react-native";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { width } from "../../Utils/constants/styles";
import PostCard from "../../Components/PostCard/PostCard";
import { Navigation } from "react-native-navigation";

function Home(props) {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [refresing, setRefreshing] = useState();
  const [deleted, setDeleted] = useState();
  const _isMounted = useRef(true);

  const getUser = async () => {
    let currentUser = await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnaphot) => {
        setUser(documentSnaphot.data());
      });
  };

  function onRefresh() {
    fetchPosts().then(() => setRefreshing(false));
  }

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

  const deletePost = (postId) => {
    firestore()
      .collection("Posts")
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        _isMounted.current = true;
        if (documentSnapshot.exists) {
          const { image } = documentSnapshot.data();
          if (image != null) {
            const storageRef = storage().refFromURL(image);
            const imageRef = storage()
              .ref(storageRef.fullPath)
              .delete()
              .then(() => {
                deleteFirestoreData(postId);
              })
              .catch((e) => console.log(e));
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  useEffect(() => {
    Navigation.events().registerScreenPoppedListener(() => {
      Navigation.mergeOptions(props.componentId, {
        bottomTabs: {
          visible: true,
        },
      });
    });
  }, []);

  const deleteFirestoreData = (postId) => {
    console.log(postId);
    firestore()
      .collection("Posts")
      .doc(postId)
      .delete()
      .catch((e) => console.log(e))
      .then(() => {
        Alert.alert(
          "Post deleted!",
          "Your post has been deleted successfully!"
        );
        setDeleted(true);
      })
      .catch((e) => console.log("Error deleting post.", e));
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const Lists = [];
      await firestore()
        .collection("Posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              uid,
              userImage,
              createdAt,
              postText,
              image,
              favorited,
              likes,
            } = doc.data();

            Lists.push({
              id: doc.id,
              uid,
              userImage,
              createdAt,
              favorited,
              postText,
              image,
              liked: false,
              likes,
            });
          });
        });
      if (loading) {
        setLoading(false);
      }
      setPosts(Lists);
    } catch (e) {
      console.log(e);
    }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      firestore().collection("users").doc(auth().currentUser.uid).update({
        status: firestore.FieldValue.serverTimestamp(),
      });
      BackHandler.exitApp();
    });
    getUser();
    setDeleted(false);
    return () => {
      getUser();
    };
  }, [deleted]);

  useEffect(() => {
    fetchPosts();
    return () => {
      fetchPosts();
    };
  }, []);

  // if(loading) {
  //   return (
  //     <ScrollView
  //     showsVerticalScrollIndicator={false}
  //     style={{flex: 1,marginTop:24}}
  //     contentContainerStyle={{alignItems: 'center',flex:1}}>
  //     <SkeletonPlaceholder speed={1000}>
  //       <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //         <View style={{width: 60, height: 60, borderRadius: 50}} />
  //         <View style={{marginLeft: 20}}>
  //           <View style={{width: 120, height: 20, borderRadius: 4}} />
  //           <View
  //             style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
  //           />
  //         </View>
  //       </View>
  //       <View style={{marginTop: 10, marginBottom: 30}}>
  //         <View style={{width: 300, height: 20, borderRadius: 4}} />
  //         <View
  //           style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
  //         />
  //         <View
  //           style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
  //         />
  //       </View>
  //     </SkeletonPlaceholder>
  //     <SkeletonPlaceholder>
  //       <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //         <View style={{width: 60, height: 60, borderRadius: 50}} />
  //         <View style={{marginLeft: 20}}>
  //           <View style={{width: 120, height: 20, borderRadius: 4}} />
  //           <View
  //             style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
  //           />
  //         </View>
  //       </View>
  //       <View style={{marginTop: 10, marginBottom: 30}}>
  //         <View style={{width: 300, height: 20, borderRadius: 4}} />
  //         <View
  //           style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
  //         />
  //         <View
  //           style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
  //         />
  //       </View>
  //     </SkeletonPlaceholder>
  //   </ScrollView>
  //   )
  // }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#FFF", padding: 16 }}>
        <SafeAreaView>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 32,
            }}
          >
            Photogram
          </Text>
        </SafeAreaView>
      </View>

      <Animated.FlatList
        data={posts}
        style={{ marginBottom: "1%" }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            colors={["#45C1FF", "#45B9FF"]}
            onRefresh={() => onRefresh()}
            refreshing={refresing}
          />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const inputRange = [
            -5,
            0,
            (width / 1.2) * index,
            (width / 1.2) * (index + 2),
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });

          return <PostCard item={item} onDelete={handleDelete} props={props} />;
        }}
      />
    </View>
  );
}
export default Home;
