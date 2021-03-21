import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ToastAndroid } from 'react-native';
import {
  mailIcon, mobileIcon, InstaIcon, newEditIcon, cameraIcon, galleryIcon, leftIcon, genderIcon, addressIcon
} from "../assets/icon/index";
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';


export default function Profile({ navigation }) {

  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [authenticated, setAuthenticated] = useState(true)
  const [isModalVisible, setModalVisible] = useState(false);
  //const [URL, setURL] = useState('https://bit.ly/3unMJ7Z');

  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [insta, setInsta] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('https://bit.ly/3unMJ7Z');

  useEffect(() => {

    isTheUserAuthenticated();

  }, [userId])

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  const pickFromGallery = () => {
    try {

      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true
      }).then(image => {
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        //console.log(imageUri);
        console.log(imageUri);
      }).catch(e => {console.log(e)});;
    } catch (error) {
      console.log(error);
    }


  }
  const pickFromCamera = async () => {
    try {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        console.log(imageUri);
      }).catch(e => {console.log(e)});;
    } catch (error) {
      console.log(error);
    }



  }

  const uploadImage = async (imageUri) => {
    if (imageUri == null) {
      return null;
    }
    const uploadUri = imageUri;
    let filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

    const storageRef = storage().ref(`Photos/Profile/${userId}`);
    const task = storageRef.putFile(uploadUri);

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setProfilePic(url);
    } catch (e) {
      console.log(e);
      return null;
    }

  };

  const isTheUserAuthenticated = () => {
    try {

      let user = firebase.auth().currentUser;

      if (user) {
        setUserId(user.uid)
        setEmail(user.email)
        database()
          .ref('/users/' + userId)
          .once('value')
          .then(snapshot => {
            let Data = snapshot.val();
            setName(Data.Name)
            setMobile(Data.Mobile)
            setGender(Data.Gender)
            setInsta(Data.InstaID)
            setAddress(Data.Address)
            setProfilePic(Data.ProfilePic)
            setAuthenticated(true);
          });
      } else {
        console.log("no user found");
        setAuthenticated(false);
      }
    } catch (e) {
      console.error('error: ', e.message)

    }
  }

  const logOut = async () => {

    await firebase.auth().signOut();
    {
      setUserId('')
      setEmail('')
      setName('')
      console.log('Logged Out!');
      setAuthenticated(false)
    }
    navigation.navigate('Login')

  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={{ height: 60, backgroundColor: '#ea8478', justifyContent: 'center',width:'100%', alignItems:'center', }}> */}
      <View style={styles.oval}>
        <View style={{ marginTop: 225, width: '100%' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start', marginLeft: 60, marginTop: -10 }}
            onPress={() => navigation.goBack()}
          >
            <Image source={leftIcon} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#fff', }} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginTop: -25 }}>
            <Text style={styles.titleText}>Profile</Text>
            <View style={{ height: 30 }} />
            <View style={styles.imageContainer}>
              <Image
                //source={myImage}
                source={{ uri: profilePic }}
                style={styles.image}
              />
            </View>
          </View>
        </View>

      </View>
      <TouchableOpacity
        style={{ backgroundColor: '#fff', height: 33, width: 33, alignItems: 'center', justifyContent: 'center', borderRadius: 30, alignSelf: 'center', marginTop: 10, marginLeft: 75 }}
        onPress={() => { toggleModal() }}
      >
        <Image source={newEditIcon} style={{ height: 30, width: 30, resizeMode: 'contain', tintColor: '#ea8478', }} />
      </TouchableOpacity>

      <View style={{ padding: 10, }}>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          {
            authenticated ? <Text style={styles.name}>{name}</Text> : <Text style={styles.name}>No User Found</Text>
          }
        </View>
        <View style={{ padding: 20 }}>

          <View style={styles.fieldContainer}>
            <Image source={mailIcon} style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{email}</Text>
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.fieldContainer}>
            <Image source={mobileIcon} style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{mobile}</Text>
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.fieldContainer}>
            <Image source={genderIcon} style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{gender}</Text>
          </View>
          <View style={{ height: 10 }} />

          <View style={styles.fieldContainer}>
            <Image source={InstaIcon} style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{insta}</Text>
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.fieldContainer}>
            <Image source={addressIcon} style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{address}</Text>
          </View>


        </View>
        <View >

          <View style={{ height: 30 }} />
          {
            authenticated &&

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={{ alignSelf: "center", textTransform: "uppercase", fontSize: 20, color: 'white' }}>Edit Profile</Text>
            </TouchableOpacity>

          }
          <View style={styles.spaceDivider} />
          {
            authenticated &&

            <TouchableOpacity
              style={styles.button}
              onPress={logOut}
            >
              <Text style={{ alignSelf: "center", textTransform: "uppercase", fontSize: 20, color: 'white' }}>LOGOUT</Text>
            </TouchableOpacity>
          }

        </View>
      </View>

      {/* Modal */}
      <Modal isVisible={isModalVisible}
        onBackButtonPress={() => toggleModal()}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        style={{ margin: 0, justifyContent: 'flex-end' }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        backdropOpacity={0.7}
        backdropColor='darkgrey' >
        <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
          <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-evenly' }}>
            <TouchableOpacity
              onPress={() => { toggleModal(), pickFromCamera() }}>
              <View style={{ alignItems: 'center' }}>

                <Image source={cameraIcon} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                <View style={{ height: 5 }} />
                <Text>Pick From Camera</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { toggleModal(), pickFromGallery() }}>
              <View style={{ alignItems: 'center' }}>
                <Image source={galleryIcon} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                <View style={{ height: 5 }} />
                <Text>Pick From Gallery</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: "darkgrey", paddingHorizontal: 20, marginTop: 2, marginBottom: 10, paddingVertical: 10, borderRadius: 20 }}
            onPress={() => { toggleModal() }}>
            <Text style={{ color: '#595959', alignSelf: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    height: 50,
    width: '100%',
    backgroundColor: 'lightgrey'
  },
  fieldIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    paddingHorizontal: 25,
    tintColor: '#595959'
  },
  fieldText: {
    color: '#595959',
    fontSize: 16
  },
  button: {
    backgroundColor: '#ea8478',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20
  },
  spaceDivider: {
    height: 15
  },
  titleText: {
    fontSize: 26,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    height: 100,
    width: 100,
    //marginTop:150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#595959',
    borderRadius: 85,
  },
  image: {
    height: 95,
    width: 95,
    borderRadius: 95,
  },
  name: {
    fontSize: 26,
    color: '#ea8478'
  },
  oval: {
    width: '125%',
    height: 300,
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -150,
    backgroundColor: "#ea8478",
    //transform: [{scaleX: 2 }],
  },
});

