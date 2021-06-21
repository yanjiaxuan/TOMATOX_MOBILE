import React, {useCallback, useState} from 'react';
import {TABLE_NAME} from '../../utils/storage/table-define';
import {queryAll} from '../../utils/storage/storage';
import TomatoxFlatList from '../../components/tomatox-flat-list/tomatox-flat-list';
import {StyleSheet, View, Text} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {useFocusEffect} from '@react-navigation/native';

export default function collect() {
    const [collectRes, setCollectRes] = useState<IPlayCollectResource[]>([]);

    const queryResource = useCallback(() => {
        setCollectRes((queryAll(TABLE_NAME.TOMATOX_COLLECT) as IPlayCollectResource[])
            .sort((a, b) =>  b.collectDate - a.collectDate));
    }, []);
    useFocusEffect(queryResource);

    return (
        <View style={style.fullWrapper}>
            <View style={style.header}>
                <Text style={style.headerText}>我的收藏</Text>
            </View>
            <TomatoxFlatList loadMore={() => {}} data={collectRes} haveMoreData={false} />
        </View>
    );
}

const style = StyleSheet.create({
    fullWrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
    },
    headerText: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
