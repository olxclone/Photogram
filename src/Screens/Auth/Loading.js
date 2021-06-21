import React, { useEffect } from "react";
import { View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import * as Animatable from 'react-native-animatable'
import { ActivityIndicator } from "react-native";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import { height } from "../../Utils/constants/styles";

export default function Loading({ navigation }) {
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      setTimeout(() => {
        if (user) {
          navigation.push("Main");
        } else {
          navigation.push("OnBoarding");
        }
      }, 3000);
    });
  });
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animatable.Text animation='bounce' duration={2000} style={{fontWeight:'bold',fontSize:height/12,fontFamily:'Roboto-Regular'}}>
        {'Photogram'}
      </Animatable.Text>
    </View>
  );
}
