import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextInputSubmitEditingEventData,
    View
} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {queryLive} from '../../utils/request';
import TomatoxVideo from '../../components/tomatox-video/tomatox-video';
import {useFocusEffect, useNavigation} from '@react-navigation/native'

export default function live() {
    const liveResAll = useRef<ILiveResource[]>([])
    const [liveRes, setLiveRes] = useState<ILiveResource[]>([]);
    const [src, setSrc] = useState('');
    const [sourceLoaded, setSourceLoaded] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        queryLive().then(res => {
            const result = res as ILiveResource[]
            liveResAll.current = result;
            setLiveRes(result)
            setSourceLoaded(true)
        });
    }, []);

    const searchLiveRes = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        setLiveRes(liveResAll.current.filter(item => item.sourceName.toLowerCase().includes(e.nativeEvent.text.toLowerCase())))
    }

    return (
        <View style={style.fullWrapper}>
            <TomatoxVideo src={src} playNext={() => {}} navigation={navigation} />
            <View style={style.contentWrapper}>
                <TextInput
                    style={style.searchBar}
                    placeholder={'搜索直播频道'}
                    placeholderTextColor={TOMATOX_THEME.DISABLED_FONT_COLOR}
                    onSubmitEditing={searchLiveRes}
                    returnKeyType={'search'}
                />
                {
                    sourceLoaded ?
                        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                            <View style={style.liveList}>
                                {liveRes.map(item => (
                                    <Text
                                        onPress={() => setSrc(item.src)}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}
                                        style={[style.liveItem, item.src === src ? style.liveItemActive : undefined]}
                                        key={item.sourceName}
                                    >
                                        {item.sourceName}
                                    </Text>
                                ))}
                                <Text
                                    style={style.liveItemEmpty}
                                >
                                </Text>
                            </View>
                        </ScrollView>:
                        <Text style={style.loadingText}>正在加载数据...</Text>
                }
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    fullWrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    contentWrapper: {
        flex: 1,
        padding: 15,
    },
    searchBar: {
        width: '100%',
        height: 35,
        backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
        borderRadius: 30,
        fontSize: 14,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    liveList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    liveItem: {
        width: '45%',
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: TOMATOX_THEME.FONT_COLOR,
        color: TOMATOX_THEME.FONT_COLOR,
        paddingLeft: 15,
    },
    liveItemActive: {
        color: TOMATOX_THEME.THEME_COLOR,
        borderLeftColor: TOMATOX_THEME.THEME_COLOR,
    },
    liveItemEmpty: {
        width: '45%',
        marginBottom: 10,
    },
    loadingText: {
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
        width: '100%',
        textAlign: "center"
    }
});
