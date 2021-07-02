import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import TomatoxWaterfall from '../../components/tomatox-waterfall/tomatox-waterfall';
import {TOMATOX_THEME} from '../../utils/theme';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Search() {
    const navigation = useNavigation();
    const [keyword, setKeyword] = useState('');

    const searchByKeyword = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        setKeyword(event.nativeEvent.text);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR}}>
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
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR,
    },
    searchWrapper: {
        margin: 10,
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
