import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import TomatoxVideo from '../../components/tomatox-video/tomatox-video';
import TomatoxDrawer from '../../components/tomatox-drawer/tomatox-drawer';
import {useNavigation, useRoute} from '@react-navigation/native';

const style = StyleSheet.create({
    playerWrapper: {
        backgroundColor: '#2b2b2b',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default function (props: any) {
    const navigation = useNavigation();
    const {params} = useRoute();
    const resource = params as IplayResource;
    const [curPlay, setCurPlay] = useState(resource.playList.index[0]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', goBack);
        return () => BackHandler.removeEventListener('hardwareBackPress', goBack);
    });

    function goBack() {
        navigation.goBack();
        return true;
    }

    const playNext = (noNext: () => void) => {
        const idx = resource.playList.index.indexOf(curPlay);
        if ( idx < resource.playList.index.length - 1) {
            setCurPlay(resource.playList.index[idx + 1]);
        } else {
            noNext();
        }
    };

    return (
        <View style={style.playerWrapper}>
            <TomatoxVideo
                src={resource.playList.mapper[curPlay]}
                back={() => { props.navigation.goBack(); }}
                playNext={playNext}
            />
            {
                <TomatoxDrawer resource={resource} curPlay={curPlay} changePlay={key => setCurPlay(key)}/>
            }
        </View>
    );
}
