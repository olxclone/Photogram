import React from 'react';
import {View, Text} from 'react-native';
import {padding} from '../../Utils/constants/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PhotogramText} from '../Text/PhotoGramText';
import {TouchableOpacity} from 'react-native';

export default function CommentModalHeader({
  userData,
  setVisible,
  visible,
  navigation,
}) {
  return (
    <View
      style={{
        padding: padding - 14,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#ffff',
        shadowColor: '#000',
        elevation: 8,
      }}>
      <TouchableOpacity onPress={() => navigation.navigate('Comments')}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <PhotogramText
        fontSize={18}
        fontWeight={'h1'}
        text={`Commented By ${userData}`}
      />
      <Text>{}</Text>
    </View>
  );
}
