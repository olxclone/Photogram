import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';

export default function Loading({ navigation }) {
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.push('Main');
      } else {
        navigation.push('Choose_Auth');
      }
    });
  });
  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={42} color="#000" />
    </View>
  );
}
