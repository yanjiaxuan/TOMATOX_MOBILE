import {createBottomTabNavigator} from 'react-navigation-tabs';
import Recommend from '../../views/recommend/recommend';
import History from '../../views/history/history';
import {StyleSheet} from "react-native";

const style = StyleSheet.create({
    tabBar: {
        backgroundColor: '#2b2b2b'
    },
})

export default createBottomTabNavigator({
    Recommend: {
        screen: Recommend,
        navigationOptions: {
            title: '推荐',
            tabBarIcon: ''
        }
    },
    History: {
        screen: History,
        navigationOptions: {
            title: '历史',
            tabBarIcon: ''
        }
    },
}, {
    tabBarOptions: {
        style: style.tabBar,
        activeTintColor: '#ff5c49',
        inactiveTintColor: '#f1f1f1'
    }
});
