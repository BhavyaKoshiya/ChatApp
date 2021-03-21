import React, { useState } from 'react';
import { Alert, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { userIcon, lockIcon, emailIcon, } from '../assets/icon/index';
import { InputWithIcon } from '../Component/Inputs';
import auth from '@react-native-firebase/auth';

export default function Login({ navigation }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const doSingIn = async () => {
    try {
      let response = await auth().signInWithEmailAndPassword(email, password)
      if (response ) {
        console.log("Success:", "Logged In successfully");
        navigation.navigate('Home');
      }
    } catch (e) {
      Alert.alert('Error',e.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View>
          <View style={{ padding: 20, marginTop: '10%', }}>
            <Text style={styles.titleText}>Login</Text>
          </View>
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


          <TouchableOpacity
            style={styles.button}
            onPress={doSingIn}
          >
            <Text style={{ alignSelf: "center", textTransform: "uppercase", fontSize: 20, color: 'white' }}>Log in</Text>
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
          <Text style={{ color: '#959595' }}> Not a member? </Text>

          <TouchableOpacity
            style={{ backgroundColor: 'transparent' }}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={{ color: '#102e9c' }}> Sign up now</Text>
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

