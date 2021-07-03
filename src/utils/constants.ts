import {Dimensions, Platform} from 'react-native';

const constants = {
    DEFAULT_ORIGIN: 'https://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml',
    DEFAULT_SEARCH_INDEX: 'https://gitee.com/yanjiaxuan/ZY-Player-Resources/raw/main/Sites/mapper.json',
    IPTV_ORIGIN: 'https://gitee.com/yanjiaxuan/tomatox-res/raw/master/zhibo.json',
    WINDOW_WIDTH: Dimensions.get('window').width,
    WINDOW_HEIGHT: Dimensions.get('window').height,
    IS_IOS: Platform.OS === 'ios'
};

export default constants
