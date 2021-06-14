import React from 'react';
import Video from 'react-native-video';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import {BackHandler, GestureResponderEvent, StatusBar, StyleSheet, Text, View} from 'react-native';
import constants from '../../utils/constants';
import {convertSecondToTime} from '../../utils/time-converter';
import SystemSetting from 'react-native-system-setting';
import {TOMATOX_THEME} from '../../utils/theme';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';

let screenBrightness = 1;

export default class TomatoxVideo extends React.Component<{src: string, playNext: (cb: () => void) => void, navigation: any}, any>{
    private videoInstance: Video|undefined
    private seeking = false
    private curTimeCache = 0
    private defaultVideoHeight = 250
    private fullScreenVideoHeight = constants.WINDOW_WIDTH as number
    private touchStartTime = 0
    private videoControlHideTaskId: any
    private touchScreenTaskId: any
    private posX:any
    private posY:any
    private touchMoveCount = 0
    private touchType = -1
    private curShowVideoControl = false

    constructor(props: any) {
        super(props);
        this.state = {
            playing: true,
            playPosition: 0,
            videoFullTime: 0,
            volume: 1,
            isFullScreen: false,
            showVideoControl: false,
            noticeInfo: '',
            videoHeight: this.defaultVideoHeight,
            bufferingInfo: '',
        };
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
            this.videoControlHideTaskId && clearTimeout(this.videoControlHideTaskId);
            this.videoControlHideTaskId = undefined;
        } else {
            this.videoControlHideTaskId = setTimeout(() => {
                this.setState({
                    showVideoControl: false,
                });
                this.videoControlHideTaskId = undefined;
            }, 5000);
        }
        this.setState({
            showVideoControl: !this.state.showVideoControl,
        });
    }

    private resetControlShowTimmer = () => {
        this.setState({
            showVideoControl: true,
        });
        this.videoControlHideTaskId && clearTimeout(this.videoControlHideTaskId);
        this.videoControlHideTaskId = setTimeout(() => {
            this.setState({
                showVideoControl: false,
            });
            this.videoControlHideTaskId = undefined;
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
        this.resetControlShowTimmer();
    }

    private processGoBack = () => {
        if (this.state.isFullScreen) {
            this.switchScreenState();
        } else {
            this.props.navigation.goBack();
        }
        return true;
    }

    private touchHandler = {
        onTouchMove: (event: GestureResponderEvent) => {
            this.resetControlShowTimmer();
            const {pageX, pageY} = event.nativeEvent;
            const xOffset = pageX - this.posX;
            const yOffset = pageY - this.posY;
            if (this.touchMoveCount <= 2) {
                this.touchMoveCount++;
                if (this.touchMoveCount === 1) {
                    this.posX = pageX;
                    this.posY = pageY;
                }
                if (this.touchMoveCount === 2) {
                    if (Math.abs(xOffset) > Math.abs(yOffset)) {
                        this.touchType = 1;   // 横向，控制进度
                    } else {
                        const width = this.state.isFullScreen ? constants.WINDOW_HEIGHT : constants.WINDOW_WIDTH;
                        // 纵向，控制音量和亮度
                        if (pageX < width / 2) {
                            this.touchType = 2;   // 亮度
                        } else {
                            this.touchType = 3;   // 音量
                        }
                    }
                }
                return;
            }
            switch (this.touchType) {
                case 1:
                    this.seeking = true
                    const playPos = xOffset > 0 ? Math.min(this.state.videoFullTime, this.state.playPosition + xOffset * 2) :
                        Math.max(0, this.state.playPosition + xOffset * 2);
                    this.setState({
                        playPosition: playPos,
                        noticeInfo: `${convertSecondToTime(playPos, this.state.videoFullTime)} / ${convertSecondToTime(this.state.videoFullTime, this.state.videoFullTime)}`,
                    });
                    break;
                case 2:
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
                            noticeInfo: `音量：${Math.floor(this.state.volume * 100)}%`
                        });
                    }
                    break;
                default:
                    break;
            }
            this.posX = pageX;
            this.posY = pageY;
        },
        onTouchStart: (event: GestureResponderEvent) => {
            this.curShowVideoControl = this.state.showVideoControl;
            const {locationX, locationY} = event.nativeEvent;
            this.posX = locationX;
            this.posY = locationY;
            this.touchStartTime = Date.now();
        },
        onTouchEnd: () => {
            const now = Date.now();
            this.posX = undefined;
            this.posY = undefined;
            this.touchMoveCount = 0;
            this.setState({noticeInfo: ''});
            switch (this.touchType) {
                case 1:
                    this.videoInstance?.seek(this.state.playPosition);
                    setTimeout(() => this.seeking = false, 1000);
                    break;
                case 2:
                case 3:
                default:
                    break;
            }
            this.touchType = -1;

            if (now - this.touchStartTime < 200) {   // 点击操作
                if (this.touchScreenTaskId) {
                    // 双击 播放/暂停
                    this.setState({
                        playing: !this.state.playing,
                    });
                    clearTimeout(this.touchScreenTaskId);
                    this.touchScreenTaskId = undefined;
                    this.resetControlShowTimmer();
                } else {
                    // 单击，切换控制层状态
                    this.touchScreenTaskId = setTimeout(() => {
                        this.curShowVideoControl === this.state.showVideoControl && this.switchControl();
                        this.touchScreenTaskId = undefined;
                    },500);
                }
            }
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

    componentDidMount(): void {
        BackHandler.addEventListener('hardwareBackPress', this.processGoBack)
        Orientation.addLockListener(this.orientationListener);
    }
    componentWillUnmount(): void {
        BackHandler.removeEventListener('hardwareBackPress', this.processGoBack)
        Orientation.removeLockListener(this.orientationListener);
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
                            <TouchableOpacity onPress={() => {this.resetControlShowTimmer(); this.setState({ playing: !this.state.playing });}}>
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
                                onSlidingComplete={() => {this.videoInstance?.seek(this.curTimeCache); setTimeout(() => this.seeking = false, 1000);}}
                                onValueChange={value => {this.curTimeCache = value; this.setState({playPosition: value}); this.resetControlShowTimmer();}}
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
                <Video
                    ref={(instance: Video) => this.videoInstance = instance}
                    onLoad={data => this.setState({videoFullTime: data.duration})} // when loaded, record fullTime
                    onProgress={data => !this.seeking && this.setState({playPosition: data.currentTime})} // update cur play time
                    onEnd={() => this.props.playNext(this.handlePlayEnd)}    // auto play next
                    onTouchEnd={() => {this.touchScreenTaskId = 123; this.switchControl();}}
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
