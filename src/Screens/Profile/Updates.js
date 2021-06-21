import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import codePush from 'react-native-code-push';
import { PhotoGramButton } from '../../Components/Buttons/PhotoGramButton';

export default function Updates() {

  let [packageMetadata,setPackageMetadata] = useState()
  // function codePushDownloadDidProgress(progress) {
  //   console.log(
  //     progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
  //   );
  // }

  useEffect(() => {
    async function getPackageMetadata() {
      const data = await codePush.getCurrentPackage();
      console.log({data});
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
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PhotoGramButton backgroundColor="#898989" padding={10} fontSize={24} title={'Check for updates'} onPress={onButtonPress} />
    </View>
  );
}
