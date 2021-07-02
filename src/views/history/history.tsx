import React, {useCallback, useState} from 'react';
import {
    Image,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {useFocusEffect} from '@react-navigation/native';
import {queryAll} from '../../utils/storage/storage';
import {TABLE_NAME} from '../../utils/storage/table-define';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {convertTimestampToDate} from '../../utils/time-converter';
import TomatoxHeader from '../../components/tomatox-header/tomatox-header';

const ONE_DAY = 24 * 3600 * 1000;
export default function History() {
    const [resourceSections, setResourceSections] = useState<SectionListData<IPlayHistoryResource, any>[]>([]);
    const {navigate} = useNavigation();
    const queryResource = useCallback(() => {
        const historyResources = queryAll(TABLE_NAME.TOMATOX_HISTORY) as IPlayHistoryResource[];
        historyResources.sort((a, b) => b.historyPlayDate - a.historyPlayDate);
        const now = Date.now();
        const today = now - now % ONE_DAY;
        const yesterday = today - ONE_DAY;
        setResourceSections([
            {title: '今天', data: historyResources.filter(item => item.historyPlayDate >= today)},
            {title: '昨天', data: historyResources.filter(item => item.historyPlayDate >= yesterday && item.historyPlayDate < today)},
            {title: '更早', data: historyResources.filter(item => item.historyPlayDate < yesterday)},
        ]);
    }, []);
    useFocusEffect(queryResource);

    return (
        <View style={style.fullWrapper}>
            <TomatoxHeader title={'历史记录'} />
            <SectionList
                style={style.content}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                sections={resourceSections}
                stickySectionHeadersEnabled={true}
                renderSectionHeader={({section: { title }}) => (
                    <View style={style.contentTitleWrapper}>
                        <Text style={style.contentTitle}>
                            {title}
                        </Text>
                    </View>
                )}
                renderItem={({item}) => (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigate('Player', item)}>
                        <View style={style.historyItem}>
                            <Image source={{uri: item.picture}} resizeMode={'cover'} style={style.image} />
                            <View style={style.historyItemTextWrapper}>
                                <Text style={style.historyItemTitle} numberOfLines={1} ellipsizeMode={'tail'} >
                                    {item.name}
                                </Text>
                                <Text style={style.historyItemDesc} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {convertTimestampToDate(item.historyPlayDate)}
                                </Text>
                                <Text style={style.historyItemDesc} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {item.historyPlayDesc}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const style = StyleSheet.create({
    fullWrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    content: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    contentTitleWrapper: {
        height: 30,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    contentTitle: {
        lineHeight: 30,
        fontSize: 14,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    historyItem: {
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    image: {
        width: 100,
        height: '100%',
        borderRadius: 4,
        marginRight: 10,
    },
    historyItemTextWrapper: {
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    historyItemTitle: {
        fontSize: 13,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    historyItemDesc: {
        fontSize: 11,
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
    },
});
