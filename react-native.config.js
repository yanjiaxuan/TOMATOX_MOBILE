// fix onBuffer in react-native-video not work
module.exports = {
    dependencies: {
        'react-native-video-new': {
            platforms: {
                android: {
                    sourceDir: '../node_modules/react-native-video-new/android-exoplayer',
                },
            },
        },
    },
};
