import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Following(prop) {
  let [following, setFollowing] = useState();
  let [followingUserData, setFollowersUserData] = useState([]);
  const fetchUserFollowingData = async () => {
    try {
      await firestore()
        .collection("users")
        .doc(following)
        .get()
        .then((snapshot) => {
          setFollowersUserData(snapshot.data());
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserFollowingData();
  }, []);

  return (
    <View>
      <FlatList
        data={followingUserData}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{item.userName}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
