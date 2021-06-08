import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

export default function (props: any) {
    const { params } = props.navigation.state;
    return (
        <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
            <View>
                <Text>player page</Text>
                <Text>{params.name}</Text>
            </View>
        </TouchableOpacity>
    );
}
