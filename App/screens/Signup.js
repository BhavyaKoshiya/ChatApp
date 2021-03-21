import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { userIcon, lockIcon, emailIcon, newUserIcon, } from '../assets/icon/index';
import { InputWithIcon } from '../Component/Inputs';
import auth, { firebase } from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';



export default function Signup({ navigation }) {

    useEffect(() => {

        //const userRef = database().ref('/users');

    }, [])

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const addData = () => {
            let dataToSave = {
                UserID: firebase.auth().currentUser.uid,
                Email: email,
                Name: name,
                ProfilePic:'https://bit.ly/3unMJ7Z',
                Mobile: '',
                Gender: '',
                InstaID: '',
                Address: '',
            };
            database()
                .ref('users/' + firebase.auth().currentUser.uid)
                .update(dataToSave)
                .catch(e => {
                    console.log(e);
                });
    };


    const createUser = async () => {
        try {
            let response = await auth().createUserWithEmailAndPassword(
                email,
                password
            )
            if (response && response.user) {

                addData();

                console.log("Success:", "Account created successfully")
                navigation.navigate('Profile');

            }
        } catch (e) {
            //console.error('error: ', e.message)
            Alert.alert('Error', e.message)
        }
    }

    const matchPassword = () => {
        if (password == confirmPassword) {
            createUser();

        } else {
            Alert.alert('Error', 'Password does not match!')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View>
                    <View style={{ padding: 20, marginTop: '10%', }}>
                        <Text style={styles.titleText}>Signup</Text>
                    </View>

                    <InputWithIcon
                        placeholder='Full Name'
                        source={newUserIcon}
                        selectionColor={'#ea8478'}
                        iconStyle={{ tintColor: '#595959', width: 15, height: 15 }}
                        onChangeText={text => setName(text)}
                        contentContainerStyle={{ backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#ea8478' }}
                    />
                    <View style={styles.spaceDivider} />
                    <InputWithIcon
                        placeholder='Email Address'
                        source={emailIcon}
                        caretHidden
                        keyboardType='email-address'
                        iconStyle={{ tintColor: '#595959', width: 15, height: 15 }}
                        onChangeText={text => setEmail(text)}
                        contentContainerStyle={{ backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#ea8478' }}
                    />
                    <View style={styles.spaceDivider} />
                    <InputWithIcon
                        placeholder='Password'
                        source={lockIcon}
                        selectionColor={'#ea8478'}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                        iconStyle={{ tintColor: '#595959' }}
                        contentContainerStyle={{ backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#ea8478' }}
                    />
                    <View style={styles.spaceDivider} />
                    <InputWithIcon
                        placeholder='Confirm Password'
                        source={lockIcon}
                        selectionColor={'#ea8478'}
                        secureTextEntry={true}
                        onChangeText={text => setConfirmPassword(text)}
                        iconStyle={{ tintColor: '#595959' }}
                        contentContainerStyle={{ backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: '#ea8478' }}
                    />

                    <View style={{ height: 20 }} />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={matchPassword}
                    //    onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={{ alignSelf: "center", textTransform: "uppercase", fontSize: 20, color: 'white' }}>Signup</Text>
                    </TouchableOpacity>
                    <View style={styles.spaceDivider} />

                    <TouchableOpacity
                        style={styles.button, { backgroundColor: 'transparent' }}
                    >
                        <Text style={{ alignSelf: "flex-start", paddingHorizontal: 10, color: '#595959' }}>Forget Password ?</Text>
                    </TouchableOpacity>
                    <View style={styles.spaceDivider} />


                </View>
            </View>

            <View style={{ flex: .2, justifyContent: 'flex-end' }}>

                <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 20 }}>
                    <Text style={{ color: '#959595' }}> Already a member? </Text>

                    <TouchableOpacity
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={{ color: '#102e9c' }}> Login now</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 40,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#595959'
    },
    form: {
        padding: 20,
        flex: 1,
        justifyContent: 'center'
    },
    spaceDivider: {
        height: 15
    },
    button: {
        backgroundColor: '#ea8478',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30
    }

});

