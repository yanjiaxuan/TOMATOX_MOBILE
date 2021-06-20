import React from 'react';
import Video, {OnLoadData} from 'react-native-video-new';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import {Animated, BackHandler, GestureResponderEvent, StatusBar, StyleSheet, Text, View} from 'react-native';
import constants from '../../utils/constants';
import {convertSecondToTime} from '../../utils/time-converter';
import SystemSetting from 'react-native-system-setting';
import {TOMATOX_THEME} from '../../utils/theme';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';

let screenBrightness = 1;

export default class TomatoxVideo extends React.Component<{
    src: string,
    paused?: boolean,
    lastSeek?: number,
    playNext: (cb: () => void) => void,
    onBack?: (playPosition: number) => any,
    navigation: any
}, any> {
    private videoInstance: Video|undefined
    private seeking = false
    private curTimeCache = 0
    private defaultVideoHeight = constants.WINDOW_WIDTH / 16 * 9
    private fullScreenVideoHeight = constants.WINDOW_WIDTH as number
    private touchStartTime = 0
    private videoControlHideTaskId: any
    private touchScreenTaskId: any
    private longPressTaskId: any
    private initPosX: any
    private initPosY: any
    private posX: any
    private posY: any
    private touchType = -1
    private curShowVideoControl = false
    private selfIsAlive = true
    private locationInfoAnimatedLeft = new Animated.Value(-200)

    constructor(props: any) {
        super(props);
        this.state = {
            playing: true,
            playPosition: 0,
            videoFullTime: 0,
            playRate: 1,
            volume: 1,
            isFullScreen: false,
            showVideoControl: false,
            noticeInfo: '',
            videoHeight: this.defaultVideoHeight,
            bufferingInfo: '',
            locationInfo: '',
        };
    }

    private setLifecycleTimeout = (callBack: Function, delay: number) => {
        return setTimeout(() => {
            if (this.selfIsAlive) {
                callBack();
            }
        }, delay);
    }

    private handlePlayEnd = () => {
        this.setState({
            playing: false,
            palyPosition: 0,
        });
        this.videoInstance?.seek(0);
    }

    private switchControl = () => {
        if (this.state.showVideoControl) {
            this.hideControlImmediate()
        } else {
            this.showControlImmediate()
        }
    }

    private hideControlImmediate() {
        this.setState({showVideoControl: false})
        this.videoControlHideTaskId && clearTimeout(this.videoControlHideTaskId);
        this.videoControlHideTaskId = undefined
    }

    private showControlImmediate = () => {
        this.setState({showVideoControl: true})
        this.videoControlHideTaskId && clearTimeout(this.videoControlHideTaskId);
        this.videoControlHideTaskId = this.setLifecycleTimeout(() => {
            this.hideControlImmediate()
        }, 5000);
    }

    private switchScreenState = () => {
        if (this.state.isFullScreen) {
            StatusBar.setHidden(false);
            Orientation.lockToPortrait();
        } else {
            StatusBar.setHidden(true);
            Orientation.lockToLandscape();
        }
        this.setState({
            videoHeight: this.state.isFullScreen ? this.defaultVideoHeight : this.fullScreenVideoHeight,
            isFullScreen: !this.state.isFullScreen,
        });
    }

    private processGoBack = () => {
        if (this.state.isFullScreen) {
            // when swipe gesture to back, control view's touch end event will not be called
            this.touchHandler.onTouchEnd()
            this.switchScreenState();
        } else {
            this.props.navigation.goBack();
        }
        return true;
    }

    private touchHandler = {
        onTouchMove: (event: GestureResponderEvent) => {
            const {pageX, pageY} = event.nativeEvent;
            const xOffset = pageX - this.posX
            const yOffset = pageY - this.posY
            if (this.touchType === -1) {
                // 判定操作类型
                const xOffsetAbs = Math.abs(pageX - this.initPosX)
                const yOffsetAbs = Math.abs(pageY - this.initPosY)
                if (xOffsetAbs > 5 || yOffsetAbs > 5) {
                    clearTimeout(this.longPressTaskId)
                    if (xOffsetAbs * 2 > yOffsetAbs) {
                        // 横向，播放进度
                        this.touchType = 1;
                    } else {
                        const screenWidth = this.state.isFullScreen ? constants.WINDOW_HEIGHT : constants.WINDOW_WIDTH;
                        // 纵向，控制音量和亮度
                        if (pageX < screenWidth / 2) {
                            this.touchType = 2;   // 亮度
                        } else {
                            this.touchType = 3;   // 音量
                        }
                    }
                }
                return
            } else {
                // 响应
                switch (this.touchType) {
                    case 1:
                        this.showControlImmediate();
                        this.seeking = true;
                        const playPos = xOffset > 0 ? Math.min(this.state.videoFullTime, this.state.playPosition + xOffset * 2) :
                            Math.max(0, this.state.playPosition + xOffset * 2);
                        this.setState({
                            playPosition: playPos,
                            noticeInfo: `${convertSecondToTime(playPos, this.state.videoFullTime)} / ${convertSecondToTime(this.state.videoFullTime, this.state.videoFullTime)}`,
                        });
                        break;
                    case 2:
                        this.showControlImmediate();
                        if (yOffset > 0) {
                            screenBrightness = Math.max(0, screenBrightness - yOffset * 0.1);
                        } else {
                            screenBrightness = Math.min(10, screenBrightness - yOffset * 0.1);
                        }
                        this.setState({
                            noticeInfo: `亮度：${Math.floor(screenBrightness * 10)}%`,
                        });
                        SystemSetting.setBrightnessForce(screenBrightness);
                        break;
                    case 3:
                        this.showControlImmediate();
                        if (yOffset > 0) {
                            // 音量-
                            this.setState({
                                volume: Math.max(0, this.state.volume - yOffset * 0.008),
                                noticeInfo: `音量：${Math.floor(this.state.volume * 100)}%`,
                            });
                        } else {
                            // 音量+
                            this.setState({
                                volume: Math.min(1, this.state.volume - yOffset * 0.008),
                                noticeInfo: `音量：${Math.floor(this.state.volume * 100)}%`,
                            });
                        }
                        break;
                    case 4:
                        break;
                    default:
                        break;
                }
            }
            this.posX = pageX;
            this.posY = pageY;
        },
        onTouchStart: (event: GestureResponderEvent) => {
            this.curShowVideoControl = this.state.showVideoControl;
            const {locationX, locationY} = event.nativeEvent;
            this.posX = this.initPosX = locationX;
            // control组件下偏移量45
            this.posY = this.initPosY = locationY + 45;
            this.touchStartTime = Date.now();
            this.longPressTaskId = this.setLifecycleTimeout(() => {
                if (this.touchType === -1) {
                    this.touchType = 4
                    this.setState({ noticeInfo: '倍速播放中', playRate: 3 })
                    this.hideControlImmediate()
                    this.longPressTaskId = undefined
                }
            }, 1000)
        },
        onTouchEnd: () => {
            this.posX = this.initPosX = this.posY = this.initPosY = undefined;
            this.setState({noticeInfo: ''});
            this.longPressTaskId && clearTimeout(this.longPressTaskId)
            this.longPressTaskId = undefined
            switch (this.touchType) {
                case 1:
                    this.videoInstance?.seek(this.state.playPosition);
                    this.setLifecycleTimeout(() => this.seeking = false, 1000);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    //长按
                    this.setState({ playRate: 1 })
                    break;
                default:
                    // 点击
                    this.showControlImmediate();
                    if (this.touchScreenTaskId) {
                        // 双击 播放/暂停
                        this.setState({
                            playing: !this.state.playing,
                        });
                        clearTimeout(this.touchScreenTaskId);
                        this.touchScreenTaskId = undefined;
                    } else {
                        // 单击，切换控制层状态
                        this.touchScreenTaskId = this.setLifecycleTimeout(() => {
                            this.curShowVideoControl === this.state.showVideoControl && this.switchControl();
                            this.touchScreenTaskId = undefined;
                        },300);
                    }
                    break;
            }

            this.touchType = -1;
        },
    }

    private orientationListener = (type: OrientationType) => {
        if (type === 'PORTRAIT') {
            this.setState({
                isFullScreen: false,
                videoHeight: this.defaultVideoHeight,
            });
            StatusBar.setHidden(false);
        }
    }

    private onVideoLoad = (data: OnLoadData) => {
        this.setState({videoFullTime: data.duration}, () => {
            if (this.props.lastSeek) {
                this.videoInstance?.seek(this.props.lastSeek)
                this.setState({locationInfo: `已为您定位至${convertSecondToTime(this.props.lastSeek, this.props.lastSeek)}`})
                Animated.timing(this.locationInfoAnimatedLeft, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                }).start()
                this.setLifecycleTimeout(() => Animated.timing(this.locationInfoAnimatedLeft, {
                    toValue: -200,
                    duration: 500,
                    useNativeDriver: false
                }).start(), 2500)
            }
        });
    }

    componentDidMount(): void {
        BackHandler.addEventListener('hardwareBackPress', this.processGoBack);
        Orientation.addLockListener(this.orientationListener);
    }
    componentWillUnmount(): void {
        this.selfIsAlive = false;
        BackHandler.removeEventListener('hardwareBackPress', this.processGoBack);
        Orientation.removeLockListener(this.orientationListener);
        this.props.onBack && this.props.onBack(this.state.playPosition);
    }


    render(): React.ReactNode {
        const style = StyleSheet.create({
            videoWrapper: {
                width: '100%',
                height: this.state.videoHeight,
                backgroundColor: '#000',
            },
            video: {
                width: '100%',
                height: '100%',
            },
            videoControl: {
                position: 'absolute',
                width: '100%',
                height: this.state.videoHeight,
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
                height: this.state.videoHeight - 90,
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
            locationInfoContent: {
                fontSize: 13,
                color: TOMATOX_THEME.FONT_COLOR,
                position: 'absolute',
                top: this.state.videoHeight - 80,
                backgroundColor: TOMATOX_THEME.COMPONENT_DARK_BACKGROUND,
                paddingTop: 7,
                paddingBottom: 7,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 4,
                left: 15,
                zIndex: 10,
            },
            videoControlBottom: {
                top: this.state.videoHeight - 90,
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

        if (!this.props.src) {
            return <View style={style.videoWrapper} />
        }
        return (
            <View style={style.videoWrapper}>
                {
                    this.state.showVideoControl &&
                    <View style={style.videoControl}>
                        <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']} style={style.videoControlTop}>
                            <TouchableOpacity onPress={this.processGoBack}>
                                <Icon name={'chevron-left'} style={style.topBtn} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name={'airplay'} style={style.topBtnRight} />
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                                        style={style.videoControlBottom}>
                            <TouchableOpacity onPress={() => {this.showControlImmediate(); this.setState({ playing: !this.state.playing });}}>
                                <Icon name={this.state.playing ? 'pause' : 'play'} style={style.videoPlayPause}/>
                            </TouchableOpacity>
                            <Slider
                                style={style.videoSlider}
                                value={this.state.playPosition}
                                minimumValue={0}
                                maximumValue={this.state.videoFullTime}
                                minimumTrackTintColor={TOMATOX_THEME.THEME_COLOR}
                                maximumTrackTintColor={TOMATOX_THEME.UNIMPORTANT_FONT_COLOR}
                                thumbTintColor={TOMATOX_THEME.THEME_COLOR}
                                onTouchStart={() => this.seeking = true}
                                onSlidingComplete={() => {this.videoInstance?.seek(this.curTimeCache); this.setLifecycleTimeout(() => this.seeking = false, 1000);}}
                                onValueChange={value => {this.curTimeCache = value; this.setState({playPosition: value}); this.showControlImmediate();}}
                            />
                            <Text style={style.videoProcess}>
                                {`${convertSecondToTime(this.state.playPosition, this.state.videoFullTime)}/${convertSecondToTime(this.state.videoFullTime, this.state.videoFullTime)}`}
                            </Text>
                            <TouchableOpacity onPress={this.switchScreenState}>
                                <Icon name={this.state.isFullScreen ? 'minimize' : 'maximize'} style={style.videoFullScreen} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                }
                <View
                    style={style.videoControlCenter}
                    {...this.touchHandler}
                >
                    {
                        Boolean(this.state.noticeInfo || this.state.bufferingInfo) &&
                        <Text style={style.videoControlCenterContent}>{this.state.noticeInfo || this.state.bufferingInfo}</Text>
                    }
                </View>
                <Animated.View style={{left: this.locationInfoAnimatedLeft}}>
                    <Text style={style.locationInfoContent}>{this.state.locationInfo}</Text>
                </Animated.View>
                <Video
                    ref={(instance: Video) => this.videoInstance = instance}
                    onLoad={this.onVideoLoad} // when loaded, record fullTime
                    onProgress={data => !this.seeking && this.setState({playPosition: data.currentTime})} // update cur play time
                    onEnd={() => this.props.playNext(this.handlePlayEnd)}    // auto play next
                    onTouchEnd={() => {this.touchScreenTaskId = 9999; this.switchControl(); setTimeout(() => {this.touchScreenTaskId = undefined}, 300)}}
                    rate={this.state.playRate}
                    paused={!this.state.playing}
                    repeat={false}
                    volume={this.state.volume}
                    source={{uri: this.props.src}}
                    style={style.video}
                    resizeMode={'contain'}
                    fullscreen={this.state.isFullScreen}
                    onError={e => console.log(e)}
                    // onLoadStart={() => setProcessCenterInfo('加载中，请稍候...')}
                    onBuffer={({isBuffering}) => this.setState({bufferingInfo: isBuffering ? '正在缓冲...' : ''})}
                />
            </View>
        );
    }
}
