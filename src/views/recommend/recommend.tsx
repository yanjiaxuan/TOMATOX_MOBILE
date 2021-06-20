import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import TIcon from '../../images/png/tomatox.png';
import {queryTypes} from '../../utils/request';
import TomatoxWaterfall from '../../components/tomatox-waterfall/tomatox-waterfall';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SplashScreen from 'react-native-splash-screen';
import {TOMATOX_THEME} from '../../utils/theme';
import Icon from 'react-native-vector-icons/Feather';

let TabViewCache: any;
const TopTab = createMaterialTopTabNavigator();

function topTabScreen(type: number) {
    return () => <TomatoxWaterfall type={type} />;
}
export default class Recommend extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            classifyList: [],
            selectedTabIdx: -1,
        };
    }

    private createTabView() {
        if (this.state.classifyList.length === 0) {
            return <></>;
        }
        if (TabViewCache) {
            return TabViewCache;
        }
        TabViewCache = (
                <TopTab.Navigator
                    lazy={true}
                    swipeEnabled={true}
                    tabBarPosition={'top'}
                    sceneContainerStyle={{backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR}}
                    backBehavior={'none'}
                    tabBarOptions={{
                        showLabel: true,
                        showIcon: false,
                        scrollEnabled: true,
                        activeTintColor: TOMATOX_THEME.THEME_COLOR,
                        inactiveTintColor: TOMATOX_THEME.FONT_COLOR,
                        labelStyle: {fontSize: 14},
                        indicatorStyle: {height: 4, backgroundColor: TOMATOX_THEME.THEME_COLOR},
                        tabStyle: {width: 'auto', marginLeft: 5,marginRight:5, marginBottom: 3, padding: 0, height: 40},
                        style: { backgroundColor: 'transparent' },
                        pressColor: 'transparent',
                        pressOpacity: 0.7,
                    }}
                >
                    {this.state.classifyList.map((item: any) => (
                        <TopTab.Screen
                            key={item.id}
                            name={item.name}
                            component={topTabScreen(item.id)}
                        />
                    ))}
                </TopTab.Navigator>
        );

        return TabViewCache;
    }

    componentDidMount(): void {
        queryTypes().then(res => {
            res.unshift({id: -1, name: '最新'});
            this.setState({
                classifyList: res,
            });
            SplashScreen.hide();
        });
    }
    render(): React.ReactNode {
        return (
            <View style={style.fullWrapper}>
                <View style={{height: 50}}>
                    <View style={style.titleBar}>
                        <Image source={TIcon} style={style.titleImg} />
                        <View style={style.titleInput} onTouchEnd={() => this.props.navigation.navigate('Search')}>
                            <Text style={style.titleInputText}>电影、电视剧、综艺...</Text>
                        </View>
                        <Icon name={'youtube'} onPress={() => this.props.navigation.navigate('Live')} style={style.titleIcon} />
                    </View>
                </View>
                { this.createTabView() }
            </View>
        );
    }

    private switchTab(id: any) {
        this.setState({
            selectedTabIdx: id,
        });
    }
}

const style = StyleSheet.create({
    fullWrapper: {
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
        flex: 1,
    },
    titleBar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    titleImg: {
        width: 40,
        height: 40,
        marginRight: 20,
    },
    titleInput: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 15,
        justifyContent: 'center',
    },
    titleInputText: {
        color: TOMATOX_THEME.DISABLED_FONT_COLOR,
    },
    titleIcon: {
        color: TOMATOX_THEME.UNIMPORTANT_FONT_COLOR,
        fontSize: 20,
    },
    tabLabel: {
        color: TOMATOX_THEME.FONT_COLOR,
        marginLeft: 20,
        textAlign: 'center',
        paddingBottom: 5,
    },
    tabLabelActive: {
        color: TOMATOX_THEME.THEME_COLOR,
        borderBottomWidth: 4,
        borderBottomColor: TOMATOX_THEME.THEME_COLOR,
    },
});
