import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {
  View,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  Text,
  TextInputComponent,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { PhotogramTextInput } from "../../Components/TextInput/PhotoGramTextInput";
import { height, padding, width } from "../../Utils/constants/styles";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentList from "../../Components/commentsList/commentList";
export default function Comments({ route, navigation }) {
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
      .doc(route.params.docId)
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
  }, [route.params.docId]);

  let onSendComment = () => {
    setCommentText('')
    firestore()
      .collection("Posts")
      .doc(route.params.docId)
      .collection("comments")
      .add({
        commentText,
        uid: auth().currentUser.uid,
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <FlatList
          style={{ marginBottom: "15%" }}
          showsVerticalScrollIndicator={false}
          data={comments}
          renderItem={({ item }) => (
            <CommentList
              navigation={navigation}
              docId={route.params.docId}
              item={item}
            />
          )}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{ flexDirection: "row", position: "absolute", zIndex: 10 }}
        >
          <TextInput
            placeholderTextColor="#000"
            placeholder={"Comment ....."}
            onChangeText={(text) => setCommentText(text)}
            style={{
              borderRadius: 35,
              padding: 10,
              width: width - 32,
              color: "#000",
              marginHorizontal: 5,
              marginVertical: 8,
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          />
          <TouchableOpacity  onPress={() => {onSendComment()
          setCommentText('')
          }}>
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
