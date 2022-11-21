import {
  Body, Content, Header, Left,
  Right, Spinner, Title, Toast
} from 'native-base';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import { login, welcome } from '../actions/login';
import { editUserProfile } from '../actions/request';
import { updateUserinfo } from '../actions/user';
import deviceSize from '../processes/deviceSize';
import logo from '../processes/image';
import Container from './Container';
import FocusAwareStatusBar from './FocusAwareStatusBar';

const Username = ({ navigation, route }) => {
  const [username, setUserName] = useState('');
  const deviceWidth = deviceSize().deviceWidth;
  const deviceHeight = deviceSize().deviceHeight;
  const request_status = useSelector(state => state.request).status
  console.log(request_status)
  const dispatch = useDispatch();
  const skip = () => {
    Alert.alert("Are you sure?", "If you skip this step a default username will be created for you", [
      {
        text: "Ok",
        onPress: nextSlide
      },
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel"
      }
    ])
  }
  const nextSlide = () => {
      dispatch(login())
        dispatch(welcome('Welcome'))
  }
  const onSuccess = () => {
    Toast.show({
      type: "success",
      text: "Username created", 
      buttonText: 'CLOSE',
      duration: 5000,
    })
    dispatch(updateUserinfo({name: "username", value: username}))
  nextSlide()
  };

   const onFail = ({message = null}) => {
        if (message !== null) {
            null
            Toast.show({
            type: "danger",
            text: message.split(":")[1],
            buttonText: 'CLOSE',
            duration: 5000,

            });
        }
    }
  const updateUsername = async () => {
    if (username.trim().length > 1) {

      if (username.trim().split(" ").length === 1) {
        dispatch(editUserProfile({username }, onSuccess, onFail))
      } else {
        Toast.show({
          type: "danger",
          text: "Username may not contain spoaces",
           buttonText: 'CLOSE',
        duration: 3000,
        })
      }
      setUserName('');
    } else {
      Toast.show({
        type: "danger",
        text: 'Please fill a username',
        buttonText: 'CLOSE',
        duration: 3000,
      });
    }
  };
  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const backAction = () => {
  //       handleBack();
  //       return true;
  //     };
  //     BackHandler.addEventListener('hardwareBackPress', backAction);
  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', backAction);
  //     };
  //   }, [])
  // );

  return (
    <>
      <Container>
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#054078"
        />
        <Header transparent>
          <Left>
            {/* <NButton transparent onPress={handleBack}>
              <NativeIcon
                name={Platform.OS == 'ios' ? 'chevron-back' : 'arrow-back'}
              />
            </NButton> */}
          </Left>
          <Body>
            <Title>Book Champ</Title>
          </Body>
          <Right>
            <Image source={logo()} style={style.img} />
          </Right>
        </Header>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={style.usertextContainer}>
            <Text style={style.usertext}>You're almost there!, create a unique username to identify yourself on Book Champ</Text>
          </View>
          <View style={style.inputContainer}>
            <Input
              value={username}
              labelStyle={style.label}
              inputContainerStyle={style.inputs}
              inputStyle={style.input}
              placeholder="Username"
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
          </View>
          <View style={{ ...style.viewImg, marginTop: 20 }}>
            <Button
              onPress={updateUsername}
              raised
              buttonStyle={{ width: 150, backgroundColor: '#1258ba' }}
              type="solid"
              icon={
                <Icon
                  type="font-awesome"
                  name="angle-right"
                  size={20}
                  color="#fff"
                />
              }
              iconRight
              titleStyle={{ marginRight: 10 }}
              title={request_status.status === "awaiting" ? "Creating username...": "Continue"}
            />
            <Text style={style.skipText} onPress={skip}>{"Skip>>"}</Text>
          </View>
          <Text style={{ color: "white", fontSize: 10 }}>By Signing up you agree to our <Text style={{ color: 'blue' }} onPress={async () => await Linking.openURL('http://bookchamp.herokuapp.com/privacy')}>Privacy Policy</Text></Text>
        </Content>
      </Container>
      
    </>
  );
};

//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDcwLCJleHAiOjE2NjIxNzQ2MTV9.RQby_ff1_2ACbidGFfcRjYp-ujGZ1PyeOVeVCNaZLbc
export default Username;

const style = EStyleSheet.create({
    activity: {
    flex: 0.3,
  },
  cUserContainer: {
    flex: 0.7,
  },
  cUserText: {
    fontSize: 16,
    color: '#054078',
  },
  createUser: {
    height: 50,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    color: '#fff',
  },
  img: {
    height: 40,
    width: 40,
  },
  viewImg: {
    margin: 10,
    justifyContent: "space-between",
    alignItems: 'center',
  },
  usertextContainer: {
    alignItems: 'center',
    padding: '2rem'
  },
  usertext: {
    textAlign: "center",
    fontSize: 22,
    color: '#fff',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    color: '#fff',
  },
  inputs: {
    borderColor: '#fff',
  },
  skipText: {
    margin: "3rem",
    color: "#fff",
    fontSize: "1rem"
  }
});
