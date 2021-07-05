import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import CustomContainer from './src/components/navigatior/custom-container';
import Orientation from 'react-native-orientation-locker';
import {StatusBar, View} from 'react-native';
import {TOMATOX_THEME} from './src/utils/theme';
import initStorage from './src/utils/storage/storage';
import {querySearchIndex} from './src/utils/request';

Orientation.lockToPortrait();

const App = () => {
    const [isInit, setIsInit] = useState(false);
    useEffect(() => {
        querySearchIndex();
        initStorage().then(() => {
            setIsInit(true);
        });
    }, []);

  return isInit ?
      <View style={{ flex:1, backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR }}>
          <StatusBar
              backgroundColor={TOMATOX_THEME.BACKGROUND_COLOR}
              barStyle={'light-content'}
          />
          <View style={{flex: 1}}>
              <CustomContainer />
          </View>
      </View> :
      <></>;
};

export default App;
