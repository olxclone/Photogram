import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { PhotogramText } from "../Text/PhotoGramText";
import { height, padding } from "../../Utils/constants/styles";
import { Image } from "react-native-animatable";
import { Navigation } from "react-native-navigation";

export default function ChatScreenHeader({
  userName,
  userImg,
  props,
  navigation,
  status,
}) {
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
      <TouchableOpacity onPress={() => Navigation.pop(props.componentId)}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={{
          uri: userImg
            ? userImg
            : "https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png",
        }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 300,
          marginLeft: 12,
          marginTop: height/101,
        }}
      />
      <View>
        <PhotogramText
          alignSelf={"center"}
          fontWeight={"h1"}
          extraStyles={{
            marginLeft: 12,
          }}
          fontSize={20}
          text={userName}
        />
        <PhotogramText
          alignSelf={"center"}
          // fontWeight={"h1"}
          extraStyles={{
            marginLeft: 12,
          }}
          // fontSize={20}
          text={status}
        />
      </View>

      <TouchableOpacity>
        {/* <AntDesign name="ellipsis1" size={24} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
}
