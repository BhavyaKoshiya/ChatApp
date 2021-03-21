import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, FlatList, Image, ToastAndroid, } from "react-native";
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
import { closeIcon, emailIcon, myImage, userIcon, } from "../assets/icon/index";
import Modal from 'react-native-modal';

export default function Home({ navigation }) {

    const [authenticated, setAuthenticated] = useState(true)
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('https://bit.ly/3unMJ7Z');
    const [myProfilePic, setMyProfilePic] = useState('https://bit.ly/3unMJ7Z');

    useEffect(() => {
        const userRef = database().ref('/users');

        isTheUserAuthenticated();
        setUsers([]);
        database()
            .ref('/users/')
            .once('value')
            .then(snapshot => {
                let Data = snapshot.val();
                //console.log('User data: ', Data);
            });

        const Loading = userRef.on('value', (snapshot) => {
            setUsers([]);
            snapshot.forEach(function (childSnapshot) {
                setUsers((users) => [...users, childSnapshot.val()]);
            });
            //console.log(users);
        });

    }, [])


    const isTheUserAuthenticated = () => {
        try {
            let user = firebase.auth().currentUser;
            if (user) {
                setAuthenticated(true);
                database()
                    .ref('/users/' + user.uid)
                    .once('value')
                    .then(snapshot => {
                        let Data = snapshot.val();
                        setMyProfilePic(Data.ProfilePic)
                        setAuthenticated(true);
                    });
            } else {
                console.log("no user found");
                setAuthenticated(false);
                setUsers([]);
            }
        } catch (e) {
            console.error('error: ', e.message)
        }
    }

    const renderItem = ({ item }) => (
        <View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    // onPress={}
                    onPress={() => setModalVisible(!modalVisible)}
                    onPressIn={() => setName(item.Name)}
                    onPressOut={() => setProfilePic(item.ProfilePic)}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.ProfilePic }}
                            style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Chat', { item })}
                    //onPressIn={() => chatRoom(item)}
                    style={{ flex: 1 }}
                >
                    <View style={{ padding: 10 }}>
                        <Text style={styles.name}>{item.Name}</Text>
                        <Text style={{ color: '#595959' }}>{item.Email}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

        </View>
    )

    return (
        <View style={{ flex: 1 }} >
            <View style={{ height: 60, backgroundColor: '#ea8478', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                <Text style={styles.titleText}>Chat App</Text>
                <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 50, borderRadius: 50, borderColor: '#fff', borderWidth: 1 }}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image source={{ uri: myProfilePic }} style={{ height: 45, width: 45, borderRadius: 40 }} />
                </TouchableOpacity>
            </View>

            <View style={{ height: 2, backgroundColor: 'lightgrey' }} />

            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10 }}>

                <FlatList
                    data={users}
                    keyExtractor={item => item.UserID}
                    renderItem={renderItem}
                />

            </View>

            <Modal
                animationType="slide"
                hasBackdrop={true}
                visible={modalVisible}
                useNativeDriver={true}
                // backdropOpacity={0.7}
                // transparent={true} 
                // backdropColor="rgba(0,0,0,0.5)"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', margin: 0 }}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: '#ea8478', height: 30, justifyContent: 'center', borderRadius: 5, paddingHorizontal: 5 }}>
                            <Text style={styles.modalText}>{name}</Text>
                        </View>
                        <View style={{ height: 5 }} />
                        <Image
                            source={{ uri: profilePic }}
                            style={{ height: 300, width: 300, borderRadius: 5, borderWidth: 2, borderColor: '#ea8478' }}
                        />
                    </View>
                </View>
            </Modal>

        </View>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ea8478',
        borderRadius: 30,
        alignSelf: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30
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
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#595959',
        borderRadius: 85,
    },
    image: {
        height: 45,
        width: 45,
        borderRadius: 45,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    divider: {
        height: 1,
        width: '83%',
        alignSelf: 'flex-end',
        backgroundColor: '#595959',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
    modalText: {
        fontSize: 20,
        color: '#fff'
    }
});