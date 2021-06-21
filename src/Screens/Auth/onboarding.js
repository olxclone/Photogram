import React, { useRef , useState} from "react";
import { View, Text, Animated } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";
import { width } from "../../Utils/constants/styles";
import { ExpandingDot } from "react-native-animated-pagination-dots";

export default function OnBoarding({navigation}) {
    const [currentIndex, setcurrentIndex] = useState(0)
  let data = [
    {
      title: "ENJOY WITH MORE THAN 1000 OF PEOPLE",
      image: null,
    },
    {
      title: "POST THE HAPPIEST MOVEMENT WITH THE WORLD ",
      image: null,
    },
    {
      title: "CHAT WITH THE WORLD",
      image: null,
    },
    {
      title: "LOGIN NOW TO GET STARTED",
      image: null,
    },
  ];

  let scrollX = new Animated.Value(0);
 let ref = useRef()
 const handlePageChange = pageNumber => {
     if(currentIndex < data.length - 1){
    ref.current.scrollToIndex({index : index + 1});
     }
  };
  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={data}
        ref={ref}
        horizontal
        scrollEnabled
        snapToInterval={width}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        indicatorStyle={"white"}
        contentContainerStyle={{
          //   width,
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={(props) => {
setcurrentIndex(props.index)
          return (
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  width,
                  textAlign: "center",
                }}
              >
                {props.item.title}
              </Text>
              {/* <PhotoGramButton title="Skip" onPress={() => props.index + 1} padding={10} extraStyles={{margin:10,width:width/3.5,borderRadius:24}} /> */}

            </View>
          );
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <PhotoGramButton onPress={() => navigation.navigate('Choose_Auth')} title="Skip" padding={10} extraStyles={{margin:10,width:width/3.5,borderRadius:24}} />
        <PhotoGramButton onPress={() => handlePageChange(0)} title={"Next"} padding={10}  extraStyles={{margin:10,width:width/3.5,borderRadius:24}} />
      </View>
      <ExpandingDot
        data={data}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotOpacity={0.6}
        dotStyle={{
          width: 10,
          height: 10,
          backgroundColor: "#347af0",
          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{
          bottom: 30,
        }}
      />
    </View>
  );
}
