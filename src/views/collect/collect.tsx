import React, {useCallback, useState} from 'react';
import {TABLE_NAME} from '../../utils/storage/table-define';
import {queryAll} from '../../utils/storage/storage';
import TomatoxFlatList from '../../components/tomatox-flat-list/tomatox-flat-list';
import {StyleSheet, View, Text} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {useFocusEffect} from '@react-navigation/native';
import TomatoxHeader from '../../components/tomatox-header/tomatox-header';

export default function Collect() {
    const [collectRes, setCollectRes] = useState<IPlayCollectResource[]>([]);

    const queryResource = useCallback(() => {
        setCollectRes((queryAll(TABLE_NAME.TOMATOX_COLLECT) as IPlayCollectResource[])
            .sort((a, b) =>  b.collectDate - a.collectDate));
    }, []);
    useFocusEffect(queryResource);

    return (
        <View style={style.fullWrapper}>
            <TomatoxHeader title={'我的收藏'} />
            <TomatoxFlatList loadMore={() => {}} data={collectRes} haveMoreData={false} />
        </View>
    );
}

const style = StyleSheet.create({
    fullWrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
});
