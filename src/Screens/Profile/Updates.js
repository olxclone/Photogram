import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import codePush from "react-native-code-push";
import { PhotoGramButton } from "../../Components/Buttons/PhotoGramButton";

export default function Updates() {
  let [packageMetadata, setPackageMetadata] = useState();
  function codePushDownloadDidProgress(progress) {
    console.log(
      progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
    );
  }

  useEffect(() => {
    async function getPackageMetadata() {
      const data = await codePush.getCurrentPackage();
      console.log({ data });
      if (data) {
        setPackageMetadata(data);
      }
    }
    getPackageMetadata();
    // call once loaded
  }, []);

  const onButtonPress = async () => {
    codePush.checkForUpdate().then((update) => {

      if (!update) {
        Alert.alert('UPDATED !', 'The app is up to date!');
      } else {
        Alert.alert('AN UPDATE IS AVILABLE', 'An update is available! ');
      }
    });
    // PushNotification.localNotification({
    //   title: "HELLO USER",
    //   bigLargeIcon: "ic_launcher",
    //   message: "Perhaps set your beacon timer for another hour?",
    //   actions: ["ReplyInput"],
    //   reply_placeholder_text: "Write your response...", // (required)
    //   reply_button_text: "Reply",
    //   playSound: true,
    //   channelId: "MY_CHANNE_ID",
    //   autoCancel: true,
    //   largeIcon: "ic_launcher",
    //   smallIcon: "ic_launcher",
    //   bigText: "Face2Face: Beacon Timer Expired",
    //   subText: "Perhaps set your beacon timer for another hour?",
    //   vibrate: true,
    //   vibration: 300,
    //   priority: "high",
    // });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PhotoGramButton
        backgroundColor="#45A4FF"
        padding={10}
        fontSize={24}
        title={"Check for updates now"}
        onPress={onButtonPress}
      />
    </View>
  );
}
