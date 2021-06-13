import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TOMATOX_THEME} from "../../utils/theme";

export default function resourceInfo(props: {resource: IplayResource, close: () => void}) {
    return (
        <View style={style.infoWrapper}>
            <View style={style.infoTitle}>
                <Text style={style.infoTitleText}>简介</Text>
                <TouchableOpacity onPress={props.close} style={style.infoTitleBtnWrapper}>
                    <Icon name={'x'} style={style.infoTitleBtn} />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={{position: 'relative'}}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <Image source={{uri: props.resource.picture}} style={style.infoImg} resizeMode={'cover'} />
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>剧名：</Text>
                    {props.resource.name}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>评分：</Text>
                    {props.resource.doubanScore}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>分类：</Text>
                    {props.resource.class}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>语言：</Text>
                    {props.resource.lang}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>地区：</Text>
                    {props.resource.area}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>年份：</Text>
                    {props.resource.year}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>更新时间：</Text>
                    {props.resource.updateTime}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>导演：</Text>
                    {props.resource.director}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>演员：</Text>
                    {props.resource.actor}
                </Text>
                <Text style={style.infoItem}>
                    <Text style={style.infoItemTitle}>标签：</Text>
                    {props.resource.tag}
                </Text>
                <Text style={style.infoDesc}>
                    {props.resource.describe}
                </Text>
                <View style={{height: 25}} />
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    infoWrapper: {
        padding: 10,
    },
    infoTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoTitleText: {
        fontSize: 15,
        color: TOMATOX_THEME.FONT_COLOR,
    },
    infoTitleBtnWrapper: {
        paddingLeft: 50
    },
    infoTitleBtn: {
        fontSize: 20,
        color: TOMATOX_THEME.FONT_COLOR
    },
    infoImg: {
        width: 100,
        height: 140,
        position: 'absolute',
        right: 0,
    },
    infoItem: {
        color: TOMATOX_THEME.FONT_COLOR,
        marginBottom: 5,
        fontSize: 13,
    },
    infoItemTitle: {
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
    },
    infoDesc: {
        marginTop: 10,
        padding: 1,
        color: TOMATOX_THEME.FONT_COLOR
    },
});
