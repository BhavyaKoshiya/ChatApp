/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import auth, { firebase } from "@react-native-firebase/auth"
import App from './App/index';
import Login from './App/screens/Login';



AppRegistry.registerComponent(appName, () => App);


// let user = firebase.auth().currentUser;
// if (user) {
//     AppRegistry.registerComponent(appName, () => App);

// } else {
//     AppRegistry.registerComponent(appName, () => Login);
// }

