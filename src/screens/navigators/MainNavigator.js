import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import BottomNavigator from './BottomNavigator';
import Login from '../Login';
import Register from '../Register';
import ChatRoom from '../Chat/ChatRoom';
import { authSuccess } from '../../redux/actions/auth';


const Stack = createStackNavigator();

export default function MainNavigator() {

    const dispatch = useDispatch()

    const getData = async () => {
        try {   
            const username = await AsyncStorage.getItem('username');
            const token = await AsyncStorage.getItem('token');
            dispatch(authSuccess(username, token));
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(() => {
        getData();
    }, [])

    const token = useSelector(state => state.authReducer);

    return (
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName={ token ? 'Main' : 'Login'}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Main" component={BottomNavigator} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}