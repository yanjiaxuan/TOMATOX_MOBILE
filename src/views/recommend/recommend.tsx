import React from 'react';
import {
    Image, Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import TIcon from '../../images/png/tomatox.png';
import {queryTypes} from '../../utils/request';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ClassifyList from './classify-list';
import {createAppContainer} from 'react-navigation';
let keyWords = '';
let TabViewCache: any;

export default class Recommend extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            classifyList: [],
            selectedTabIdx: -1,
        };
    }

    private changeKW(val: any) {
        keyWords = val;
    }

    private searchRes() {
        Keyboard.dismiss();
        console.log(keyWords);
    }

    private changeType() {
    }

    private generateRouterConf () {
        const conf: any = {};
        this.state.classifyList.forEach((item: any) => {
            conf[item.name] = () => (<ClassifyList navigation={this.props.navigation} type={item.id} />);
        });
        return conf;
    }

    private createTabView() {
        if (this.state.classifyList.length === 0) {
            return <></>;
        }
        if (TabViewCache) {
            return <TabViewCache />;
        }
        TabViewCache = createAppContainer(createMaterialTopTabNavigator(this.generateRouterConf(), {
            lazy: true,
            swipeEnabled: true,
            tabBarPosition: 'top',
            tabBarOptions: {
                showLabel: true,
                showIcon: false,
                scrollEnabled: true,
                activeTintColor: '#ff5c49',
                labelStyle: {fontSize: 14},
                indicatorStyle: {height: 4, backgroundColor: '#ff5c49', borderRadius: 20},
                tabStyle: {width: 'auto', marginLeft: 5,marginRight:5, marginBottom: 3, padding: 0, height: 40},
                style: { backgroundColor: 'transparent' },
                pressColor: 'transparent',
                pressOpacity: 0.7,
            },
        }));
        return <TabViewCache />;
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
            <SafeAreaView style={style.fullWrapper}>
                <LinearGradient colors={['#232222', '#2b2b2b']} style={{height: 50}}>
                    <View style={style.titleBar}>
                        <Image source={TIcon} style={style.titleImg} />
                        <TextInput style={style.titleInput} placeholderTextColor={'#929292'} onChangeText={this.changeKW} placeholder={'电影、电视剧、综艺...'} />
                        <Text onPress={this.searchRes} style={style.titleText}>搜索</Text>
                    </View>
                </LinearGradient>
                { this.createTabView() }
            </SafeAreaView>
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
        color: '#f1f1f1',
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
