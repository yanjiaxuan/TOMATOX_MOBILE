import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Drawer from 'react-native-drawer';
import ResourceInfo from './resouce-info';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TOMATOX_THEME} from '../../utils/theme';
import {deleteData, insertOrUpdateData, queryData} from '../../utils/storage/storage';
import {TABLE_NAME} from '../../utils/storage/table-define';

export default function tomatoxDrawer(props: { resource: IPlayResource, curPlay: string, changePlay: (key: string) => void }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [isCollect, updateCollect] = useState(Boolean(queryData(TABLE_NAME.TOMATOX_COLLECT, props.resource.id)));

    function showDetailDrawer() {
        setShowDrawer(!showDrawer);
    }
    function developing() {
        Alert.alert('Developing', '功能正在开发中...');
    }

    function collectResource() {
        updateCollect(!isCollect);
        if (isCollect) {
            deleteData(TABLE_NAME.TOMATOX_COLLECT, props.resource.id);
        } else {
            insertOrUpdateData(TABLE_NAME.TOMATOX_COLLECT, {
                ...props.resource,
                collectDate: Date.now(),
            });
        }
    }

    return (
        <Drawer
            type={'overlay'}
            side={'bottom'}
            open={showDrawer}
            tapToClose={true}
            content={<ResourceInfo resource={props.resource} close={showDetailDrawer} />}
            styles={{
                drawer: { backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR },
            }}
        >
            <View style={style.playerInfoWrapper}>
                <Text style={style.playInfoTitle}>{props.resource.name}</Text>
                <Text style={style.playInfoDesc}>
                    {props.resource.type}
                    {'  ·  '}
                    {props.resource.doubanScore}
                </Text>
                <View style={style.playOptionWrapper}>
                    <View style={style.playOption}>
                        <TouchableOpacity onPress={showDetailDrawer}>
                            <Icon name={'bookmark'} style={style.playerOptionIcon} />
                            <Text style={style.playerOptionTitle}>简介</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.playOption}>
                        <TouchableOpacity onPress={collectResource}>
                            <MaterialIcon name={isCollect ? 'heart' : 'heart-outline'} style={[
                                isCollect ? style.playerOptionIconActive : style.playerOptionIcon,
                                {fontSize: 24}
                            ]} />
                            <Text style={style.playerOptionTitle}>收藏</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.playOption}>
                        <TouchableOpacity onPress={developing}>
                            <Icon name={'download'} style={style.playerOptionIcon} />
                            <Text style={style.playerOptionTitle}>缓存</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.playOption}>
                        <TouchableOpacity onPress={developing}>
                            <Icon name={'share-2'} style={style.playerOptionIcon} />
                            <Text style={style.playerOptionTitle} >分享</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={style.playInfoTitle2}>选集</Text>
                <ScrollView
                    style={{marginBottom: 150}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={style.playItemWrapper}>
                        {props.resource.playList.index.map(key => (
                            <TouchableOpacity key={key} onPress={() => props.changePlay(key)}>
                                <Text numberOfLines={1}
                                      ellipsizeMode={'tail'}
                                      style={[style.playItem, props.curPlay === key ? style.activePlayItem : undefined]}
                                >
                                    {key}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={style.nonePlayItem} />
                        <Text style={style.nonePlayItem} />
                        <Text style={style.nonePlayItem} />
                    </View>
                </ScrollView>
            </View>
        </Drawer>
    );
}

const style = StyleSheet.create({
    playerInfoWrapper: {
        padding: 10,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    playInfoTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    playInfoTitle2: {
        fontSize: 14,
        color: TOMATOX_THEME.FONT_COLOR,
        marginBottom: 10,
    },
    playInfoDesc: {
        fontSize: 10,
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
        marginTop: 5,
        marginBottom: 5,
    },
    playOptionWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    playOption: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    playerOptionIcon: {
        fontSize: 22,
        color: TOMATOX_THEME.FONT_COLOR,
        marginBottom: 5,
    },
    playerOptionIconActive: {
        fontSize: 22,
        color: TOMATOX_THEME.THEME_COLOR,
        marginBottom: 5,
    },
    playerOptionTitle: {
        fontSize: 12,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    playItemWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    playItem: {
        fontSize: 11,
        width: 75,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        color: TOMATOX_THEME.FONT_COLOR,
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: TOMATOX_THEME.COMPONENT_LIGHT_BACKGROUND,
        borderRadius: 2,
    },
    nonePlayItem: {
        width: 75,
        height: 30,
        marginTop: 4,
        marginBottom: 4,
        marginLeft: 3,
        marginRight: 3,
    },
    activePlayItem: {
        backgroundColor: TOMATOX_THEME.THEME_COLOR,
    },
});
