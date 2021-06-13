import React from 'react';
import {Image, Text, View} from 'react-native';
import {TOMATOX_THEME} from "../../utils/theme";

export default function (props: any) {
    return (
        <View style={
            {
                backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
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
                color: TOMATOX_THEME.FONT_COLOR,
                fontWeight: 'bold',
                fontSize: 16,
            }}>
                功能正在开发中...
            </Text>
        </View>
    );
}
