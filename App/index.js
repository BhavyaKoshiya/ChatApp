import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Orientation from 'react-native-orientation';
import Home from "./screens/Home";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import Splash from './screens/Splash';

import EditProfile from './screens/EditProfile';
import Chat from './screens/Chat';


const Stack = createStackNavigator();


export default function Index() {

    useEffect(() => {

        Orientation.lockToPortrait();

    }, [])


    return (

        <NavigationContainer>

            <Stack.Navigator
                headerMode='none'

            >
                <Stack.Screen name="Splash" component={Splash} />

                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="Chat" component={Chat} />



            </Stack.Navigator>



        </NavigationContainer >
    );
}
