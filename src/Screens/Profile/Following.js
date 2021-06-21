import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Following(prop) {
  let [following, setFollowing] = useState();
  let [followingUserData, setFollowersUserData] = useState([]);
  const fetchUserFollowingData = async () => {
  
      const fetchChatUser = async () => {
        await firestore()
          .collection("users")
          .onSnapshot((data) => {
            console.log(data);
          });
      };
  };

  useEffect(() => {
    fetchUserFollowingData();
  });

  return (
    <View>
      <FlatList
        data={followingUserData}
        renderItem={({ item }) => {
          // return <Text>{JSON.stringify(item)}</Text>;
        }}
      />
    </View>
  );
}
