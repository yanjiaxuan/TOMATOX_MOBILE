import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Recommend from '../../views/recommend/recommend';
import History from '../../views/history/history';
import Collect from '../../views/collect/collect';
import Live from '../../views/live/live';
import Setting from '../../views/setting/setting';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const style = StyleSheet.create({
    tabBar: {
        paddingBottom: 4,
        borderTopWidth: 0,
        backgroundColor: '#3d3d3d',
    },
});

export default createBottomTabNavigator({
    Recommend: {
        screen: Recommend,
        navigationOptions: {
            title: '推荐',
            tabBarIcon: ({tintColor}) => <Icon name={'fire'} size={16} color={tintColor} />,
        },
    },
    Live: {
        screen: Live,
        navigationOptions: {
            title: '直播',
            tabBarIcon: ({tintColor}) => <Icon name={'play-circle'} size={16} color={tintColor} />,
        },
    },
    Collect: {
        screen: Collect,
        navigationOptions: {
            title: '收藏',
            tabBarIcon: ({tintColor}) => <Icon name={'heart'} size={16} color={tintColor} />,
        },
    },
    History: {
        screen: History,
        navigationOptions: {
            title: '历史',
            tabBarIcon: ({tintColor}) => <Icon name={'history'} size={16} color={tintColor} />,
        },
    },
    Setting: {
        screen: Setting,
        navigationOptions: {
            title: '设置',
            tabBarIcon: ({tintColor}) => <Icon name={'cog'} size={16} color={tintColor} />,
        },
    },
}, {
    backBehavior: 'none',
    tabBarOptions: {
        showIcon: true,
        style: style.tabBar,
        activeTintColor: '#ff5c49',
        inactiveTintColor: '#bdbdbd',
    },
});
