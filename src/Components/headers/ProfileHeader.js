import React from 'react';
import {View, Text} from 'react-native';
import {padding} from '../../Utils/constants/styles';
import {PhotogramText} from '../Text/PhotoGramText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';

export default function ProfileHeader({userName, navigation}) {
  return (
    <View
      style={{
        padding: padding - 8,
        backgroundColor: '#ffff',
        shadowColor: '#000',
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <PhotogramText
        alignSelf={'center'}
        fontWeight={'h1'}
        fontSize={20}
        text={userName}
      />
      <TouchableOpacity>
        {/* <AntDesign name="ellipsis1" size={24} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
}
