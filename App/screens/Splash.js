import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, FlatList, Image } from "react-native";
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
import { emailIcon, myImage, } from "../assets/icon/index";
import { GiftedChat } from 'react-native-gifted-chat'



export default function Splash({ navigation }) {

    useEffect(() => {

        let user = firebase.auth().currentUser;
        if (user) {
            
           navigation.navigate('Home')

        } else {
            navigation.navigate('Login')
        }
    })

    return null
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
    }
});

