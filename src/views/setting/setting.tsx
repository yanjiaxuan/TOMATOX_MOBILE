import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {version} from '../../../package.json';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableHighlight} from 'react-native-gesture-handler';

function SettingItem(props: {name: string, value: string, onPress: () => any}) {
    return (
        <TouchableHighlight onPress={props.onPress} underlayColor={TOMATOX_THEME.COMPONENT_LIGHT_BACKGROUND} style={style.settingContentWrapper}>
            <View style={style.settingContentItem}>
                <Text style={style.settingContentText}>{props.name}</Text>
                <Text style={style.settingContentTextC}>
                    {props.value}{'  '}
                    <Icon name={'chevron-right'} size={16} color={TOMATOX_THEME.UNIMPORTANT_FONT_COLOR}/>
                </Text>
            </View>
        </TouchableHighlight>
    );
}

export default function setting() {
    return (
        <View style={style.fullWrapper}>
            <View style={style.settingTitle}>
                <Image source={require('../../images/png/tomatox.png')} style={style.icon} />
                <Text style={style.settingTitleName}>TOMATOX</Text>
                <Text style={style.settingTitleVersion}>Version {version}</Text>
            </View>
            <ScrollView style={style.settingContent}>
                <View style={style.settingContentItemEmpty} />
                <SettingItem name={'数据源'} value={'默认'} onPress={() => {}} />
                <SettingItem name={'检查更新'} value={version} onPress={() => {}} />
                <SettingItem name={'查看项目'} value={'TOMATOX_MOBILE'} onPress={() => {}} />
                <SettingItem name={'免责声明'} value={''} onPress={() => {}} />
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    fullWrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    settingTitle: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 70,
        height: 70,
    },
    settingTitleName: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 20,
        marginTop: 25,
        marginBottom: 4,
    },
    settingTitleVersion: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 14,
    },
    settingContent: {
    },
    settingContentWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    settingContentItem: {
        height: 50,
        borderColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    settingContentItemEmpty: {
        height: 0,
        borderColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
        borderBottomWidth: 1,
        marginLeft: 22,
        marginRight: 22,
    },
    settingContentText: {
        fontSize: 15,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    settingContentTextC: {
        fontSize: 15,
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
    }
});
