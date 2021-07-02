import React, { memo, useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Text,
} from "react-native";
import { padding, width, height } from "../../Utils/constants/styles";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as Animatable from "react-native-animatable";
import { PhotogramTextInput } from "../../Components/TextInput/PhotoGramTextInput";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Alert } from "react-native";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import { ActivityIndicator } from "react-native-paper";

function signUp() {
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggginIn] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState();
  const [userName, setUserName] = useState("");
  const [userNameExists, setuserNameExists] = useState(false);
  const [nickName, setNickName] = useState("");

  let getAllUsers = async (search) => {
    firestore()
      .collection("users")
      .where("nickName", "==", search)
      .onSnapshot((snapshot) => {
        snapshot.forEach((data) => {
          data.exists ? console.log(data.data()) : console.log(false);
        });
      });
  };

  useEffect(() => {
    userNameExists ? setuserNameExists(false) : setuserNameExists(true);
    Keyboard.addListener("keyboardDidShow", () => setKeyboard(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboard(false));
    let nickname = userName.toLowerCase().replace(/\s/g, "");
    setuserNameExists(false);
    setNickName(nickname);
  });

  async function signUp() {
    setLoggginIn(true)
    if (email.length < 20 && password.length > 24) {
      Alert.alert("Please provide a valid credentials");
    } else {
      if (userNameExists) {
        Alert.alert("userName Already Exists");
      } else {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((user) => {
            firestore().collection("users").doc(user.user.uid).set({
              userName,
              nickName,
              userImg: "",
              email,
              following: [],
              followers: [],
              uid: user.user.uid,
              createdAt: Date.now(),
              bio: "",
              web: "",
            });
          })
          .catch((error) => {
            setLoggginIn(false)
            Alert.alert(error.message);
          });
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          flex: 1,
          width,
          borderBottomRightRadius: 64,
          backgroundColor: keyboard ? "#fff" : "#45A4FF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PhotogramText
          extraStyles={{
            color: "#fff",
            marginHorizontal: 24,
            textAlign: "center",
          }}
          text={`Register with Photogram to enjoy the features`}
          fontSize={32}
          fontWeight={"h1"}
        />
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          zIndex: -15,
          width: 75,
          right: 0,
          top: keyboard ? "1%" : "25%",
          height: 75,
        }}
      />
      <View
        style={{
          backgroundColor: keyboard ? "#fff" : "#45A4FF",
          position: "absolute",
          zIndex: -15,
          width: 75,
          left: 0,
          top: keyboard ? "1%" : "25%",
          height: 105,
        }}
      />
      <Animatable.View
        animation="slideInDown"
        duration={5}
        style={{
          flex: keyboard ? 8 : 2,
          borderTopLeftRadius: 64,
          borderTopRightRadius: -970,
          backgroundColor: "#fff",
          width,
        }}
      >
        <PhotogramText
          color={"#45A4FF"}
          fontWeight={"h1"}
          text={`Register ${"\n"}Here`}
          extraStyles={{
            marginLeft: 42,
            marginTop: 24,
          }}
          fontSize={32}
        />
        <View style={{ marginTop: 18 }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                marginHorizontal: 24,
                borderBottomColor: focus === "username" ? "#45A4FF" : null,
                borderBottomWidth: focus === "username" ? 1 : 0.5,
              }}
            >
              <AntDesign
                name="user"
                style={{ marginTop: "4.5%", marginLeft: 10 }}
                size={24}
                color="black"
              />
              <PhotogramTextInput
                fontWeight={"h1"}
                onChangeText={(u) => {
                  setUserName(u);
                  let nickname = u.toLowerCase().replace(/\s/g, "");
                  getAllUsers(nickname);
                }}
                onFocus={() => setFocus("username")}
                padding={10}
                marginHorizontal={3}
                placeholder="Username"
                extraStyles={{
                  width: width - 80,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                marginHorizontal: 24,
                marginVertical: 24,
                borderBottomColor: focus === "Email" ? "#45A4FF" : null,
                borderBottomWidth: focus === "Email" ? 1 : 0.5,
              }}
            >
              <AntDesign
                style={{ marginTop: "3.5%", marginLeft: 10 }}
                name="mail"
                size={24}
                color="black"
              />
              <PhotogramTextInput
                fontWeight={"h1"}
                onChangeText={(e) => setEmail(e)}
                onFocus={() => setFocus("Email")}
                marginHorizontal={3}
                placeholder="Email"
                padding={10}
                extraStyles={{
                  width: width - 80,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                marginHorizontal: 24,
                borderBottomColor: focus === "Password" ? "#45A4FF" : null,
                borderBottomWidth: focus === "Password" ? 1 : 0.5,
              }}
            >
              <AntDesign
                style={{ marginTop: "3%", marginLeft: 10 }}
                name="lock"
                size={24}
                color="black"
              />
              <PhotogramTextInput
                onEndEditing={(u) => console.log("done")}
                fontWeight={"h1"}
                marginHorizontal={3}
                secureTextEntry
                onChangeText={(p) => setPassword(p)}
                onFocus={() => setFocus("Password")}
                placeholder="Password"
                padding={10}
                extraStyles={{
                  width: width - 80,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          </View>
        </View>
        {email.replace(/\s/g, "").length === 0 ||
        password.replace(/\s/g, "").length === 0 ? (
          <PhotoGramButton
            activeOpacity={3}
            padding={10}
            title={"Register"}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: "center",
              padding: 10,
              borderRadius: 75,
              width: width - 40,
              marginTop: height / 18,
            }}
            backgroundColor={"#45A4F976"}
          />
        ) : !loggingIn ? (
          <PhotoGramButton
            onPress={() => signUp()}
            padding={10}
            title={"Register"}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: "center",
              padding: 10,
              borderRadius: 75,
              width: width - 40,
              marginTop: height / 12,
            }}
            backgroundColor="#45A4F9"
          />
        ) : (
          <PhotoGramButton
            onPress={() => signUp()}
            padding={10}
            title={loggingIn ? <ActivityIndicator color="#fff" /> : 'Register'}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: "center",
              padding: 10,
              borderRadius: 75,
              width: width - 40,
              marginTop: height / 12,
            }}
            backgroundColor="#45A4F9"
          />
        )}
      </Animatable.View>
    </View>
  );
}

export default signUp;

{
  /*
    <View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                marginHorizontal: 24,
                borderBottomColor: focus === 'username' ? '#45A4FF' : null,
                borderBottomWidth: focus === 'username' ? 1 : 0.5,
              }}>
              <AntDesign
                name="user"
                style={{ marginTop: '4.5%', marginLeft: 10 }}
                size={24}
                color="black"
              />
              <PhotogramTextInput
              fontWeight={'h1'}

                onChangeText={(u) => setUserName(u)}
                onFocus={() => setFocus('username')}
                padding={10}
                marginHorizontal={3}
                placeholder="Username"
                extraStyles={{
                  width: width - 80,
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          </View>
  */
}
