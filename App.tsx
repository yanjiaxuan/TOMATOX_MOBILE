import React from 'react';
import 'react-native-gesture-handler';
import CustomContainer from './src/components/navigatior/custom-container';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
      <SafeAreaProvider>
          <CustomContainer />
      </SafeAreaProvider>
      );
};

export default App;
