import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import TomatoxVideo from '../../components/tomatox-video/tomatox-video';
import TomatoxDrawer from '../../components/tomatox-drawer/tomatox-drawer';
import {useRoute} from '@react-navigation/native';
import {TOMATOX_THEME} from '../../utils/theme';
import {useNavigation} from '@react-navigation/native';
import {insertOrUpdateData, queryData} from '../../utils/storage/storage';
import {TABLE_NAME} from '../../utils/storage/table-define';
import {convertSecondToTime} from '../../utils/time-converter';

const style = StyleSheet.create({
    playerWrapper: {
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default function () {
    const navigation = useNavigation();
    const {params} = useRoute();
    const [resource, setResource] = useState<IPlayResource|IPlayHistoryResource|IPlayCollectResource>(params as any);
    const [curPlay, setCurPlay] = useState(resource.playList.index[0]);
    const init = useRef(true)

    useEffect(() => {
        const historyResource = queryData(TABLE_NAME.TOMATOX_HISTORY, resource.id) as IPlayHistoryResource|undefined
        if (historyResource) {
            setCurPlay(historyResource.historyPlayKey)
            setResource(historyResource)
        }
    }, [])

    const playNext = (noNext: () => void) => {
        init.current = false
        const idx = resource.playList.index.indexOf(curPlay);
        if ( idx < resource.playList.index.length - 1) {
            setCurPlay(resource.playList.index[idx + 1]);
        } else {
            noNext();
        }
    };

    const generateHistoryDesc = (date: number, key: string) => {
        return `播放至 ${key} ${convertSecondToTime(date, date)}`;
    };

    const writeHistoryRecord = (playPos: number) => {
        insertOrUpdateData(TABLE_NAME.TOMATOX_HISTORY, {
            ...resource,
            collectDate: undefined,
            historyPlayDate: Date.now(),
            historyPlayDesc: generateHistoryDesc(playPos, curPlay),
            historyPlayKey: curPlay,
            historyPlayTime: Math.floor(playPos),
        });
    };

    return (
        <View style={style.playerWrapper}>
            <TomatoxVideo
                src={resource.playList.mapper[curPlay]}
                // @ts-ignore
                lastSeek={init.current ? resource.historyPlayTime : undefined}
                playNext={playNext}
                onBack={writeHistoryRecord}
                navigation={navigation}
            />
            <TomatoxDrawer resource={resource} curPlay={curPlay} changePlay={key => {init.current = false; setCurPlay(key)}}/>
        </View>
    );
}
