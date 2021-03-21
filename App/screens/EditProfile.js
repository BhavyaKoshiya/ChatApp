import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ToastAndroid, TextInput } from 'react-native';
import {
    mailIcon, mobileIcon, InstaIcon, newEditIcon, cameraIcon, galleryIcon, leftIcon, maleIcon, addressIcon, femaleIcon
} from "../assets/icon/index";
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import { InputWithIcon } from '../Component/Inputs';




export default function EditProfile({ navigation }) {

    const [isModalVisible, setModalVisible] = useState(false);
    // const [URL, setURL] = useState('https://bit.ly/3unMJ7Z');
    const [isMale, setIsMale] = useState(false);
    const [isFemale, setIsFemale] = useState(false);
    const [authenticated, setAuthenticated] = useState(true);
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [insta, setInsta] = useState('');
    const [address, setAddress] = useState('');
    const [profilePic, setProfilePic] = useState('https://bit.ly/3unMJ7Z');
    var Id = firebase.auth().currentUser.uid;


    useEffect(() => {

        isTheUserAuthenticated();
        //console.log(Id);

    }, [userId])

    // const logdata =()=>{

    //     console.log(userId);
    //     console.log(name);
    //     console.log(email);
    //     console.log(mobile);
    //     console.log(gender);
    //     console.log(insta);
    //     console.log(address);
    //     console.log('-----------');

    // }

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
                        if (Data.Gender == 'MALE') {
                            setIsMale(true)
                            setIsFemale(false)
                        } else if (Data.Gender == 'FEMALE') {
                            setIsMale(false)
                            setIsFemale(true)
                        }
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

    const updateProfile = () => {

        let dataToSave = {
            // UserID: Id,
            Name: name,
            Mobile: mobile,
            Gender: gender,
            InstaID: insta,
            Address: address,
            ProfilePic: profilePic,
        };
        database()
            .ref('/users/' + Id)
            .update(dataToSave)
            .catch(e => {
                console.log(e);
            });
            ToastAndroid.show("Profile Updated !", ToastAndroid.SHORT);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    const pickFromGallery = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            //console.log(imageUri);
            uploadImage(imageUri);
        }).catch(e => {console.log(e)});;

    }
    const pickFromCamera = async () => {

        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
        }).then(image => {
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            uploadImage(imageUri);
        }).catch(e => {console.log(e)});;

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

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.oval}>
                <View style={{ marginTop: 225, width: '100%' }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-start', marginLeft: 60, marginTop: -10 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={leftIcon} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#fff', }} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', marginTop: -25 }}>
                        <Text style={styles.titleText}>Edit Profile</Text>
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

                    <TextInput
                        placeholder='Name'
                        allowFontScaling={true}
                        value={name}
                        style={{ color: '#ea8478', fontSize: 26 }}
                        placeholderTextColor='#ea8478'
                        onChangeText={text => setName(text)}
                    />


                </View>
                <View style={{ padding: 20 }}>

                    <InputWithIcon
                        caretHidden
                        placeholder='Email Address'
                        source={mailIcon}
                        selectionColor={'#ea8478'}
                        iconStyle={{ tintColor: '#595959', width: 20, height: 20 }}
                        value={email}
                        editable={false}
                        //onChangeText={text => setEmail(text)}
                        contentContainerStyle={{ backgroundColor: 'lightgrey', borderWidth: 1, borderColor: '#ea8478', height: 50 }}
                    />


                    <View style={{ height: 10 }} />

                    <InputWithIcon
                        placeholder='Mobile No.'
                        source={mobileIcon}
                        keyboardType='phone-pad'
                        selectionColor={'#ea8478'}
                        iconStyle={{ tintColor: '#595959', width: 20, height: 20 }}
                        value={mobile}
                        onChangeText={text => setMobile(text)}
                        contentContainerStyle={{ backgroundColor: 'lightgrey', borderWidth: 1, borderColor: '#ea8478', height: 50 }}
                    />

                    <View style={{ height: 10 }} />

                    <View style={{ flexDirection: 'row' }}>
                        {/* Male */}
                        <TouchableOpacity
                            style={[styles.fieldContainer, { backgroundColor: isMale ? "#ea8478" : "lightgrey" }]}
                            onPress={() => setIsMale(true)}
                            onPressIn={() => setIsFemale(false)}
                            onPressOut={() => setGender('MALE')}

                        >
                            <Image source={maleIcon} style={styles.fieldIcon} />
                            <Text style={styles.fieldText}>Male</Text>
                        </TouchableOpacity>

                        <View style={{ width: 10 }} />

                        {/* Female */}
                        <TouchableOpacity
                            style={[styles.fieldContainer, { backgroundColor: isFemale ? "#ea8478" : "lightgrey" }]}
                            onPress={() => setIsFemale(true)}
                            onPressIn={() => setIsMale(false)}
                            onPressOut={() => setGender('FEMALE')}
                        >
                            <Image source={femaleIcon} style={styles.fieldIcon} />
                            <Text style={styles.fieldText}>Female</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 10 }} />

                    <InputWithIcon
                        placeholder='Instagram Username'
                        source={InstaIcon}
                        selectionColor={'#ea8478'}
                        iconStyle={{ tintColor: '#595959', width: 20, height: 20 }}
                        value={insta}
                        onChangeText={text => setInsta(text)}
                        contentContainerStyle={{ backgroundColor: 'lightgrey', borderWidth: 1, borderColor: '#ea8478', height: 50 }}
                    />

                    <View style={{ height: 10 }} />

                    <InputWithIcon
                        placeholder='Address'
                        source={addressIcon}
                        selectionColor={'#ea8478'}
                        iconStyle={{ tintColor: '#595959', width: 20, height: 20 }}
                        value={address}
                        onChangeText={text => setAddress(text)}
                        contentContainerStyle={{ backgroundColor: 'lightgrey', borderWidth: 1, borderColor: '#ea8478', height: 50 }}
                    />

                </View>
                <View >
                    <View style={{ height: 30 }} />

                    <TouchableOpacity
                        style={styles.button}
                        //onPress={logdata}
                        onPress={updateProfile}
                    >
                        <Text style={{ alignSelf: "center", textTransform: "uppercase", fontSize: 20, color: 'white' }}>Save</Text>
                    </TouchableOpacity>

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
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#ea8478',
        borderWidth: 1,
        backgroundColor: 'lightgrey',
    },
    fieldIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 15,
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

