import React, {useCallback, useState} from 'react';
import {
    Image,
    ListView,
    ScrollView,
    SectionList,
    SectionListData,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import {TOMATOX_THEME} from "../../utils/theme";
import {useFocusEffect} from "@react-navigation/native";
import {queryAll} from "../../utils/storage/storage";
import {TABLE_NAME} from "../../utils/storage/table-define";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useNavigation} from '@react-navigation/native'
import {convertSecondToTime, convertTimestampToDate} from "../../utils/time-converter";

const ONE_DAY = 24 * 3600 * 1000
export default function () {
    const [resourceSections, setResourceSections] = useState<SectionListData<IPlayHistoryResource, any>[]>([])
    const {navigate} = useNavigation()
    const queryResource = useCallback(() => {
        StatusBar.setBackgroundColor(TOMATOX_THEME.HIGHLIGTH_BACKGROUND_COLOR)
        const historyResources = queryAll(TABLE_NAME.TOMATOX_HISTORY) as IPlayHistoryResource[]
        historyResources.sort((a, b) => b.historyPlayDate - a.historyPlayDate)
        const now = Date.now()
        const today = now - now % ONE_DAY
        const yesterday = today - ONE_DAY
        setResourceSections([
            {title: '今天', data: historyResources.filter(item => item.historyPlayDate >= today)},
            {title: '昨天', data: historyResources.filter(item => item.historyPlayDate >= yesterday && item.historyPlayDate < today)},
            {title: '更早', data: historyResources.filter(item => item.historyPlayDate < yesterday)}
        ])

        return () => StatusBar.setBackgroundColor(TOMATOX_THEME.BACKGROUND_COLOR)
    }, []);
    useFocusEffect(queryResource);

    return (
        <View style={style.fullWrapper}>
            <View style={style.header}>
                <Text style={style.headerText}>历史记录</Text>
            </View>
            <SectionList
                style={style.content}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                sections={resourceSections}
                renderSectionHeader={({section: { title }}) => (
                    <Text style={{...style.contentTitle, marginTop: title === '今天' ? 0 : 10}}>
                        {title}
                    </Text>
                )}
                renderItem={({item}) => (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigate('Player', item)}>
                        <View style={style.historyItem}>
                            <Image source={{uri: item.picture}} resizeMode={"cover"} style={style.image} />
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
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
        backgroundColor: TOMATOX_THEME.HIGHLIGTH_BACKGROUND_COLOR,
    },
    headerText: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 10
    },
    contentTitle: {
        fontSize: 14,
        marginBottom: 10
    },
    historyItem: {
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
        borderBottomWidth: 1,
        paddingTop: 8,
        paddingBottom: 8
    },
    image: {
        width: 100,
        height: '100%',
        borderRadius: 4,
        marginRight: 10
    },
    historyItemTextWrapper: {
        flex: 1,
        height: '100%',
        flexDirection: "column",
        justifyContent: "space-between",
    },
    historyItemTitle: {
        fontSize: 13,
        color: TOMATOX_THEME.FONT_COLOR
    },
    historyItemDesc: {
        fontSize: 11,
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR
    }
});
