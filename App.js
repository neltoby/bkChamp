import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Root } from 'native-base';
import * as Font from 'expo-font';
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer/reducer';
import Manager from './component/Manager';
import { getKey } from './processes/keyStore';
import { loginValue, confirm } from './processes/lock';
import { loginWithUser, verification } from './actions/login';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

const store = createStore(reducer, applyMiddleware(thunk));

const App = () => {
  const [isReady, setIsReady] = React.useState(false);
  const prepareResources = async () => {
    try {
      const locaFonts = await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
        ...FontAwesome.font,
        ...FontAwesome5.font,
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
      });
      console.log(locaFonts)
    }
    catch (e) {
      console.log(e, "font w")
    }
    finally {
      const localUris = await Asset.loadAsync([
        require('./assets/learn.png'),
        require('./assets/quiz.png'),
        require('./assets/splashscreen_image.png'),
        require('./img/anonymous.jpg'),
        require('./assets/bill.png'),
        require('./assets/settings.png'),
        require('./assets/question.png'),
        require('./assets/information-button.png'),
        require('./assets/log-out.png')
      ]);
      const val = await getKey(loginValue);
      const value = await getKey(confirm);

      console.log(localUris, "<== localuris");

      if (val !== undefined && val !== null) {
        store.dispatch(loginWithUser(true));
      } else {
        if (value !== undefined && value !== null) {
          store.dispatch(loginWithUser(false));
        }
      }
      setIsReady(true);
      SplashScreen.hideAsync();
    }


  };
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
      prepareResources();
    })();
  }, []);
  return (
    <Provider store={store}>
      {!isReady ? null : (
        <Root>
          <ActionSheetProvider>
            <Manager />
          </ActionSheetProvider>
        </Root>
      )}
    </Provider>
  );
};

export default App;
