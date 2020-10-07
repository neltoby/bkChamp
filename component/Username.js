import React, {useState, useEffect } from 'react'
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import logo from '../processes/image'
import Container from './Container'
import ErrorBoundary from './ErrorBoundary'
import ErrorUi from './ErrorUi'
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { View, Text, StyleSheet, Image,  Platform } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { Header, Content, Left, Right, Body, Title, Icon as NativeIcon, Button as NButton } from 'native-base';
import { vNumber } from '../actions/login'
import { signUp } from '../actions/request'
import { useDispatch } from 'react-redux';

const Username = ({ navigation, route }) => {
    const [username, setUserName] = useState('')
    // const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    // const [phone, setPhone] = useState('')
    // const [password, setPassword] = useState('')
    const details = {}
    details['name'] = route.params.name
    details['email'] = route.params.email
    details['phone_number'] = route.params.phone
    details['password'] = route.params.password
    console.log(details)

    const dispatch = useDispatch()
    
    const handleBack = () => {
        navigation.navigate('SignUp', {
            name: details.name, email: details.email, phone: details.phone_number, password: details.password
        })
    }
    const nextSlide = () => {        
        navigation.navigate('ConfirmNumber')
        // setVisible(false)
    }
    const handleSignUp = () => {
        dispatch(vNumber(23456))
        console.log(details)
        // dispatch(signUp({...details, username }, nextSlide))
        setUserName('')
        nextSlide()
    }
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                handleBack()
                return false                                             
            }

            BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            }
        }, [])
    )
    
    return(
        <ErrorBoundary ui={<ErrorUi />}>
            <Container>
                <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
                <Header transparent >
                    <Left>
                        <NButton transparent onPress = {handleBack}>
                            <NativeIcon name={Platform.OS == 'ios' ? 'chevron-back' : 'arrow-back'} />
                        </NButton>
                    </Left>
                    <Body>
                        <Title>Book Champ</Title>
                    </Body>
                    <Right>
                        <Image source={logo()} 
                        style={style.img} />
                    </Right>
                </Header>
                <Content 
                    contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}} 
                >       
                    <View style={style.usertextContainer}>
                        <Text style={style.usertext}>
                            Create a username
                        </Text> 
                    </View>
                    <View style={style.inputContainer}>
                    <Input
                        value = {username}
                        label = 'Username'
                        labelStyle = {style.label}
                        inputContainerStyle={style.inputs}
                        inputStyle={style.input}
                        placeholder='Username'
                        leftIcon={
                            <Icon
                            type='font-awesome'
                            name='user-circle'
                            size={24}
                            color='#fff'
                            />
                        }
                        onChangeText={value => setUserName(value)}
                    />
                    </View>
                    <View style={{...style.viewImg, marginTop: 20}}>
                        <Button
                            onPress = {handleSignUp}
                            raised
                            buttonStyle = {{width: 150, backgroundColor: '#1258ba'}}
                            type = 'solid'
                            icon={
                                <Icon
                                type='font-awesome'
                                name="angle-right"
                                size={20}
                                color="#fff"
                                />
                            }
                            iconRight 
                            titleStyle={{marginRight: 10}}
                            title="SIGN UP"
                        />
                    </View>
                    
                </Content>
            </Container>
        </ErrorBoundary>
    )
}
export default Username

const style = StyleSheet.create({
    label: {
        color: '#fff'
    },
    img: {
        height: 40,
        width: 40,
    },
    viewImg: {
        margin: 10,
        alignItems: 'center',
    },
    usertextContainer: {
        alignItems: 'center',
    },
    usertext: {
        fontSize: 22,
        color: '#fff'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        color: '#fff',
    },
    inputs: {
        borderColor: '#fff',
    },
})