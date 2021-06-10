import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function tomatoxCard(props: { data: IplayResource, navigation: any }) {
    const {navigate} = props.navigation;
    return (
        <TouchableOpacity style={style.card} activeOpacity={1} onPress={() => navigate('Player', props.data)}>
            <Image source={{uri: props.data.picture}} style={style.cardImg} resizeMode={'cover'} />
            <Text style={style.cardName} numberOfLines={1} ellipsizeMode={'tail'}>{props.data.name}</Text>
            <Text style={style.cardDesc} numberOfLines={1} ellipsizeMode={'tail'}>{props.data.actor || '未知'}</Text>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    card: {
        width: '33.333%',
        height: 160,
        padding: 7,
    },
    cardImg: {
        width: '100%',
        height: 110,
        borderRadius: 5,
    },
    cardName: {
        color: '#f1f1f1',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 2,
    },
    cardDesc: {
        color: '#cecdcd',
        fontSize: 10,
        width: '100%',
    },
});
