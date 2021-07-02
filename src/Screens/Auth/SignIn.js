import React, { memo, useEffect, useState } from "react";
import { View, Text, Alert, Keyboard } from "react-native";
import { padding, width, height } from "../../Utils/constants/styles";
import auth from "@react-native-firebase/auth";
import { PhotogramTextInput } from "../../Components/TextInput/PhotoGramTextInput";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import * as Animatable from "react-native-animatable";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ActivityIndicator } from "react-native-paper";

function signIn({ navigation }) {
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState();
  const [email, setEmail] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loggingIn,setLoggingIn] = useState(false)

  let checkIfDisabled = () => {
    if (email.length === 0 && password.length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboard(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboard(false));
    setTimeout(() => {
      checkIfDisabled();
    }, 1);
  }, []);

  function Login() {
    setLoggingIn(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setLoggingIn(false)
        Alert.alert(error.message);
      });
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
          extraStyles={{ color: "#fff" }}
          text={`Login to access all ${"\n"}    the features`}
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
          text={`Welcome back ${"\n"}user`}
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
            title={"Login"}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: "center",
              padding: 10,
              borderRadius: 75,
              width: width - 40,
              marginTop: height / 12,
            }}
            backgroundColor={"#45A4F976"}
          />
        ) : (
          <PhotoGramButton
            onPress={() => Login()}
            padding={10}
            title={!loggingIn ? "Login" : <ActivityIndicator color="#fff" />}
            // LoggingInComponent={loggingIn && <ActivityIndicator color="#fff" />}
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

export default signIn;
