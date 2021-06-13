import React from 'react';
import TomatoxCard from '../tomatox-card/tomatox-card';
import {FlatList, StyleSheet, Text} from 'react-native';

const style = StyleSheet.create({
    contentList: {
        backgroundColor: '#2b2b2b',
        flex: 1,
        padding: 7,
    },
    contentFooter: {
        textAlign: 'center',
        color: '#f1f1f1',
        height: 50,
        lineHeight: 40,
    },
});

export default function tomatoxFlatList(props: {loadMore: any, data: any, haveMoreData: boolean}) {
     return <FlatList style={style.contentList}
              data={props.data}
              numColumns={3}
              onEndReached={props.loadMore}
              onEndReachedThreshold={0.7}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => <TomatoxCard key={item.id} data={item} />}
              ListFooterComponent={(
                  <Text style={style.contentFooter}>{props.haveMoreData ? '正在加载数据...' : '到底啦~'}</Text>
              )} />;
}
