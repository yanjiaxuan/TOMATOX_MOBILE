import React from 'react';
import Recommend from '../../views/recommend/recommend';
import History from '../../views/history/history';
import Collect from '../../views/collect/collect';
import Live from '../../views/live/live';
import Setting from '../../views/setting/setting';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const style = StyleSheet.create({
    tabBar: {
        paddingBottom: 4,
        borderTopWidth: 0,
        backgroundColor: '#3d3d3d',
    },
});

export default function customTab() {
    return (
        <Tab.Navigator
            backBehavior={'none'}
            tabBarOptions={{
                style: style.tabBar,
                activeTintColor: '#ff5c49',
                inactiveTintColor: '#bdbdbd',
            }}
            >
            <Tab.Screen name={'Recommend'} component={Recommend} options={{
                title: '推荐',
                tabBarIcon: ({color}) => <Icon name={'fire'} size={16} color={color} />,
            }} />
            <Tab.Screen name={'Live'} component={Live} options={{
                title: '直播',
                tabBarIcon: ({color}) => <Icon name={'play-circle'} size={16} color={color} />,
            }} />
            <Tab.Screen name={'Collect'} component={Collect} options={{
                title: '收藏',
                tabBarIcon: ({color}) => <Icon name={'heart'} size={16} color={color} />,
            }} />
            <Tab.Screen name={'History'} component={History} options={{
                title: '历史',
                tabBarIcon: ({color}) => <Icon name={'history'} size={16} color={color} />,
            }} />
            <Tab.Screen name={'Setting'} component={Setting} options={{
                title: '设置',
                tabBarIcon: ({color}) => <Icon name={'cog'} size={16} color={color} />,
            }} />
        </Tab.Navigator>
    );
}
