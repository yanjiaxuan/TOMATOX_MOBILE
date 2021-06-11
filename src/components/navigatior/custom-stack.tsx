import React from "react";
import CustomTab from './custom-tab';
import Player from '../../views/player/player';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function customStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode={'none'} mode={'card'} >
                <Stack.Screen name={'Main'} component={CustomTab} />
                <Stack.Screen name={'Player'} component={Player} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
