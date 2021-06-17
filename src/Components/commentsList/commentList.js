import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { height, padding, width } from '../../Utils/constants/styles';
import { PhotogramText } from '../Text/PhotoGramText';
import { Modal } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function CommentList({ item, route, navigation,docId }) {
  const [userData, setUserData] = useState();
  const [visible, setVisible] = useState(false);
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, []);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View >
      <View style={{ borderBottomColor: '#333', borderBottomWidth: 0.5 }} />
      <View style={{ flexDirection: 'row', marginVertical: padding - 10 }}>
        <Image
          style={{
            width: 50,
            borderRadius: 55,
            padding,
            height: 50,
            marginLeft: 12,
          }}
          source={{
            uri: userData
              ? userData.userImg
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
        />
        <PhotogramText
          text={userData ? '@' + userData.userName : 'Test'}
          fontWeight={'h1'}
          fontSize={14}
          extraStyles={{ marginLeft: padding - 10 }}
        />
        <TouchableOpacity onPress={() => setVisible(true)}>
          <PhotogramText
          numberOfLines={3}
          extraStyles={{ marginRight: padding + 150 }}
          text={item.commentText}
        />
        </TouchableOpacity>
        
    
       
      </View>
      <Modal visible={visible} animationType="fade">
        <View
          style={{
            padding: padding - 14,
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: '#ffff',
            shadowColor: '#000',
            elevation: 8,
          }}>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <PhotogramText
            fontSize={18}
            fontWeight={'h1'}
            text={`Commented By ${userData ? userData.userName : 'Test'}`}
          />
          <Text>{}</Text>
        </View>
        <Image
          style={{
            width: 50,
            borderRadius: 55,
            padding,
            height: 50,
            marginLeft: 12,
          }}
          source={{
            uri: userData
              ? userData.userImg.length !== 0
                ? userData.userImg
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
        />
        <PhotogramText
          text={userData ? '@' + userData.userName : 'Test'}
          fontWeight={'h1'}
          fontSize={14}
          extraStyles={{ marginLeft: padding - 10 }}
        />
        <PhotogramText
          numberOfLines={30}
          extraStyles={{ marginHorizontal:padding }}
          text={item.commentText}
        />
      </Modal>
    </View>
  );
}
