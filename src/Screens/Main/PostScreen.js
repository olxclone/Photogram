import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { padding, width, height } from '../../Utils/constants/styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FloatingAction } from 'react-native-floating-action';

function PostScreen({ navigation }) {
  const [imageUri, setImageUri] = useState();
  const [postText, setPostText] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [userData, setUserData] = useState();
  const bs = React.useRef();

  const actions = [
    {
      text: 'Camera',
      icon: <Icon name="camera-outline" style={styles.actionButtonIcon} />,
      name: 'camera',
      position: 1,
    },
    {
      text: 'Library',
      icon: <Icon name="md-images-outline" style={styles.actionButtonIcon} />,
      name: 'library',
      position: 2,
    },
  ];

  const LauchCamera = async (props) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setImageUri(image.path);
      bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setImageUri(image.path);
      bs.current.snapTo(1);
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      return null;
    } else {
      const path = `photos/${auth().currentUser.uid}/${Date.now()}`;
      return new Promise(async (resolve, rej) => {
        const response = await fetch(imageUri);
        const file = await response.blob();
        let upload = storage().ref(path).put(file);
        upload.on(
          'state_changed',
          (snapshot) => {
            setUploading(true);
            console.log(
              `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
            ),
              setVisible(true);
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          (err) => {
            rej(err);
          },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL();
            setVisible(false);
            setUploading(false);
            console.log(url);
            resolve(url);
            setImageUri(null);
          },
        );
      });
    }
  };

  async function handleUpload({ Url }) {
    setPostText('');
    const uri = await uploadImage(Url);
    return new Promise((res, rej) => {
      firestore()
        .collection('Posts')
        .add({
          uid: auth().currentUser.uid,
          image: uri,
          favorited : [], 
          postText: postText,
          createdAt: firestore.Timestamp.now(),
          likes: [],
        })
        .then((ref) => {
          alert('post added');
          navigation.navigate('Home');
          res(ref);
        })
        .catch((err) => {
          console.log(err);
          rej(err);
        });
    });
  }

  return (
    <View style={styles.container}>
      <AntDesign
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 6, left: 7 }}
        name="left"
        size={24}
        color="#45A4F9"
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#fff',
        }}>
        {imageUri != null ? (
          <Image
            style={{ width: '100%', height: 250, marginBottom: 15 }}
            source={{ uri: imageUri }}
          />
        ) : null}

        <TextInput
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            textAlign: 'center',
            width: '90%',
            fontFamily: 'Roboto-Regular',
            marginBottom: 0,
          }}
          value={postText}
          onChangeText={(content) => setPostText(content)}
        />
        {uploading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#45A4F9" />
          </View>
        ) : postText.replace(/\s/g, '').length !== 0 ? (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#2e64e515',
              borderRadius: 5,
              padding: 10,
            }}
            onPress={handleUpload}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#45A4F9',
              }}>
              Post
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          activeOpacity={3}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#2e64e515',
              borderRadius: 5,
              padding: 10,
            }}
            >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#4657',
              }}>
              Post
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FloatingAction
        actions={actions}
        color="#45A4F9"
        dismissKeyboardOnPress
        overlayColor="rgba(0,0,0,0.19)"
        onPressItem={(name) => {
          if (name === 'camera') {
            LauchCamera();
          } else {
            choosePhotoFromLibrary();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  PostInput: {
    marginVertical: padding + height / 40,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    color: 'white',
    width: Dimensions.get('window').width - 120,
    borderRadius: 12,
  },
  UploadImage: {
    width,
    height: 500,
    marginHorizontal: 30,
    marginVertical: 30,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
export default memo(PostScreen)