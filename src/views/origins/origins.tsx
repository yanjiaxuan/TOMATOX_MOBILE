import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import TomatoxHeader from '../../components/tomatox-header/tomatox-header';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import constants from '../../utils/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {changeActiveOrigin, deleteOrigin, queryAllOrigins} from "../../utils/storage/origins-storage";

export default function Origins() {
    const navigation = useNavigation();
    const [originList, setOriginList] = useState<IOrigin[]>([]);
    const [showAddOpt, setShowAddOpt] = useState(false)

    useEffect(() => {
        setOriginList([
            {id: '默认', url: constants.DEFAULT_ORIGIN, active: true, timestamp: 0},
            ...queryAllOrigins()
        ]);
    }, []);

    const delOrigin = (id: string) => {
        setOriginList(originList.filter(item => item.id !== id));
        deleteOrigin(id)
    };

    const chooseOrigin = (id: string) => {
        setOriginList(originList.map(item => { return  {...item, active: item.id === id}}))
        changeActiveOrigin(id)
    };

    return (
        <View style={style.fullWrapper}>
            <TomatoxHeader
                title={'数据源'}
                leftBtn={{ name: 'chevron-left', onPress: navigation.goBack}}
                rightBtn={{name: 'plus', onPress: () => setShowAddOpt(!showAddOpt)}}
            />
            <ScrollView style={style.contentWrapper}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
            >
                {
                    originList.map(item => (
                        <LinearGradient
                            key={item.id}
                            colors={[item.active ? TOMATOX_THEME.THEME_COLOR : TOMATOX_THEME.BACKGROUND_COLOR, TOMATOX_THEME.BACKGROUND_COLOR]}
                            style={style.originItem}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                        >
                            <View style={style.itemTextWrapper} onTouchEnd={() => chooseOrigin(item.id)}>
                                <Text  numberOfLines={1} lineBreakMode={'tail'} style={style.itemId}>{item.id}</Text>
                                <Text  numberOfLines={1} lineBreakMode={'tail'} style={style.itemUrl}>{item.url}</Text>
                            </View>
                            <TouchableOpacity activeOpacity={item.active ? 1 : 0.6}>
                                <Icon name={'trash'} size={17}
                                      style={{width: 30, color: item.active ? TOMATOX_THEME.DISABLED_FONT_COLOR : TOMATOX_THEME.FONT_COLOR}}
                                      onPress={() => !item.active && delOrigin(item.id)}/>
                            </TouchableOpacity>
                        </LinearGradient>
                    ))
                }
            </ScrollView>
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
        paddingTop: 10,
    },
    originItem: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
    },
    floatBottom: {
        left: '5%',
        width: '90%',
        borderRadius: 4,
        height: 35,
        backgroundColor: TOMATOX_THEME.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 13,
    },
    itemTextWrapper: {
        flex: 1,
        flexDirection:'row',
        flexWrap: 'nowrap',
        height: '100%',
        alignItems: 'center',
    },
    itemId: {
        width: '20%',
        fontSize: 14,
        paddingLeft: 15,
    },
    itemUrl: {
        flex: 1,
        fontSize: 14,
        paddingLeft: 15,
        paddingRight: 15,
    },
});
