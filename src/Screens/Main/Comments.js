import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {
  View,
  FlatList,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { width } from "../../Utils/constants/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentList from "../../Components/commentsList/commentList";
import { Navigation } from "react-native-navigation";
import CommentScreenHeader from "../../Components/headers/CommentScreenHeader";
export default function Comments(props) {
  let [commentText, setCommentText] = useState("");
  let [comments, setComments] = useState([]);
  let [keyboardShow, setKeyboardShow] = useState();
  let [user, setUser] = useState();

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboardShow(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboardShow(false));
  });

  const getUser = async () => {
    let currentUser = await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnaphot) => {
        setUser(documentSnaphot.data());
      }, []);
  };

  let getAllComments = async () => {
    await firestore()
      .collection("Posts")
      .doc(props.params)
      .collection("comments")
      .onSnapshot((data) => {
        const Allcomments = data.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setComments(Allcomments);
      });
  };

  useEffect(() => {
    getAllComments();
    getUser();
    return () => {
      getAllComments();
    };
  }, [props.params]);

  let onSendComment = () => {
    setCommentText("");
    firestore()
      .collection("Posts")
      .doc(props.params)
      .collection("comments")
      .add({
        commentText,
        uid: auth().currentUser.uid,
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <CommentScreenHeader props={props} userData={user}  />
      <View>
        <FlatList
          style={{ marginBottom: "15%" }}
          showsVerticalScrollIndicator={false}
          data={comments}
          renderItem={({ item }) => (
            <CommentList docId={props.params} props={props} item={item} />
          )}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{ flexDirection: "row", position: "absolute", zIndex: 10 }}
        >
          <TextInput
            placeholderTextColor="#000"
            numberOfLines={4}
            placeholder={"Comment ....."}
            onChangeText={(text) => setCommentText(text)}
            style={{
              borderRadius: 35,
              padding: 0,
              width: width - 32,
              color: "#000",
              marginHorizontal: 5,
              marginVertical: 8,
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          />
          <TouchableOpacity
            onPress={() => {
              onSendComment();
              setCommentText("");
            }}
          >
            <MaterialCommunityIcons
              style={{ marginTop: 18 }}
              name="send"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
