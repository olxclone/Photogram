import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {
  View,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { width } from "../../Utils/constants/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentList from "../../Components/commentsList/commentList";
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
        likes: [],
        disLikes: [],
        uid: auth().currentUser.uid,
      });
  };

  return (
    <View>
      <CommentScreenHeader props={props} userData={user} />
      <View style={{ flex: 0 }}>
          <FlatList
            // style={{ marginBottom: "5%" }}s
            // showsVerticalScrollIndicator={false}
            data={comments}
            renderItem={({ item }) => (
              <CommentList
                docId={props.params}
                props={props}
                params={props.params}
                item={item}
              />
            )}
          />
      </View>
      <KeyboardAvoidingView
      // style={{ justifyContent: "flex-end", flex: 0, display: "flex" }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: user ? user.userImg : null }}
            height={50}
            width={50}
          />
          <TextInput
            placeholderTextColor="#000"
            value={commentText}
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
            disabled={
              commentText.replace(/\s/g, "").length === 0 ? true : false
            }
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
      </KeyboardAvoidingView>
    </View>
  );
}
//  <KeyboardAvoidingView
//         style={{ flex: 1, justifyContent: "flex-end" }}
//         behavior={"position"}
//       >
//         <View style={{ flexDirection: "row" }}>
//           <Image
//             source={{ uri: user ? user.userImg : null }}
//             height={50}
//             width={50}
//           />
//           <TextInput
//             placeholderTextColor="#000"
//             value={commentText}
//             numberOfLines={4}
//             placeholder={"Comment ....."}
//             onChangeText={(text) => setCommentText(text)}
//             style={{
//               borderRadius: 35,
//               padding: 0,
//               width: width - 32,
//               color: "#000",
//               marginHorizontal: 5,
//               marginVertical: 8,
//               backgroundColor: "rgba(0,0,0,0.12)",
//             }}
//           />
//           <TouchableOpacity
//             disabled={
//               commentText.replace(/\s/g, "").length === 0 ? true : false
//             }
//             onPress={() => {
//               onSendComment();
//               setCommentText("");
//             }}
//           >
//             <MaterialCommunityIcons
//               style={{ marginTop: 18 }}
//               name="send"
//               size={24}
//               color="black"
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
