import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, GestureResponderEvent, StatusBar, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import {convertSecondToTime} from '../../utils/time-converter';
import LinearGradient from 'react-native-linear-gradient';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import SystemSetting from 'react-native-system-setting';
import {TOMATOX_THEME} from '../../utils/theme';

let timmerId:any;
let posX: any;
let posY: any;
let direction: any;
let brightness = 5;
let controlState = false;
let touchMoveCount = 0;
let switchTimmerId: any;
SystemSetting.getBrightness().then(bri => {brightness = bri;});
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const defaultVideoHeight = 250;
const fsVideoHeight = windowWidth as number;
export default function tomatoxVideo (props: {src: string, back: () => void, playNext: (cb: () => void) => void}) {
    const [videoInstance, setVideoInstance] = useState<Video>();
    const [seeking, setSeeking] = useState(false);
    const [playState, setPlayState] = useState(true);
    const [curTime, setCurTime] = useState(0);
    const [fullTime, setFullTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [fullScreen, setFullScreen] = useState(false);
    const [showControl, setShowControl] = useState(false);
    const [processCenterInfo, setProcessCenterInfo] = useState('');
    const [videoHeight, setVideoHeight] = useState(defaultVideoHeight);
    const touchStartTime = useRef(0);
    useEffect(() => {
        Orientation.addLockListener(orientationListener);
        return () => Orientation.removeLockListener(orientationListener);
    }, []);
    const touchHandler = {
        onTouchMove: (event: GestureResponderEvent) => {
            resetTimmer();
            const {pageX, pageY} = event.nativeEvent;
            const xOffset = pageX - posX;
            const yOffset = pageY - posY;
            if (touchMoveCount <= 3) {
                touchMoveCount++;
                if (touchMoveCount === 1) {
                    posX = pageX;
                    posY = pageY;
                }
                if (touchMoveCount === 3) {
                    if (Math.abs(xOffset) > Math.abs(yOffset)) {
                        direction = 1;   // 横向，控制进度
                    } else {
                        const width = fullScreen ? windowHeight : windowWidth;
                        // 纵向，控制音量和亮度
                        if (pageX < width / 2) {
                            direction = 2;   // 亮度
                        } else {
                            direction = 3;   // 音量
                        }
                    }
                }
                return;
            }
            switch (direction) {
                case 1:
                    setSeeking(true);
                    const playPos = xOffset > 0 ? Math.min(fullTime, curTime + xOffset * 2) :
                        Math.max(0, curTime + xOffset * 2);
                    setCurTime(playPos);
                    setProcessCenterInfo(`${convertSecondToTime(playPos, fullTime)} / ${convertSecondToTime(fullTime,fullTime)}`);
                    break;
                case 2:
                    if (yOffset > 0) {
                        brightness = Math.max(0, brightness - yOffset * 0.1);
                    } else {
                        brightness = Math.min(10, brightness - yOffset * 0.1);
                    }
                    setProcessCenterInfo(`亮度：${Math.floor(brightness * 10)}%`);
                    SystemSetting.setBrightnessForce(brightness);
                    break;
                case 3:
                    if (yOffset > 0) {
                        // 音量-
                        setVolume(Math.max(0, volume - yOffset * 0.008));
                    } else {
                        // 音量+
                        setVolume(Math.min(1, volume - yOffset * 0.008));
                    }
                    setProcessCenterInfo(`音量：${Math.floor(volume * 100)}%`);
                    break;
                default:
                    break;
            }

            posX = pageX;
            posY = pageY;
        },
        onTouchStart: (event: GestureResponderEvent) => {
            controlState = showControl;
            const {locationX, locationY} = event.nativeEvent;
            posX = locationX;
            posY = locationY;
            touchStartTime.current = Date.now();
        },
        onTouchEnd: () => {
            const now = Date.now();
            posX = undefined;
            posY = undefined;
            touchMoveCount = 0;
            setProcessCenterInfo('');
            switch (direction) {
                case 1:
                    videoInstance?.seek(curTime);
                    setTimeout(() => setSeeking(false), 100);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default:
                    break;
            }
            direction = undefined;

            if (now - touchStartTime.current < 200) {   // 点击操作
                if (switchTimmerId) {
                    // 双击 播放/暂停
                    setPlayState(!playState);
                    clearTimeout(switchTimmerId);
                    switchTimmerId = undefined;
                } else {
                    // 单击，切换控制层状态
                    switchTimmerId = setTimeout(() => {
                        controlState === showControl && switchControl();
                        switchTimmerId = undefined;
                    },500);
                }
            }
        },
    };
    const orientationListener = (type: OrientationType) => {
        if (type === 'PORTRAIT') {
            setFullScreen(false);
            setVideoHeight(defaultVideoHeight);
            StatusBar.setHidden(false);
        }
    };

    const handlePlayEnd = () => {
        setPlayState(false);
        setCurTime(0);
        videoInstance?.seek(0);
    };

    const switchControl = () => {
        if (showControl) {
            timmerId && clearTimeout(timmerId);
        } else {
            timmerId = setTimeout(() => {
                setShowControl(false);
            }, 5000);
        }
        setShowControl(!showControl);
    };
    const resetTimmer = () => {
        setShowControl(true);
        timmerId && clearTimeout(timmerId);
        timmerId = setTimeout(() => {
            setShowControl(false);
        }, 5000);
    };

    const switchScreenState = () => {
        if (fullScreen) {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
        } else {
            StatusBar.setHidden(true);
            Orientation.lockToLandscape();
        }
        setVideoHeight(fullScreen ? defaultVideoHeight : fsVideoHeight);
        setFullScreen(!fullScreen);
        resetTimmer();
    };

    const processGoBack = () => {
        if (fullScreen) {
            switchScreenState();
        } else {
            props.back();
        }
    };

    const style = StyleSheet.create({
        videoWrapper: {
            width: '100%',
            height: videoHeight,
            backgroundColor: '#000',
        },
        video: {
            width: '100%',
            height: '100%',
        },
        videoControl: {
            position: 'absolute',
            width: '100%',
            height: videoHeight,
            zIndex: 1,
        },
        videoControlTop: {
            paddingLeft: 5,
            paddingRight: 15,
            height: 45,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
        },
        topBtn: {
            color: TOMATOX_THEME.FONT_COLOR,
            fontSize: 27,
        },
        topBtnRight: {
            color: TOMATOX_THEME.FONT_COLOR,
            fontSize: 20,
        },
        videoControlCenter: {
            width: '100%',
            height: videoHeight - 90,
            zIndex: 10,
            top: 45,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        videoControlCenterContent: {
            fontSize: 13,
            color: TOMATOX_THEME.FONT_COLOR,
            backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
        },
        videoControlBottom: {
            top: videoHeight - 90,
            height: 45,
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 15,
        },
        videoPlayPause: {
            color: TOMATOX_THEME.FONT_COLOR,
            fontSize: 20,
        },
        videoSlider: {
            flex: 1,
            height: 30,
        },
        videoProcess: {
            color: TOMATOX_THEME.FONT_COLOR,
            fontSize: 10,
            fontWeight: 'bold',
        },
        videoFullScreen: {
            color: TOMATOX_THEME.FONT_COLOR,
            fontSize: 18,
            marginLeft: 10,
        },
    });

    return (
        <View style={style.videoWrapper}>
            {
                showControl &&
                <View style={style.videoControl}>
                    <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']} style={style.videoControlTop}>
                        <TouchableOpacity onPress={processGoBack}>
                            <Icon name={'chevron-left'} style={style.topBtn} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name={'airplay'} style={style.topBtnRight} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                                    style={style.videoControlBottom}>
                        <TouchableOpacity onPress={() => {resetTimmer(); setPlayState(!playState);}}>
                            <Icon name={playState ? 'pause' : 'play'} style={style.videoPlayPause}/>
                        </TouchableOpacity>
                        <Slider
                            style={style.videoSlider}
                            value={curTime}
                            minimumValue={0}
                            maximumValue={fullTime}
                            minimumTrackTintColor={TOMATOX_THEME.THEME_COLOR}
                            maximumTrackTintColor={TOMATOX_THEME.UNIMPORTANT_FONT_COLOR}
                            thumbTintColor={TOMATOX_THEME.THEME_COLOR}
                            onSlidingStart={() => {setSeeking(true);}}
                            onSlidingComplete={() => {videoInstance?.seek(curTime); setTimeout(() => {setSeeking(false);}, 100);}}
                            onValueChange={value => {setCurTime(value); resetTimmer();}}
                        />
                        <Text style={style.videoProcess}>
                            {`${convertSecondToTime(curTime, fullTime)}/${convertSecondToTime(fullTime, fullTime)}`}
                        </Text>
                        <TouchableOpacity onPress={switchScreenState}>
                            <Icon name={fullScreen ? 'minimize' : 'maximize'} style={style.videoFullScreen} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            }
            <View
                style={style.videoControlCenter}
                {...touchHandler}
            >
                {
                    Boolean(processCenterInfo) &&
                    <Text style={style.videoControlCenterContent}>{processCenterInfo}</Text>
                }
            </View>
            <Video
                ref={(instance: Video) => setVideoInstance(instance)}
                onLoad={data => {setProcessCenterInfo(''); setFullTime(data.duration);}} // when loaded, record fullTime
                onProgress={data => !seeking && setCurTime(data.currentTime)} // update cur play time
                onEnd={() => props.playNext(handlePlayEnd)}    // auto play next
                onTouchEnd={() => {switchTimmerId = 123; switchControl();}}
                paused={!playState}
                repeat={false}
                volume={volume}
                source={{uri: props.src}}
                style={style.video}
                resizeMode={'contain'}
                fullscreen={fullScreen}
                onLoadStart={() => setProcessCenterInfo('加载中，请稍候...')}
                onBuffer={() => setProcessCenterInfo('正在缓冲...')}
            />
        </View>
    );
}
