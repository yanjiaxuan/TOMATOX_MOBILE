import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import CustomContainer from './src/components/navigatior/custom-container';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StatusBar} from 'react-native';
import {TOMATOX_THEME} from './src/utils/theme';
import initStorage from './src/utils/storage/storage';

Orientation.lockToPortrait();

const App = () => {
    const [isInit, setIsInit] = useState(false)
    useEffect(() => {
        initStorage().then(() => {
            setIsInit(true)
        })
    }, [])

  return isInit ?
      <SafeAreaProvider style={{ backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR }}>
          <StatusBar
              backgroundColor={TOMATOX_THEME.BACKGROUND_COLOR}
          />
          <SafeAreaView style={{flex: 1}}>
              <CustomContainer />
          </SafeAreaView>
      </SafeAreaProvider> :
      <></>
};

export default App;
