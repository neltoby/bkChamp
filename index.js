import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth > 380 ?  16 : 18});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
