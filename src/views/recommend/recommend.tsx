import React from 'react';
import {
    FlatList,
    Image, Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import TIcon from '../../images/png/tomatox.png';
import {queryResources, queryTypes} from '../../utils/request';
import LinearGradient from 'react-native-linear-gradient'
import {filterResources} from "../../utils/filterResources";
import TomatoxCard from '../../components/tomatox-card/tomatox-card'
let keyWords = '';

export default class Recommend extends React.Component<any, any>{
    private pageCount = 10
    private curPage = 0

    constructor(props: any) {
        super(props);
        this.state = {
            classifyList: [],
            selectedTabIdx: -1,
            resourceList: [],
            haveMoreData: true
        }
    }

    private changeKW(val: any) {
        keyWords = val;
    }

    private searchRes() {
        Keyboard.dismiss()
        console.log(keyWords);
    }

    private changeType() {
        this.curPage = 0
        this.pageCount = 10
        this.setState({
            resourceList: [],
            haveMoreData: true
        }, this.getMoreData)
    }

    private getMoreData() {
        const typeId = this.state.selectedTabIdx
        let prom;
        if (typeId === -1) {
            prom = queryResources(++this.curPage, undefined, undefined, 24)
        } else {
            prom = queryResources(++this.curPage, typeId)
        }
        if (this.curPage >= this.pageCount) {
            this.setState({
                haveMoreData: false
            })
            return
        }
        prom.then((res: any) => {
            const {pagecount, list} = res
            this.pageCount =  pagecount
            this.setState({
                resourceList: [
                    ...this.state.resourceList,
                    ...filterResources(list)
                ]
            })
        })
    }

    componentDidMount(): void {
        queryTypes().then(res => {
            res.unshift({id: -1, name: '最新'});
            this.setState({
                classifyList: res
            })
            this.changeType()
        });
    }

    render(): React.ReactNode {
        return (
            <SafeAreaView style={style.fullWrapper}>
                <LinearGradient colors={['#232222', '#2b2b2b']} style={{height: 90}}>
                    <View style={style.titleBar}>
                        <Image source={TIcon} style={style.titleImg} />
                        <TextInput style={style.titleInput} placeholderTextColor={'#929292'} onChangeText={this.changeKW} placeholder={'电影、电视剧、综艺...'} />
                        <Text onPress={this.searchRes} style={style.titleText}>搜索</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {this.state.classifyList.map((item: any) => (
                            <TouchableOpacity key={item.id} activeOpacity={1} onPress={() => {this.switchTab(item.id)}}>
                                <Text style={[style.tabLabel, item.id === this.state.selectedTabIdx ? style.tabLabelActive: undefined]}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </LinearGradient>
                <FlatList style={style.contentList}
                          data={this.state.resourceList}
                          numColumns={3}
                          onEndReached={() => { this.getMoreData() }}
                          onEndReachedThreshold={0.7}
                          renderItem={({item}) => <TomatoxCard data={item} navigation={this.props.navigation} />}
                          ListFooterComponent={(
                              <Text style={style.contentFooter}>{this.state.haveMoreData ? '正在加载数据...' : '到底啦~'}</Text>
                          )}>
                </FlatList>
            </SafeAreaView>
        );
    }

    private switchTab(id: any) {
        this.setState({
            selectedTabIdx: id
        }, this.changeType)
    }
}

const style = StyleSheet.create({
    fullWrapper: {
        backgroundColor: '#2b2b2b',
        flex: 1
    },
    titleBar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    titleImg: {
        width: 40,
        height: 40,
        marginLeft: 10,
        marginRight: 20,
    },
    titleInput: {
        backgroundColor: 'rgba(128,128,128,0.69)',
        width: '70%',
        height: 30,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 14,
        color: '#f1f1f1'
    },
    titleText: {
        color: '#f1f1f1'
    },
    tabLabel: {
        color: '#f1f1f1',
        marginLeft: 20,
        textAlign: 'center',
        paddingBottom: 5
    },
    tabLabelActive: {
        color: '#ff5c49',
        borderBottomWidth: 4,
        borderBottomColor: '#ff5c49'
    },
    contentList: {
        flex: 1,
        padding: 7
    },
    contentFooter: {
        textAlign: 'center',
        color: '#f1f1f1',
        height: 50,
        lineHeight: 40
    }
});
