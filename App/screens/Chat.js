import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, } from "react-native";
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
import { leftIcon, sendIcon, } from "../assets/icon/index";
import { InputWithIcon } from '../Component/Inputs';



export default function Chat({ navigation, route }) {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomID, setRoomID] = useState('');


    let user = firebase.auth().currentUser;
    let item = route.params.item;
    let sender = user.uid;
    let receiver = item.UserID;
    let responce;
    let Rid;
    const msgRef = database().ref('/Messages/' + roomID);
    //const flatlistRef = useRef();
    //  console.log(flatlistRef)
    useEffect(() => {
        //console.log(new Date().getTime());

        //Room
        checkRoom();
        //Messages
        // getMessage();
        return () =>
            database().ref('/Messages/' + Rid)
                .off('child_added', responce);

    }, [])

    const checkRoom = () => {
        let room = database()
            .ref('ChatRoom/' + item.UserID + '/' + user.uid)
            .once('value')
            .then(snapshot => {

                if (snapshot.val() == null) {
                    let key = database().ref().push().key;
                    //Sender = user.uid
                    //Receiver = item.UserID
                    let room = database()
                        .ref('ChatRoom/' + user.uid + '/' + item.UserID)
                        .once('value')
                        .then(snapshot => {
                            // console.log('User data: ', snapshot.val());

                            if (snapshot.val() == null) {
                                database()
                                    .ref('ChatRoom/' + item.UserID)
                                    .child(user.uid)
                                    .update({ RoomID: key })
                                    .catch(e => {
                                        console.log(e);
                                    });
                                setRoomID(key)
                            } else {
                                Rid = snapshot.val().RoomID;
                                setRoomID(snapshot.val().RoomID)
                                getMessage(Rid);
                                //console.log(roomID);
                            }
                        }).catch(e => { console.log("error", e) })
                } else {
                    Rid = snapshot.val().RoomID;
                    setRoomID(snapshot.val().RoomID)
                    getMessage(Rid);
                    //console.log(roomID);
                }
            }).catch(e => { console.log("error", e) })

    }

    const getMessage = (Rid) => {

        //setMessages([]);

        responce = database().ref('/Messages/' + Rid).on('value', (snapshot) => {
            setMessages([]);
            snapshot.forEach(function (childSnapshot) {
                setMessages((messages) => [ childSnapshot.val(),...messages]);
                // console.log(messages)
            });
            //console.log(messages);
        });
        //console.log(responce);

        // console.log(messages);
    }

    const sendMessage = () => {

        if (message != '') {
            let MsgID = database().ref().push().key;
            let dataToSave = {
                Message: message,
                Sender: sender,
                Time: new Date().getTime(),
            };
            database()
                .ref('Messages/' + roomID + '/' + MsgID)
                .set(dataToSave)
                .catch(e => {
                    console.log(e);
                });
            setMessage('');
            //getMessage();
        }

    }

    const formatTime = (timeStamp) => {

        var t = new Date(timeStamp);
        var hours = t.getHours();
        var minutes = t.getMinutes();
        var format = t.getHours() >= 12 ? 'PM' : 'AM';

        // Find current hour in AM-PM Format 
        hours = hours % 12;

        // To display "0" as "12" 
        hours = hours ? hours : 12;

        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes + ' ' + format;

        // return ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + ' ' + newformat;
        // console.log(formatted);

    }

    const renderItem = ({ item }) => (

        <View style={{  transform: [{ scaleY: -1 }] }}>
            { item.Message != '' ?
                <View
                    style={
                        item.Sender == sender
                            ? styles.sentMessage : styles.receivedMessage
                    }
                >
                    <Text>{item.Message}</Text>
                    <View style={{ height: 3 }} />
                    <Text style={styles.timeStamp}>{formatTime(item.Time)}</Text>
                </View >
                : null
            }
        </View >

    )


    return (
        <View style={{ flex: 1 }} >
            <View style={{ height: 60, backgroundColor: '#ea8478', justifyContent: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity
                        style={{ marginHorizontal: 10, height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={leftIcon} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#fff', }} />
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        <Image
                            //source={{ uri: 'https://placeimg.com/300/300/people' }}
                            source={{ uri: route.params.item.ProfilePic }}
                            style={styles.image}
                        />
                    </View>

                    <View style={{ padding: 10 }}>
                        <Text style={styles.name}>{route.params.item.Name}</Text>
                    </View>

                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10,paddingTop:0 }}>

                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    style={{  transform: [{ scaleY: -1 }] }}
                />



                <View style={{ flexDirection: 'row', paddingTop:10 }}>
                    <View style={{ width: '85%' }}>
                        <InputWithIcon
                            placeholder='Type a Message'
                            selectionColor={'#ea8478'}
                            value={message}
                            iconStyle={{ tintColor: '#595959', width: 15, height: 15 }}
                            onChangeText={text => setMessage(text)}
                            contentContainerStyle={{ backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#ea8478', height: 50, }}
                        />
                    </View>
                    <View style={{ width: 5 }} />
                    <TouchableOpacity
                        style={{ height: 50, width: 50, backgroundColor: '#ea8478', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}
                        onPress={sendMessage}
                    >
                        {/* <Text>SEND</Text> */}
                        <Image source={sendIcon} style={{ tintColor: '#fff', width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({

    sentMessage: {
        backgroundColor: '#f1aaa3',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 1
    },
    receivedMessage: {
        backgroundColor: '#ccccce',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 1
    },
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
        fontSize: 24,
        //  fontWeight: 'bold',
        color: '#fff'
    },
    divider: {
        height: 1,
        width: '83%',
        alignSelf: 'flex-end',
        backgroundColor: '#595959',
    },
    timeStamp: {
        fontSize: 8,
        color: '#595959',
        alignSelf: 'flex-end'
    },
});

