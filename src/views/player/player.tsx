import React from 'react';
import {Text, View} from 'react-native';

export default function (props: any) {
    const { params } = props.navigation.state;
    return (
        <View>
            <Text>player page</Text>
            <Text>{params.name}</Text>
        </View>
    );
}
