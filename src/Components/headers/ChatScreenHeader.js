import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import { PhotogramText } from "../Text/PhotoGramText";
import { padding } from "../../Utils/constants/styles";
import { Image } from "react-native-animatable";

export default function ChatScreenHeader({ userName, userImg, navigation }) {
  return (
    <View
      style={{
        padding: padding - 8,
        backgroundColor: "#ffff",
        shadowColor: "#000",
        elevation: 8,
        flexDirection: "row",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{ uri: userImg }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 300,
          marginLeft: 12,
          marginTop: -5,
        }}
      />
      <PhotogramText
        alignSelf={"center"}
        fontWeight={"h1"}
        extraStyles={{
          marginLeft: 12,
        }}
        fontSize={20}
        text={userName}
      />
      <TouchableOpacity>
        {/* <AntDesign name="ellipsis1" size={24} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
}
