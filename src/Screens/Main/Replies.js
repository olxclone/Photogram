import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import firestore from "@react-native-firebase/firestore";
import RepliesHeader from "../../Components/headers/RepliesHeader";

export default function Replies(props) {
  let [user, setUser] = useState();

  const fetchUser = async () => {
    await firestore()
      .collection("users")
      .doc(props.item.uid)
      .onSnapshot((data) => {
        setUser(data.data());
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={{backgroundColor:'#fff',flex:1,overflow:'hidden'}}>
      {/*/ header*/}
      <View>
        <RepliesHeader props={props} />
      </View>
      <View style={{ flexDirection: "row", padding: 24 - 6 }}>
        <Image
          source={{ uri: user ? user.userImg : null }}
          style={{ borderRadius: 40 }}
          width={40}
          height={40}
        />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 8 }}>
            {user ? user.userName : "Test"}
          </Text>
          <Text style={{ marginRight: 24, marginLeft:8 }} numberOfLines={50}>
            {props.item ? props.item.commentText : "Loading ..."}
          </Text>
        </View>
      </View>
    </View>
  );
}
