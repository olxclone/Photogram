import React, { memo, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal as RNModal,
  ActivityIndicator,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  MessageImage,
  Send,
} from "react-native-gifted-chat";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AntDesign from "react-native-vector-icons/AntDesign";
import storage from "@react-native-firebase/storage";
import { height, width } from "../../Utils/constants/styles";
import ImagePicker from "react-native-image-crop-picker";
import { Navigation } from "react-native-navigation";
import ChatScreenHeader from "../../Components/headers/ChatScreenHeader";

function chatRoom(props) {
  const [messages, setMessages] = useState([]);
  const [messageImageUri, setMessageImageUri] = useState("");
  const [uploading, setUploading] = useState("");
  const [transferred, setTransferred] = useState("");
  const [messageImage, setMessageImage] = useState("");
  const [text, setText] = useState();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const docid =
      props.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + "-" + props.params.uid
        : props.params.uid + "-" + auth().currentUser.uid;
    const messageRef = firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc");
    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setMessageImageUri(image.path);
    });
  };

  const uploadImage = async () => {
    if (!messageImageUri) {
      Alert.alert("Choose a image", "Please choose a image to continue");
    } else {
      const path = `profile/${Date.now()}/${Date.now()}`;
      return new Promise(async (resolve, rej) => {
        const response = await fetch(messageImageUri);
        const file = await response.blob();
        let upload = storage().ref(path).put(file);
        upload.on(
          "state_changed",
          (snapshot) => {
            setUploading(true);
            console.log(
              `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`
            );
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },

          (err) => {
            rej(err);
          },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL();
            console.log(url);
            setMessageImage(url);
            setMessageImageUri(null);
            resolve(url);
            setUploading(false);
            return url;
          }
        );
      });
    }
  };

  const onSend = (messageArray) => {
    const msg = messageArray[0];
    console.log(msg);
    const mymsg = {
      ...msg,
      text: text ? text : null,
      sentBy: auth().currentUser.uid,
      sentTo: props.params.uid,
      image: messageImage || null,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docid =
      props.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + "-" + props.params.uid
        : props.params.uid + "-" + auth().currentUser.uid;
    firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .add({
        ...mymsg,
        token: "something",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChatScreenHeader
        status={props.params ? props.params.status : "offline"}
        props={props}
        userName={props.params ? props.params.userName : "Test"}
        userImg={
          props.params
            ? props.params.userImg
            : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png"
        }
      />

   
      <GiftedChat
        onInputTextChanged={(text) => setText(text)}
        renderSend={(props) => (
          <Send {...props} disabled={messageImage || text ? false : true} />
        )}
        renderMessageImage={(props) => {
          return (
            <MessageImage
              {...props}
              imageStyle={{ width: width / 1.2, height: height / 4.5 }}
            />
          );
        }}
        messages={messages}
        renderActions={() => {
          return (
            <TouchableOpacity
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => choosePhotoFromLibrary()}
            >
              <AntDesign
                name="camera"
                style={{ marginBottom: 6, marginLeft: 8 }}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#229AC9",
                },
                left: {
                  backgroundColor: "#DFDFDF",
                },
              }}
            />
          );
        }}
        user={{
          _id: auth().currentUser.uid,
        }}
        onSend={(messages) => onSend(messages)}
      />
      <RNModal visible={messageImageUri || uploading ? true : false}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: messageImageUri }}
            style={{ width, height: height / 4 }}
          />
          {uploading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{transferred} % Completed!</Text>
              <ActivityIndicator size="large" color="#45A4F9" />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => uploadImage()}
              activeOpacity={3}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#2e64e515",
                borderRadius: 5,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#4657",
                }}
              >
                <AntDesign name="check" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </RNModal>
    </View>
  );
}

export default chatRoom;
