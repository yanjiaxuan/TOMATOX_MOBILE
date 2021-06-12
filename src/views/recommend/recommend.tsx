import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import TIcon from '../../images/png/tomatox.png';
import {queryTypes} from '../../utils/request';
import LinearGradient from 'react-native-linear-gradient';
import ClassifyList from './classify-list';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

let TabViewCache: any;
const TopTab = createMaterialTopTabNavigator()

function topTabScreen(navigation: any, type: number) {
    return () => <ClassifyList navigation={navigation} type={type} />
}
export default class Recommend extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            classifyList: [],
            selectedTabIdx: -1,
        };
    }

    private searchRes() {
        console.log(123);
    }

    private changeType() {
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
                    sceneContainerStyle={{backgroundColor: '#2b2b2b'}}
                    backBehavior={"none"}
                    tabBarOptions={{
                        showLabel: true,
                        showIcon: false,
                        scrollEnabled: true,
                        activeTintColor: '#ff5c49',
                        inactiveTintColor: '#f1f1f1',
                        labelStyle: {fontSize: 14},
                        indicatorStyle: {height: 4, backgroundColor: '#ff5c49', borderRadius: 20},
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
                            component={topTabScreen(this.props.navigation, item.id)}
                        />
                    ))}
                </TopTab.Navigator>
        )

        return TabViewCache;
    }

    componentDidMount(): void {
        queryTypes().then(res => {
            res.unshift({id: -1, name: '最新'});
            this.setState({
                classifyList: res,
            });
            this.changeType();
        });
    }
    render(): React.ReactNode {
        return (
            <View style={style.fullWrapper}>
                <LinearGradient colors={['#232222', '#2b2b2b']} style={{height: 50}}>
                    <View style={style.titleBar}>
                        <Image source={TIcon} style={style.titleImg} />
                        <View style={style.titleInput} onTouchEnd={this.searchRes}>
                            <Text style={style.titleInputText}>电影、电视剧、综艺...</Text>
                        </View>
                        <Text onPress={this.searchRes} style={style.titleText}>搜索</Text>
                    </View>
                </LinearGradient>
                { this.createTabView() }
            </View>
        );
    }

    private switchTab(id: any) {
        this.setState({
            selectedTabIdx: id,
        }, this.changeType);
    }
}

const style = StyleSheet.create({
    fullWrapper: {
        backgroundColor: '#2b2b2b',
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
        backgroundColor: 'rgba(128,128,128,0.69)',
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 15,
        justifyContent: "center"
    },
    titleInputText: {
        color: '#a1a1a1'
    },
    titleText: {
        color: '#f1f1f1',
    },
    tabLabel: {
        color: '#f1f1f1',
        marginLeft: 20,
        textAlign: 'center',
        paddingBottom: 5,
    },
    tabLabelActive: {
        color: '#ff5c49',
        borderBottomWidth: 4,
        borderBottomColor: '#ff5c49',
    },
});
