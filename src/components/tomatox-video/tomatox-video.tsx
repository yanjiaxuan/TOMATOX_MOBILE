import React from 'react';
import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';

const style = StyleSheet.create({
    videoWrapper: {
        width: '100%',
        height: 250,
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    videoControl: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: 250,
    },
    backBtn: {
        color: '#f1f1f1',
        left: 10,
        top: 8,
        fontSize: 27,
    },
});

export default function (props: {src: string, back: () => void}) {

    return (
        <View style={style.videoWrapper}>
            <View style={style.videoControl}>
                <Icon name={'chevron-left'} style={style.backBtn} onPress={props.back} />
            </View>
            <Video source={{uri: props.src}}
                   style={style.video}
                   resizeMode={'contain'}
            />
        </View>
    );

}
