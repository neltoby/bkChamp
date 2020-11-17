import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { Container, Header, Button, Icon, Right } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { ScrollView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, BackHandler } from 'react-native'
import deviceSize from '../processes/deviceSize'
import { useDispatch, useSelector } from 'react-redux';
import { deleteKey } from '../processes/keyStore'
import { notLogin, logoutWarning } from '../actions/login'
import { loginValue } from '../processes/lock'
import {db} from '../processes/db'

const sql = 'DROP TABLE IF EXISTS articles'
const sqli = 'DROP TABLE IF EXISTS archive'
const sqlii = 'DROP TABLE IF EXISTS user'
const sqlx = 'DROP TABLE IF EXISTS archiveunsent'
const sqlix = 'DROP TABLE IF EXISTS unsent'
const sqlxi = 'DROP TABLE IF EXISTS search'
const sqlxii = 'DROP TABLE IF EXISTS endquestions'



const SelectHome  = ({ navigation }) => {
    const windowHeight = deviceSize().deviceHeight;
    const isDrawerOpen = useIsDrawerOpen()
    const [back, setBack] = useState(false)
    const dispatch = useDispatch()
    const warning = useSelector(state => state.login).logoutWarning

    const setLogout = async () => {
        dispatch(logoutWarning(false))
        await deleteKey(loginValue)        
        db.transaction(tx => {
            tx.executeSql(sql, null, (txO, {rows}) => {
                txO.executeSql(sqli, null, (txOb, {rows}) => {
                    txOb.executeSql(sqlii, null, (txObx, {rows}) => {
                        txObx.executeSql(sqlx, null, (tx, {rows}) => {
                            tx.executeSql(sqlix, null, (txO, {rows}) => {
                                txO.executeSql(sqlxi, null, (txO, {rows}) => {
                                    txO.executeSql(sqlxii, null, (txOb, {rows}) => {
                                        console.log('successfully dropped table')
                                        dispatch(notLogin())
                                        navigation.navigate('Login')
                                    }, err => console.log(err, 'failed dropped endpoints'))                                   
                                }, err => console.log('failed search dropped'))
                            }, err => console.log('failed unsent drooped'))
                        }, err => console.log('failed archiveunsent dropped'))
                    }, err => console.log('failed dropped user'))
                }, err => console.log('failed dropped archive'))
            }, err => console.log(err, 'failed err dropping table'))
        }, err => console.log(err, 'failed transxn'), 
        () => console.log('failed successful transxn'))        
    }

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                setBack(true)
                return true;
            };
          const onBackPress = () => {
            if (isDrawerOpen) {
                navigation.closeDrawer();
              return true;
            } else {
                backAction()
              return true;
            }
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [isDrawerOpen])
    )

    const exitApp = () => {
        setBack(false)
        setTimeout(() => {
            BackHandler.exitApp()
        }, 100);
    }

    return(
        <>
            <Container style={style.container}>
                <FocusAwareStatusBar barStyle="light-content" backgroundColor="#054078" />
                <LinearGradient
                    colors={['transparent', '#e1efef']}
                    style={{...style.gradient, height: windowHeight,}}
                />
                <Header noShadow noLeft style={style.header}>
                    <Right>
                        <Button transparent onPress={() => navigation.toggleDrawer()}>
                            <Icon name="menu" />
                        </Button>
                    </Right>
                </Header>
                <ScrollView style={style.content}>
                    <View style={[style.quiz, {height: (50/100) * windowHeight}]}>
                        <Avatar
                            size={200}
                            rounded
                            onPress={() => navigation.navigate('Quiz')}
                            source={require('../assets/quiz.png')}
                        />
                    </View>
                    <View style={[style.learnContent,{height: (50/100) * windowHeight}]}>
                        <TouchableOpacity style={{width: '80%', height: '50%'}} onPress={() => navigation.navigate('Learn')}>
                            <ImageBackground source={require('../assets/learn.png')} style={style.image} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Container>
            <Modal
                useNativeDriver={true}
                visible={warning}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={event => dispatch(logoutWarning(false))}
                onHardwareBackPress={() => dispatch(logoutWarning(false))}
                modalTitle={<ModalTitle title='Log out?' />}
                footer={
                    <ModalFooter>
                      <ModalButton
                        text="No"
                        onPress={() => dispatch(logoutWarning(false))}
                      />
                      <ModalButton
                        text="Yes"
                        onPress={() => setLogout()}
                      />
                    </ModalFooter>
                  }
            >
                <ModalContent>
                    <View style={style.showView}>
                        <Text style={style.warning}>
                            Are you sure you want to log out?
                        </Text>
                    </View>
                </ModalContent>
            </Modal>
            <Modal
                useNativeDriver={true}
                visible={back}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={event => setBack(false)}
                onHardwareBackPress={() => setBack(false)}
                modalTitle={<ModalTitle title='Exit?' />}
                footer={
                    <ModalFooter>
                      <ModalButton
                        text="No"
                        onPress={() => setBack(false)}
                      />
                      <ModalButton
                        text="Yes"
                        onPress={() => exitApp()}
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
            </Modal>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#054078',
    },
    header: {
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
    },
    quiz: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    learnContent: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
})

export default SelectHome