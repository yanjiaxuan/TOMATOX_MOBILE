import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TOMATOX_THEME} from '../../utils/theme';
import {version, homepage, bugs} from '../../../package.json';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native'

function SettingItem(props: {name: string, value?: string, onPress: () => any}) {
    return (
        <TouchableHighlight onPress={props.onPress} underlayColor={TOMATOX_THEME.COMPONENT_LIGHT_BACKGROUND} style={style.settingContentWrapper}>
            <View style={style.settingContentItem}>
                <Text style={style.settingContentText}>{props.name}</Text>
                <Text style={style.settingContentTextC}>
                    {props.value || ''}{'  '}
                    <Icon name={'chevron-right'} size={16} color={TOMATOX_THEME.UNIMPORTANT_FONT_COLOR}/>
                </Text>
            </View>
        </TouchableHighlight>
    );
}

export default function Setting() {
    const {navigate} = useNavigation()
    return (
        <View style={style.fullWrapper}>
            <View style={style.settingTitle}>
                <Image source={require('../../images/png/tomatox.png')} style={style.icon} />
                <Text style={style.settingTitleName}>TOMATOX</Text>
                <Text style={style.settingTitleVersion}>Version {version}</Text>
            </View>
            <ScrollView style={style.settingContent}>
                <View style={style.settingContentItemEmpty} />
                <SettingItem name={'数据源'} value={'默认'} onPress={() => {navigate('Origins')}} />
                <SettingItem name={'检查更新'} value={version} onPress={() => {}} />
                <SettingItem name={'查看项目'} value={'TOMATOX_MOBILE'} onPress={() => Linking.openURL(homepage)} />
                <SettingItem name={'功能反馈'} onPress={() => Linking.openURL(bugs)} />
                <SettingItem name={'免责声明'} onPress={() => {}} />
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
        marginTop: 30,
        marginBottom: 5,
        fontWeight: '600',
    },
    settingTitleVersion: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 14,
        fontWeight: '500',
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
