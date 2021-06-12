import React from 'react';
import {Image, Text, View} from 'react-native';

export default function (props: any) {
    return (
        <View style={
            {
                backgroundColor: '#2b2b2b',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }>
            <Image
                source={require('../../images/png/tomatox.png')}
                style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                }}
            />
            <Text style={{
                color: '#f1f1f1',
                fontWeight: 'bold',
                fontSize: 16,
            }}>
                功能正在开发中...
            </Text>
        </View>
    );
}
