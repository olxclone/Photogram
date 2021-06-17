import React from "react";
import { View, Text, Image, Animated, ScrollView } from "react-native";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import { height, width } from "../../Utils/constants/styles";
import * as Animatable from "react-native-animatable";
import { PhotogramText } from "../../Components/Text/PhotoGramText";
import { FlatList } from "react-native-gesture-handler";

export default function ChooseAuth(props) {
  let Data = [
    {
      title: "Login To access All The Features ",
      image: null,
    },
    {
      title: "Follow your favorate friend relative",
      image: null,
    },
    {
      title: "Chat with your best , close friends",
      image: null,
    },
    {
      title: "Post the Things you want to share ",
      image: null,
    },
    {
      title: "Don't have an account create one for free ",
      image: null,
    },
  ];

  let x = new Animated.Value(0);
  let dotPostion = Animated.divide(x, 25);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          flex: 2,
          alignItems: "center",
          backgroundColor: "#45A4FF",
          borderBottomRightRadius: 64,
          width,
        }}
      >
        <Animated.FlatList
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          onScroll={() => {
            Animated.event([
              {
                nativeEvent: { contentOffset: { x: x } },
              },
            ]);
          }}
          scrollEventThrottle={24}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <View style={{ flexDirection: "row" }}>
          {/* {Data.map((item, index) => {
            let opacity = dotPostion.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 2, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={`dot=${index}`}
                opacity={opacity}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#fff",
                  borderRadius: 25,
                }}
              ></Animated.View>
            );
          })} */}
        </View>
      </View>
      <Animatable.View
        animation="bounceInUp"
        style={{
          backgroundColor: "#fff",
          width,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          borderTopLeftRadius: 64,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: 75,
            position: "absolute",
            left: 0,
            top: "0%",
            height: 75,
          }}
        />
        <PhotoGramButton
          title={"Sign In"}
          padding={18}
          onPress={() => props.navigation.navigate("signIn")}
          extraStyles={{
            shadowColor: "#000",
            elevation: 8,
            width: width / 1.5,
            borderRadius: 75,
            marginVertical: 24,
          }}
        />
        <PhotoGramButton
          padding={18}
          onPress={() => props.navigation.navigate("signUp")}
          backgroundColor={"#fff"}
          color={"#000"}
          extraStyles={{
            width: width / 1.5,
            borderRadius: 75,
            shadowColor: "#000",
            elevation: 8,
          }}
          title={"Sign Up"}
        />
      </Animatable.View>
    </View>
  );
}
