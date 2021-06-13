import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TOMATOX_THEME} from "../../utils/theme";

export default function tomatoxCard(props: { data: IplayResource }) {
    const {navigate} = useNavigation();
    return (
        <TouchableOpacity style={style.card} activeOpacity={1} onPress={() => navigate('Player', props.data)}>
            <Image
                source={props.data.picture ? {uri: props.data.picture} : require('../../images/png/loading.png')}
                style={style.cardImg}
                resizeMode={'cover'}
            />
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
        backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
        borderRadius: 5,
    },
    cardName: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 12,
        marginTop: 4,
        marginBottom: 2,
    },
    cardDesc: {
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
        fontSize: 10,
        width: '100%',
    },
});
