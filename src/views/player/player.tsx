import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import TomatoxVideo from '../../components/tomatox-video/tomatox-video'
import TomatoxDrawer from '../../components/tomatox-drawer/tomatox-drawer'

const style = StyleSheet.create({
    playerWrapper: {
        backgroundColor: '#2b2b2b',
        height: '100%'
    }
})

export default function (props: any) {
    const { params } = props.navigation.state;
    const resource = params as IplayResource
    const [curPlay, setCurPlay] = useState([...resource.playList.keys()][0])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', goBack)
        return () => BackHandler.removeEventListener('hardwareBackPress', goBack)
    })

    function goBack() {
        props.navigation.goBack()
        return true
    }

    return (
        <View style={style.playerWrapper}>
            <TomatoxVideo
                src={resource.playList.get(curPlay)!}
                back={() => { props.navigation.goBack() }}
            />
            <TomatoxDrawer resource={resource} curPlay={curPlay} changePlay={key => setCurPlay(key)}/>
        </View>
    );
}
