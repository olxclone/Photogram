import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function RepliesHeader({props}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#FFF",
        shadowColor: "#000",
        padding: 12,
        elevation: 8,
        alignItems: "center",
        display: "flex",
      }}
    >
        <TouchableOpacity onPress={()=> Navigation.pop(props.componentId)}>
        <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
      <Text style={{ marginLeft: 18, fontWeight: "bold", fontSize: 18 }}>
        Replies
      </Text>
    </View>
  );
}
