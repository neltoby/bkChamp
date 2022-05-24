import React, { useState, useEffect } from 'react'
import logo from '../processes/image'
import SimpleReactValidator from 'simple-react-validator';
import Container from './Container'
import { Content, Toast, Button as NButton } from 'native-base';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { passwordStrength } from 'check-password-strength';

const checkPasswordStrength = (value) => {
    if (value) {
        console.log(passwordStrength(value));
        return passwordStrength(value);
    }
    return '';
}

const SignUp = ({ navigation, route }) => {
    const [notVisible, setNotVisible] = useState(true)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrengthContent, setPasswordStrengthContent] = useState({})
    const [passwordStr, setPasswordStr] = useState('');
    const validator = new SimpleReactValidator();
    const handleSignUp = () => {
        if (validator.allValid()) {
            if (name.trim().split(' ').length > 1) {
                if (passwordStr && passwordStr !== 'Too weak') {
                    navigation.navigate('Username', {
                        name, email, phone, password
                    })
                } else {
                    if (!passwordStr) {
                        Toast.show({
                            text: "Password is missing!",
                            buttonText: "CLOSE",
                            duration: 3000
                        })
                    }
                    if (passwordStr === 'Too weak') {
                        Toast.show({
                            text: "Password is too weak!",
                            buttonText: "CLOSE",
                            duration: 3000
                        })
                    }
                }
            } else {
                Toast.show({
                    text: "Other name is missing!",
                    buttonText: "CLOSE",
                    duration: 3000
                })
            }
        } else {
            let nErr = { ...validator.getErrorMessages() }
            if (nErr.Fullname) {
                Toast.show({
                    text: nErr.Fullname,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Email) {
                Toast.show({
                    text: nErr.Email,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Phone) {
                Toast.show({
                    text: nErr.Phone,
                    buttonText: "CLOSE",
                    duration: 3000
                })
            } else if (nErr.Password) {
                Toast.show({
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
                                <Icon
                                    type='font-awesome'
                                    name={notVisible ? 'eye' : 'eye-slash'}
                                    size={24}
                                    color='#fff'
                                    onPress={() => setNotVisible(!notVisible)}
                                />
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
                            onPress={() => handleSignUp()}
                            style={{ backgroundColor: '#1258ba', width: '100%', borderRadius: 50 }}
                            full
                        >
                            <Text style={{ color: '#fff' }}>CONTINUE</Text>
                            <Icon
                                type='font-awesome'
                                name="chevron-circle-right"
                                size={20}
                                color="#fff"
                                containerStyle={{ marginLeft: 8 }}
                            />
                        </NButton>
                    </View>
                </View>
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
    }
})
export default SignUp