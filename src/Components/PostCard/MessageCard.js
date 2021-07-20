import auth from '@react-native-firebase/auth';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'react-native-animatable';
import Lightbox from 'react-native-lightbox';

export default function MessageCard({ item, imageUri }) {

  return (
    <View>
      {item.user._id !== auth().currentUser.uid ? (
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-start',
            marginVertical: 6,
            marginRight: '30%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundColor: 'rgba(0,0,0,0.2)',
            left: 12,
            width: item.image && '75%',
          }}
        >
            <Image
              source={{ uri: item.image ? item.image : null }}
              style={{
                flex: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                width: '100%',
                height: item.image ? 145 : 0,
              }}
            />

          <Text
            numberOfLines={31}
            style={{
              color: '#fff',
              marginHorizontal: 12,
              marginVertical: 8,
            }}
          >
            {item.text}
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            marginVertical: 6,
            marginLeft: '30%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundColor: '#45A4FF',
            right: 12,
            width: item.image && '75%',
          }}
        >
          <View>
              <Image
                source={{ uri: item.image ? item.image : null }}
                style={{
                  borderTopLeftRadius: 16,
                  flex: 1,
                  borderTopRightRadius: 16,
                  width: '100%',
                  height: item.image ? 145 : 0,
                }}
              />

            <Text
              style={{ color: '#fff', marginHorizontal: 12, marginVertical: 8 }}
            >
              {item.text}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
