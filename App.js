import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/navigation/homescreen';
import ExpenensScreenn from './src/screens/Expenens';
import IncomeScreen from './src/screens/income';

const Stack = createNativeStackNavigator();
function App() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Expenens"
          component={ExpenensScreenn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Income"
          component={IncomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
