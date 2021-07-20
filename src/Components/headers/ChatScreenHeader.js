import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Navigation } from "react-native-navigation";
import moment from "moment";
export default function ChatScreenHeader({ props, userName, userImg, status }) {
  return (
    <View
      style={{ flexDirection: "row", display: "flex", alignItems: "center" }}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => Navigation.pop(props.componentId)}
        style={{ marginTop: 8, marginLeft: 8 }}
      >
        <AntDesign name="close" color="#000" size={24} />
      </TouchableOpacity>
      <Image
        source={{ uri: userImg  ? userImg : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'}}
        style={{
          height: 40,
          width: 40,
          marginLeft: 12,
          marginTop: 8,
          borderRadius: 204,
        }}
      />
      <View style={{ justifyContent: "center", marginTop: 18 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
          {userName}
        </Text>
        <Text style={{ marginLeft: 8 }}>
          {status === "online" ? (
            "online"
          ) : (
          `${status}`
          )}
        </Text>
      </View>
    </View>
  );
}
