import { useFocusEffect } from '@react-navigation/native';
import { passwordStrength } from 'check-password-strength';
import { Button as NButton, Content, Toast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, View, Linking } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import { createUserLoading, verification } from '../actions/login';
import { idleRequest, signUp } from '../actions/request';
import deviceSize from '../processes/deviceSize';
import logo from '../processes/image';
import { deleteKey, getKey, storeKey } from '../processes/keyStore';
import { confirm, loginValue } from '../processes/lock';
import Container from './Container';
import Overlay from './Overlay';

const checkPasswordStrength = (value) => {
    if (value) {
        null
        return passwordStrength(value);
    }
    return '';
}

const SignUp = ({ navigation, route }) => {
      const deviceWidth = deviceSize().deviceWidth;
  const deviceHeight = deviceSize().deviceHeight;
    const dispatch = useDispatch();
    const [notVisible, setNotVisible] = useState(true)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrengthContent, setPasswordStrengthContent] = useState({})
    const [passwordStr, setPasswordStr] = useState('');
    const validator = new SimpleReactValidator();
     const loading = useSelector((state) => state.login).createUser;
    const errSignUp = useSelector((state) => state.login).signUpErr;
    
//     useFocusEffect(
//         React.useCallback(() => {
//         if (errSignUp !== null) {
//             null
//             Toast.show({
//             type: "danger",
//             text: errSignUp.split(":")[1],
//             buttonText: 'CLOSE',
//             duration: 5000,

//             });
//         }
//         return () => { };
//         }, [errSignUp])
//   );

    const onSuccess = () => {
         dispatch(idleRequest())
         Toast.show({
            type: "success",
            text: "You've successfully registered!",
            buttonText: 'CLOSE',
            duration: 5000,

            });
    navigation.navigate('ConfirmNumber');
    // setVisible(false)
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

    const handleSignUp = async () => {
        let phone_number =
          phone.length === 10 ? `0${phone}` : phone;
        const payload = {
            fullname: name,
            email,
            phone_number,
            password,
            username: name.trim().split(" ").join("")
        }
        console.log(payload)
      dispatch(createUserLoading());
      // To be restored to VerificationBody once email verification is online
      const val = await getKey(confirm);
      if (val !== undefined && val !== null) {
            await storeKey(loginValue, val);
            await deleteKey(confirm);
            // verification state set to false indicates that user is verified and confirm token removed
            dispatch(verification(false));
            // navigation.navigate('Welcome');
      } else {
          dispatch(verification(true))
      }
        dispatch(signUp(payload, onSuccess, onFail))
        
    //   setUserName('');
    }

    const validate = () => {
        if (validator.allValid()) {
            if (name.trim().split(' ').length > 1) {
                if (passwordStr && passwordStr !== 'Too weak') {
                    handleSignUp()
                    // console.log(name, phone, email, password)
                    // navigation.navigate('Username', {
                    //     name, email, phone, password
                    // })
                } else {
                    if (!passwordStr) {
                        Toast.show({
                            text: "Password is missing!",
                            buttonText: "CLOSE",
                            duration: 3000,
                            type: "danger"
                        })
                    }
                    if (passwordStr === 'Too weak') {
                        Toast.show({
                            type: "danger",
                            text: "Password is too weak!",
                            buttonText: "CLOSE",
                            duration: 3000
                        })
                    }
                }
            } else {
                Toast.show({
                    type: "danger",
                    text: "Other name is missing!",
                    buttonText: "CLOSE",
                    duration: 3000
                })
            }
        } else {
            let nErr = { ...validator.getErrorMessages() }
            if (nErr.Fullname) {
                Toast.show({
                    type: "danger",
                    text: nErr.Fullname,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Email) {
                Toast.show({
                    type: "danger",
                    text: nErr.Email,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Phone) {
                Toast.show({
                    type: "danger",
                    text: nErr.Phone,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Password) {
                Toast.show({
                    type: "danger",
                    text: nErr.Password,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            }
        }
    }
    const login = () => {
        navigation.navigate('Login')
    }
    const checkPassword = (value) => {
        setPassword(value);
        const val = checkPasswordStrength(value)
        if (val) {
            setPasswordStr(checkPasswordStrength(value).value);
            setPasswordStrengthContent(val)
        } else {
            setPasswordStr(val);
            setPasswordStrengthContent({});
        }

    }
    useEffect(() => {
        if (route.params?.name) {
            setName(route.params.name)
        }
        if (route.params?.email) {
            setEmail(route.params.email)
        }
        if (route.params?.phone) {
            setPhone(route.params.phone)
        }
        if (route.params?.password) {
            setPassword(route.params?.password)
        }
        return () => {
        }
    }, [route.params])
    return (
        <Container style={{ backgroundColor: '#054078' }}>
            <Content contentContainerStyle={{ alignItems: 'center' }} style={style.container}>
                <StatusBar backgroundColor="#054078" />
                <View style={{ ...style.viewImg, marginBottom: 20 }}>
                    <View style={style.imageView}>
                        <Image source={logo()} style={style.img} />
                    </View>
                    <View style={style.signUpContainer}>
                        <View style={style.textContainer}>
                            <Text style={style.signUp}>SIGN UP </Text>
                        </View>
                        <View style={style.demContainer}>
                            <Text style={style.demacation}>  /  </Text>
                        </View>
                        <View style={style.loginConatiner}>
                            <Text onPress={login} style={style.login}> LOGIN</Text>
                        </View>
                    </View>
                    {validator.message('Fullname', name, 'required|alpha_num_dash_space|min:4|max:30')}
                    {validator.message('Email', email, 'required|email')}
                    {validator.message('Phone', phone, 'required|phone')}
                </View>
                <View style={style.const}>
                    <Input
                        label='Full Name'
                        labelStyle={style.label}
                        inputContainerStyle={style.inputs}
                        inputStyle={style.input}
                        placeholder='Full Name'
                        autoCompleteType='name'
                        leftIcon={
                            <Icon
                                type='material'
                                name='person'
                                size={24}
                                color='#fff'
                            />
                        }
                        onChangeText={value => setName(value)}
                    />
                    <Input
                        label='Email'
                        labelStyle={style.label}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCompleteType='email'
                        inputContainerStyle={style.inputs}
                        inputStyle={style.input}
                        leftIcon={
                            <Icon
                                type='material'
                                name='email'
                                size={24}
                                color='#fff'
                            />
                        }
                        onChangeText={value => setEmail(value)}
                    />
                    <Input
                        label='Phone Number'
                        labelStyle={style.label}
                        placeholder="Phone Number"
                        autoCompleteType='tel'
                        keyboardType="numeric"
                        inputContainerStyle={style.inputs}
                        inputStyle={style.input}
                        leftIcon={
                            <NButton transparent>
                                <Text style={style.phoneText}>
                                    +234
                                </Text>
                            </NButton>
                        }
                        rightIcon={
                            <Icon
                                type='material'
                                name='call'
                                size={24}
                                color='#fff'
                            />
                        }
                        onChangeText={value => setPhone(value)}
                    />
                    <View style={style.passwordContainer}>
                        <Input
                            secureTextEntry={notVisible}
                            label='Password'
                            labelStyle={style.label}
                            placeholder="Password"
                            keyboardType='default'
                            autoCompleteType='password'
                            inputContainerStyle={style.inputs}
                            inputStyle={style.input}
                            leftIcon={
                                <Icon
                                    type='material'
                                    name='https'
                                    size={24}
                                    color='#fff'
                                />
                            }
                            rightIcon={
                                <Text
                                onPress={() => setNotVisible(!notVisible)}
                                style={{ color: "#fff" }}
                                >
                                {notVisible ? "Show" : "Hide"}
                                </Text>
                            }
                            onChangeText={value => checkPassword(value)}
                        />
                        <Text style={{ fontSize: 10, color: "white" }}>passwords must have at least one capital case, lower case, number and special character</Text>
                        {
                            passwordStr ? (
                                <View style={style.passwordStrContainer}>
                                    <View
                                        style={{
                                            ...style.passwordStrength,
                                            backgroundColor: passwordStr === 'Too weak' ? 'red' :
                                                passwordStr === 'Weak' ? 'orange' :
                                                    passwordStr === 'Medium' ? 'yellow' : 'green'
                                        }}
                                    />
                                    <View style={style.passwordStrText}>
                                        <Text
                                            style={{
                                                ...style.passwordText,
                                                color: passwordStr === 'Too weak' ? 'red' :
                                                    passwordStr === 'Weak' ? 'orange' :
                                                        passwordStr === 'Medium' ? 'yellow' : 'green'
                                            }}>
                                            {passwordStr}
                                        </Text>
                                    </View>
                                </View>
                            ) : null
                        }
                    </View>

                    <View style={{ ...style.viewImg, marginTop: 20, width: '100%', paddingHorizontal: 7 }}>
                        <NButton
                            onPress={validate}
                            style={{ backgroundColor: '#1258ba', width: '100%', borderRadius: 50 }}
                            full
                        >
                            <Text style={{ color: '#fff' }}>Sign Up</Text>
                            <Icon
                                type='font-awesome'
                                name="chevron-circle-right"
                                size={20}
                                color="#fff"
                                containerStyle={{ marginLeft: 8 }}
                            />
                        </NButton>
          <Text style={{ color: "white", fontSize: 10, padding: 37 }}>By Signing up you agree to our <Text style={{ color: 'blue' }} onPress={async () => await Linking.openURL('http://thebookchamp.com/privacy')}>Privacy Policy</Text></Text>

                    </View>
                </View>
                 {loading && (
        <Overlay
          isVisible={true}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}>
          <View style={style.createUser}>
            <View style={style.activity}>
              <ActivityIndicator color="#054078" size={24} />
            </View>
            <View style={style.cUserContainer}>
              <Text numberOfLines={1} style={style.cUserText}>
                signing you up ...
              </Text>
            </View>
          </View>
        </Overlay>
      ) }
            </Content>
        </Container>

    )
}

const style = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    container: {
        flex: 1,
    },
    imageView: {
        marginVertical: 20,
        alignItems: 'center',
    },
    signUpContainer: {
        flexDirection: 'row',
    },
    textContainer: {
        width: '45%',
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    loginConatiner: {
        width: '45%',
        flexDirection: 'row',
        paddingLeft: 20,
    },
    demConatiner: {
        width: '10%',
    },
    login: {
        color: '#eee',
        fontSize: 23,
    },
    phoneText: {
        color: '#fff',
        fontSize: 18,
    },
    const: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: '#fff',
    },
    inputs: {
        borderColor: '#fff',
    },
    passwordContainer: {
        width: '100%',
    },
    passwordStrContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    passwordStrength: {
        flex: 0.1,
        height: 9,
        borderRadius: 2
    },
    passwordStrText: {
        position: 'relative',
        flex: 0.9,
        paddingLeft: 5,
        justifyContent: 'flex-start',
        paddingTop: 0,
    },
    passwordText: {
        position: 'absolute',
        top: -7,
        left: 5,
        paddingTop: 0,
        marginTop: 0,
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    viewImg: {
        margin: 10,
        alignItems: 'center',
    },
    signUp: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    label: {
        color: '#fff'
    },
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

})
export default SignUp