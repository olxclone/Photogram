import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  RefreshControl,
  Alert,
  ScrollView,
  SafeAreaView,
  Text,
  Animated,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Shimmer from 'react-native-shimmer';
import { height, width } from '../../Utils/constants/styles';
import PostCard from '../../Components/PostCard/PostCard';
import { Navigation } from 'react-native-navigation';

function Home(props) {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [refresing, setRefreshing] = useState();
  const [deleted, setDeleted] = useState();
  const _isMounted = useRef(true);

  const getUser = async () => {
    let currentUser = await firestore()
      .collection('users')
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
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      { cancelable: false }
    );
  };

  const deletePost = (postId) => {
    firestore()
      .collection('Posts')
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

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

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
      .collection('Posts')
      .doc(postId)
      .delete()
      .catch((e) => console.log(e))
      .then(() => {
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!'
        );
        setDeleted(true);
      })
      .catch((e) => console.log('Error deleting post.', e));
  };

  const fetchPosts = async () => {
    try {
      const Lists = [];
      await firestore()
        .collection('Posts')
        .orderBy('createdAt', 'desc')
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

  useEffect(() => {
    let cleanUp = getUser();
    setDeleted(false);
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View>
        <View style={{ backgroundColor: '#FFF', padding: 16 }}>
          <SafeAreaView>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 32,
              }}
            >
              Photogram
            </Text>
          </SafeAreaView>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ flex: 1, marginTop: 24 }}>
            <View style={{ flexDirection: 'row' }}>
              <Shimmer
                style={{
                  marginHorizontal: 24,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'grey',
                    width: width / 5.5,
                    height: height / 11,
                    borderRadius: 100,
                  }}
                />
              </Shimmer>
              <View>
                <Shimmer
                  style={{ marginTop: 12, width: width / 2, height: 20 }}
                >
                  <View
                    style={{
                      backgroundColor: 'grey',
                    }}
                  />
                </Shimmer>
                <Shimmer
                  style={{ marginTop: 12, width: width / 4, height: 20 }}
                >
                  <View
                    style={{
                      backgroundColor: 'grey',
                    }}
                  />
                </Shimmer>
              </View>
            </View>
            <View style={{ marginHorizontal: 24 }}>
              <Shimmer style={{ marginTop: 12, width: width - 50, height: 20 }}>
                <View
                  style={{
                    backgroundColor: 'grey',
                  }}
                />
              </Shimmer>
              <Shimmer
                style={{
                  marginTop: 12,
                  marginLeft: 0,
                  width: width / 1.5,
                  height: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'grey',
                  }}
                />
              </Shimmer>
            </View>

            <Shimmer
              style={{
                marginHorizontal: 24,
                marginTop: 8,
              }}
            >
              <View
                style={{
                  marginHorizontal: 24,

                  height: height / 3.5,
                  backgroundColor: 'grey',
                }}
              />
            </Shimmer>
          </View>
          <View style={{ flex: 1, marginTop: height / 18, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row' }}>
              <Shimmer
                style={{
                  marginHorizontal: 24,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'grey',
                    width: width / 5.5,
                    height: height / 11,
                    borderRadius: 100,
                  }}
                />
              </Shimmer>
              <View>
                <Shimmer
                  style={{ marginTop: 12, width: width / 2, height: 20 }}
                >
                  <View
                    style={{
                      backgroundColor: 'grey',
                    }}
                  />
                </Shimmer>
                <Shimmer
                  style={{ marginTop: 12, width: width / 4, height: 20 }}
                >
                  <View
                    style={{
                      backgroundColor: 'grey',
                    }}
                  />
                </Shimmer>
              </View>
            </View>
            <View style={{ marginHorizontal: 24 }}>
              <Shimmer style={{ marginTop: 12, width: width - 50, height: 20 }}>
                <View
                  style={{
                    backgroundColor: 'grey',
                  }}
                />
              </Shimmer>
              <Shimmer
                style={{
                  marginTop: 12,
                  marginLeft: 0,
                  width: width / 1.5,
                  height: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'grey',
                  }}
                />
              </Shimmer>
            </View>

            <Shimmer
              style={{
                marginHorizontal: 24,
                marginTop: 8,
              }}
            >
              <View
                style={{
                  marginHorizontal: 24,

                  height: height / 3.5,
                  backgroundColor: 'grey',
                }}
              />
            </Shimmer>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#FFF', padding: 16 }}>
        <SafeAreaView>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 32,
            }}
          >
            Photogram
          </Text>
        </SafeAreaView>
      </View>

      <Animated.FlatList
        data={posts}
        style={{ marginBottom: '1%' }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            colors={['#45C1FF', '#45B9FF']}
            onRefresh={() => onRefresh()}
            refreshing={refresing}
          />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return <PostCard item={item} onDelete={handleDelete} props={props} />;
        }}
      />
    </View>
  );
}
export default Home;
