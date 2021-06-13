import React from 'react';
import 'react-native-gesture-handler';
import CustomContainer from './src/components/navigatior/custom-container';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StatusBar} from 'react-native';
import {TOMATOX_THEME} from './src/utils/theme';

Orientation.lockToPortrait();

const App = () => {
  return (
      <SafeAreaProvider style={{ backgroundColor: TOMATOX_THEME.BACKGROUND_COLOR }}>
          <StatusBar
              backgroundColor={TOMATOX_THEME.BACKGROUND_COLOR}
          />
          <CustomContainer />
      </SafeAreaProvider>
      );
};

export default App;
