import React from 'react';
import 'react-native-gesture-handler';
import CustomContainer from './src/components/navigatior/custom-container';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StatusBar} from "react-native";

Orientation.lockToPortrait();

const App = () => {
  return (
      <SafeAreaProvider style={{ backgroundColor: '#2b2b2b' }}>
          <StatusBar
              backgroundColor={'#2b2b2b'}
          />
          <CustomContainer />
      </SafeAreaProvider>
      );
};

export default App;
