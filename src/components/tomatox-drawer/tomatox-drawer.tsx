import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Drawer from 'react-native-drawer';
import ResourceInfo from './resouce-info';
import Icon from 'react-native-vector-icons/Feather';

export default function tomatoxDrawer(props: { resource: IplayResource, curPlay: string, changePlay: (key: string) => void }) {
    const [showDrawer, setShowDrawer] = useState(false);

    function showDetailDrawer() {
        setShowDrawer(!showDrawer);
    }
    function developing() {
        Alert.alert('Developing', '功能正在开发中...')
    }

    return (
        <Drawer
            type={'overlay'}
            side={'bottom'}
            open={showDrawer}
            tapToClose={true}
            content={<ResourceInfo resource={props.resource} close={showDetailDrawer} />}
            styles={{
                drawer: { backgroundColor: '#2b2b2b' },
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
                        <TouchableOpacity onPress={developing}>
                            <Icon name={'heart'} style={style.playerOptionIcon} />
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
                <ScrollView style={{marginBottom: 120}}>
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
    },
    playInfoTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#f1f1f1',
    },
    playInfoTitle2: {
        fontSize: 14,
        color: '#f1f1f1',
        marginBottom: 10,
    },
    playInfoDesc: {
        fontSize: 10,
        color: '#d2d2d2',
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
        color: '#f1f1f1',
        marginBottom: 5,
    },
    playerOptionTitle: {
        fontSize: 12,
        color: '#dddddd',
    },
    playItemWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    playItem: {
        width: 100,
        height: 35,
        lineHeight: 35,
        textAlign: 'center',
        color: '#dddddd',
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: 'rgba(111,111,111,0.1)',
        borderRadius: 2,
    },
    nonePlayItem: {
        width: 100,
        height: 35,
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 3,
        marginRight: 3,
    },
    activePlayItem: {
        backgroundColor: '#ff5c49',
    },
});
