import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import {convertSecondToTime} from '../../utils/time-converter';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from "react-native-orientation-locker";

let timmerId:any
const windowWidth = Dimensions.get("window").width
export default function tomatoxVideo (props: {src: string, back: () => void, playNext: (cb: () => void) => void}) {
    const [videoInstance, setVideoInstance] = useState<Video>();
    const [seeking, setSeeking] = useState(false);
    const [playState, setPlayState] = useState(true);
    const [curTime, setCurTime] = useState(0);
    const [fullTime, setFullTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [fullScreen, setFullScreen] = useState(false);
    const [showControl, setShowControl] = useState(false)
    const handlePlayEnd = () => {
        setPlayState(false);
        setCurTime(0);
        videoInstance?.seek(0);
    };

    const switchControl = () => {
        if (showControl) {
            timmerId && clearTimeout(timmerId)
        } else {
            timmerId = setTimeout(() => {
                setShowControl(false)
            }, 5000)
        }
        setShowControl(!showControl)
    }
    const resetTimmer = () => {
        timmerId && clearTimeout(timmerId)
        timmerId = setTimeout(() => {
            setShowControl(false)
        }, 5000)
    }

    const switchScreenState = () => {
        if (fullScreen) {
            Orientation.lockToPortrait()
        } else {
            Orientation.lockToLandscape()
        }
        setFullScreen(!fullScreen);
        resetTimmer()
    }

    const processGoBack = () => {
        if (fullScreen) {
            switchScreenState()
        } else {
            props.back()
        }
    }

    return (
        <View style={style.videoWrapper}>
            {
                showControl &&
                <View style={{...style.videoControl, height: fullScreen ? windowWidth : 250}}>
                    <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']} style={style.videoControlTop}>
                        <TouchableOpacity onPress={processGoBack}>
                            <Icon name={'chevron-left'} style={style.topBtn} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name={'airplay'} style={{...style.topBtn, fontSize: 20}} />
                        </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity onPress={switchControl}>
                        <View style={{...style.videoControlCenter, height: fullScreen ? windowWidth - 90 : 160}} />
                    </TouchableOpacity>
                    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} style={style.videoControlBottom}>
                        <TouchableOpacity onPress={() => {resetTimmer(); setPlayState(!playState)}}>
                            <Icon name={playState ? 'pause' : 'play'} style={style.videoPlayPause}/>
                        </TouchableOpacity>
                        <Slider
                            style={style.videoSlider}
                            value={curTime}
                            minimumValue={0}
                            maximumValue={fullTime}
                            minimumTrackTintColor={'#ff5c49'}
                            maximumTrackTintColor={'#fff'}
                            thumbTintColor={'#ff5c49'}
                            onSlidingStart={() => {setSeeking(true);}}
                            onSlidingComplete={() => {videoInstance?.seek(curTime); setTimeout(() => {setSeeking(false); setPlayState(true);}, 100);}}
                            onValueChange={value => {setCurTime(value); resetTimmer()}}
                        />
                        <Text style={style.videoProcess}>
                            {`${convertSecondToTime(curTime, fullTime >= 3600)}/${convertSecondToTime(fullTime, fullTime >= 3600)}`}
                        </Text>
                        <TouchableOpacity onPress={switchScreenState}>
                            <Icon name={fullScreen ? 'minimize' : 'maximize'} style={style.videoFullScreen} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            }
            <Video
                ref={(instance: Video) => setVideoInstance(instance)}
                onLoad={data => setFullTime(data.duration)} // when loaded, record fullTime
                onProgress={data => !seeking && setCurTime(data.currentTime)} // update cur play time
                onEnd={() => props.playNext(handlePlayEnd)}    // auto play next
                onTouchEnd={switchControl}
                paused={!playState}
                repeat={false}
                volume={volume}
                source={{uri: props.src}}
                style={{...style.video, height: fullScreen ? windowWidth : 250}}
                resizeMode={'contain'}
                fullscreen={fullScreen}
            />
        </View>
    );
}

const style = StyleSheet.create({
    videoWrapper: {
        width: '100%',
        height: 250,
        backgroundColor: '#000',
        zIndex: 1
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoControl: {
        position: 'absolute',
        width: '100%',
        height: 250,
        zIndex: 1
    },
    videoControlTop: {
        paddingLeft: 5,
        paddingRight: 15,
        height: 45,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    topBtn: {
        color: '#f1f1f1',
        fontSize: 27,
    },
    videoControlCenter: {
        width: '100%',
        height: 160,
    },
    videoControlBottom: {
        height: 45,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 15,
    },
    videoPlayPause: {
        color: '#f1f1f1',
        fontSize: 20,
    },
    videoSlider: {
        flex: 1,
        height: 30,
    },
    videoProcess: {
        color: '#f1f1f1',
        fontSize: 10,
        fontWeight: 'bold',
    },
    videoFullScreen: {
        color: '#f1f1f1',
        fontSize: 18,
        marginLeft: 10,
    },
});
