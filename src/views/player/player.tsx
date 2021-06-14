import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TomatoxVideo from '../../components/tomatox-video/tomatox-video';
import TomatoxDrawer from '../../components/tomatox-drawer/tomatox-drawer';
import {useRoute} from '@react-navigation/native';
import {TOMATOX_THEME} from '../../utils/theme';
import {useNavigation} from '@react-navigation/native'

const style = StyleSheet.create({
    playerWrapper: {
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default function () {
    const navigation = useNavigation()
    const {params} = useRoute();
    const resource = params as IPlayResource;
    const [curPlay, setCurPlay] = useState(resource.playList.index[0]);

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
                playNext={playNext}
                navigation={navigation}
            />
            <TomatoxDrawer resource={resource} curPlay={curPlay} changePlay={key => setCurPlay(key)}/>
        </View>
    );
}
