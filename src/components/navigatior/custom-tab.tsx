import React from 'react';
import Recommend from '../../views/recommend/recommend';
import History from '../../views/history/history';
import Collect from '../../views/collect/collect';
import Setting from '../../views/setting/setting';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TOMATOX_THEME} from '../../utils/theme';

const Tab = createBottomTabNavigator();

const style = StyleSheet.create({
    tabBar: {
        paddingTop: 7,
        paddingBottom: 8,
        height: 55,
        borderTopWidth: 1,
        borderTopColor: TOMATOX_THEME.SPLIT_LINE_COLOR,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    tabBarLabel: {
        fontSize: 10
    }
});

export default function customTab() {
    return (
        <Tab.Navigator
            backBehavior={'none'}
            tabBarOptions={{
                style: style.tabBar,
                labelStyle: style.tabBarLabel,
                activeTintColor: TOMATOX_THEME.THEME_COLOR,
                inactiveTintColor: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
            }}
            >
            <Tab.Screen name={'Recommend'} component={Recommend} options={{
                title: '推荐',
                tabBarIcon: ({color}) => <Icon name={'fire'} size={16} color={color} />,
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
