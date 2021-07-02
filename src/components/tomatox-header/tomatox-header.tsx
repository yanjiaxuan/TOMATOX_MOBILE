import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import Icon from 'react-native-vector-icons/Feather';

export default function TomatoxHeader(props: {
    title: string,
    leftBtn?: {
        name: string,
        onPress: () => any
    },
    rightBtn?: {
        name: string,
        onPress: () => any
    }
}) {
    return (
        <View style={style.header}>
            {
                props.leftBtn &&
                    <TouchableOpacity style={style.leftIcon} activeOpacity={0.6} onPress={props.leftBtn.onPress} >
                        <Icon name={props.leftBtn.name} size={22}/>
                    </TouchableOpacity>
            }
            <Text style={style.headerText}>{props.title}</Text>
            {
                props.rightBtn &&
                    <TouchableOpacity style={style.rightIcon} activeOpacity={0.6} onPress={props.rightBtn.onPress}>
                        <Icon name={props.rightBtn.name} size={22}/>
                    </TouchableOpacity>
            }
        </View>
    );
}

const style = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
    },
    headerText: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 16,
        fontWeight: 'bold',
    },
    leftIcon: {
        position: 'absolute',
        left: 15,
        top: 13,
    },
    rightIcon: {
        position: 'absolute',
        right: 15,
        top: 13,
    },
});
