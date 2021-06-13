import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import TomatoxWaterfall from '../../components/tomatox-waterfall/tomatox-waterfall';
import {TOMATOX_THEME} from '../../utils/theme';

export default function search() {
    const navigation = useNavigation();
    const [keyword, setKeyword] = useState('');

    const searchByKeyword = (event: any) => {
        setKeyword(event.nativeEvent.text);
    };

    return (
        <View style={style.wrapper}>
            <View style={style.searchWrapper}>
                <TextInput
                    style={style.searchInput}
                    placeholder={'电影、电视剧、综艺...'}
                    placeholderTextColor={TOMATOX_THEME.UNIMPORTANT_FONT_COLOR}
                    autoFocus={true}
                    onSubmitEditing={searchByKeyword}
                    returnKeyType={'search'}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={style.searchText}>取消</Text>
                </TouchableOpacity>
            </View>
            <View style={style.contentWrapper}>
                <TomatoxWaterfall keyword={keyword}/>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
        padding: 10,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        height: 40,
    },
    searchInput: {
        flex: 1,
        color: TOMATOX_THEME.FONT_COLOR,
        backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
        height: 35,
        lineHeight: 35,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 35,
    },
    searchText: {
        color: TOMATOX_THEME.FONT_COLOR,
        fontSize: 15,
        paddingLeft: 20,
        paddingRight: 5,
    },
    contentWrapper: {
        flex: 1,
    },
});
