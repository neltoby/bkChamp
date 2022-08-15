import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import { Button, Container, Content, Form, Spinner, Toast } from 'native-base';
import React, { useState } from 'react';
// import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import {
  Alert, BackHandler, Image, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { exitLogin } from '../actions/login';
import { loginRequest } from '../actions/request';
import deviceSize from '../processes/deviceSize';
import logo from '../processes/image';
import isJson from '../processes/isJson';
import Overlay from './Overlay';
import Rolling from './Rolling';

const Login = ({ navigation, route }) => {
  const windowHeight = deviceSize().deviceHeight;
  const deviceWidth = deviceSize().deviceWidth;
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [notVisible, setNotVisible] = useState(true);
  const dispatch = useDispatch();
  const store = isJson(useSelector((state) => state));
  const exit = store.login.exitLogin;
  const signUpMsg = route.params;
  const [loginAlert, setloginAlert] = useState(false);
  
  if (signUpMsg) setloginAlert(signUpMsg.open);
  
  const signUp = () => {
    navigation.navigate('SignUp');
  };

  const _renderSignUpMsg = () => {
    Alert.alert('Login', signUpMsg.msg, [
      { text: 'OK', onPress: () => setloginAlert(false) },
    ]);
  };
  const submit = async () => {
    try {
      if (username.trim().length && password.length) {
        const { isConnected, isInternetReachable } =
          await Network.getNetworkStateAsync();
        const airplane = await Network.isAirplaneModeEnabledAsync();
        if (airplane) {
          Toast.show({
            text: `Offline mode`,
            buttonText: 'CLOSE',
            type: 'danger'
          });
        } else {
          if (isConnected && isInternetReachable) {
            let body = { username, password };
            dispatch(loginRequest(body));
          }
        }
      } else {
        Toast.show({
          text: `Username and password required`,
          buttonText: 'CLOSE',
          type: "danger"
        });
      }
    } catch (error) {
      null
      Toast.show({
        text: `Network request failed`,
        buttonText: 'CLOSE',
        type: 'danger'
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        dispatch(exitLogin(true));
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      if (store.login.login === 'LOGGEDIN') {
        navigation.navigate('Home');
      }
    }, [store.login.login])
  );

    (store.request.status === 'failed' && store.request.err)
      ? Toast.show({
        text: store.request.err,
        buttonText: 'CLOSE',
        duration: 5000,
        type: 'danger',
      })
      : null;
  return (
    <Container style={style.content}>
      <LinearGradient
        colors={['transparent', '#e1efef']}
        style={{ ...style.gradient, height: windowHeight }}
      />
      <Content>
        <StatusBar backgroundColor="#054078" />
        <View style={style.container}>
          <View style={style.viewImg}>
            <Image style={style.img} source={logo()} />
          </View>
          <View style={style.divider}>
            <View style={style.divider1}>
              <Text style={{ ...style.text, fontSize: 25, fontWeight: 'bold' }}>
                LOGIN
              </Text>
            </View>
            <View style={style.divider2}>
              <TouchableOpacity style={style.button} onPress={signUp}>
                <Text style={style.text}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={style.viewInput}>
          <Form style={style.form}>
            <Input
              inputStyle={style.input}
              inputContainerStyle={style.inputs}
              label="Username"
              value={username}
              labelStyle={style.label}
              placeholder="Username"
              style={style.input}
              leftIcon={
                <Icon
                  type="font-awesome"
                  name="user-circle"
                  size={24}
                  color="#fff"
                />
              }
              onChangeText={(value) => setUserName(value)}
            />
            <Input
              secureTextEntry={notVisible}
              inputStyle={style.input}
              inputContainerStyle={style.inputs}
              label="Password"
              value={password}
              labelStyle={style.label}
              placeholder="Password"
              style={style.input}
              leftIcon={
                <Icon type="material" name="https" size={24} color="#fff" />
              }
              rightIcon={
                <Text
                  onPress={() => setNotVisible(!notVisible)}
                  style={{ color: "#fff" }}
                >
                  {notVisible ? "Show" : "Hide"}
                </Text>
              }
              onChangeText={(value) => setPassword(value)}
            />
            <Text style={{ fontSize: 14, color: "white", marginLeft: 10 }} onPress={async () => await Linking.openURL('https://thebookchamp.com/password_reset')}>Forgot Password?</Text>

            <Button
              disabled={store.login.status === 'loading' ? true : false}
              block
              style={style.but}
              onPress={() => submit()}>
              {store.login.status === 'loading' ? (
                <Spinner color="#eee" />
              ) : (
                <Text style={{ ...style.label, fontWeight: 'bold' }}>
                  LOGIN
                </Text>
              )}
            </Button>
          </Form>
        </View>
        <Overlay isVisible={store.login.status === 'loading' ? true : false}>
          <Rolling text="Logging In..." />
        </Overlay>
        {/* <Modal
            useNativeDriver={true}
            visible={exit}
            swipeDirection={['up', 'down']} // can be string or an array
            swipeThreshold={200} // default 100
            onSwipeOut={event => dispatch(exitLogin(false))}
            onHardwareBackPress={() => dispatch(exitLogin(false))}
            modalTitle={<ModalTitle title='Exit?' />}
            footer={
                <ModalFooter>
                <ModalButton
                    text="No"
                    onPress={() => dispatch(exitLogin(false))}
                />
            <ModalButton
                    text="Yes"
                    onPress={() => BackHandler.exitApp()}
                />
                </ModalFooter>
            }
        >
            <ModalContent>
                <View style={style.showView}>
                    <Text style={style.warning}>
                        Are you sure you want to exit?
                    </Text>
                </View>
            </ModalContent>
        </Modal> */}
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  content: {
    backgroundColor: '#054078',
  },
  container: {
    alignItems: 'center',
  },
  viewImg: {
    marginVertical: 60,
  },
  img: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
  },
  divider: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  divider1: {
    flexDirection: 'row',
    width: '50%',
    paddingRight: 30,
    justifyContent: 'flex-end',
  },
  divider2: {
    width: '50%',
    paddingLeft: 30,
  },
  viewInput: {
    alignItems: 'center',
  },
  form: {
    width: '80%',
  },
  input: {
    color: '#fff',
  },
  inputs: {
    borderColor: '#fff',
  },
  text: {
    fontSize: 23,
    fontWeight: '500',
    color: '#fff',
  },
  label: {
    color: '#fff',
  },
  but: {
    backgroundColor: '#1258ba',
    marginTop: 50,
    borderRadius: 50
  },
});

export default Login;
