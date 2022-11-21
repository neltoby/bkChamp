import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LOGGEDIN } from '../actions/login';
import isJson from '../processes/isJson';
import ConfirmNumber from './ConfirmNumber';
import FinishSignUp from './FinishSignUp';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import UploadDp from './UploadDp';
// import ErrorBoundary from './ErrorBoundary'
// import ErrorUi from './ErrorUi'
import Username from './Username';
import Welcome from './Welcome';

const Stack = createStackNavigator();

const Manager = () => {
  const store = isJson(useSelector((state) => state));
  // null
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          {store.login.login !== LOGGEDIN ? (
            <Stack.Navigator
              initialRouteName={
                store.login.verification ? 'ConfirmNumber' : 'Login'
              }>
              <Stack.Screen
                name="Username"
                component={Username}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ConfirmNumber"
                component={ConfirmNumber}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UploadDp"
                component={UploadDp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='FinishSignUp'
                component={FinishSignUp}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              initialRouteName={
                store.login.welcome === 'Home' ? 'Home' : 'Welcome'
              }>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};
export default Manager;
