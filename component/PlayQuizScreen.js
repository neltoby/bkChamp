import React, { useMemo, useState, useEffect, memo } from  'react'
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, StyleSheet, ScrollView, StatusBar, Image,
    TouchableHighlight, BackHandler, Alert } from "react-native";
import { Container, Content, Button } from 'native-base'
import { MemoizedQuizHeader } from './QuizHeader'
import DisplayTime from './DisplayTime'
import QuizOptions from './QuizOptions'
import QuizQuestion from './QuizQuestion'
import Overlay from './Overlay';
import Rolling from './Rolling'
import { MemoizedQuizReport } from './QuizReport'
import { useSelector, useDispatch } from 'react-redux'
import deviceSize from '../processes/deviceSize'
import { active, playingAgain, settime, setOverlay } from '../actions/quiz'
import MemoizedQuizResult from './QuizResult';
import QuizFooter from './QuizFooter';

const PlayQuizScreen = ({ navigation }) => {
    const deviceHeight = deviceSize().deviceHeight
    const deviceWidth = deviceSize().deviceWidth
    const store = useSelector(state => state.quiz.setOverlay)
    const loading = useSelector(state => state.quiz).loadingQuiz
    const noPoints = useSelector(state => state.quiz).noPoints
    const question = useSelector(state => state.quiz).currentQuestion
    const dispatch = useDispatch()
    const setlay = store === 'end' || store === 'timeOut' ? true : false
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#054078');
            dispatch(playingAgain())
            return () => {
                dispatch(settime(''))
            }
        }, [])    
    )       
    const toggleOverlay = () => {
        dispatch(active())
        dispatch(settime(''))
        dispatch(setOverlay('cancel'))
        navigation.navigate('SelectHome')
    }
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if(store !== 'timeOut'){
                    Alert.alert('Abort?', 'Are you sure you want to abort your current quiz session',
                        [
                            {
                                text: "Cancel",
                                onPress: () => null,
                                style: "cancel"
                            },
                            { text: "YES", onPress: () => navigation.navigate('Quiz') }
                        ]
                    )
                    return true
                }                                              
            }

            BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            }
        }, [])
    )
    return (
        <>
        <Container style={{backgroundColor: "#054078"}}>
            <LinearGradient
                colors={['transparent', '#e1efef']}
                style={{...style.gradient, height: deviceHeight,}}
            />
        <MemoizedQuizHeader navigation={navigation} />
        <Content >
        <StatusBar barStyle="light-content" backgroundColor="#3480eb" />
        <View style={style.container}>
            {
                Object.entries(question).length ?
                    <>
                        <MemoizedQuizReport />
                        <View style={style.quizContainer}>
                            <DisplayTime />
                            <QuizQuestion />
                        </View>
                        <QuizOptions />
                    </>
                :
                    <View style={style.loading}>
                        {loading ? 
                            <Text style={style.loadtext}>
                                Loading
                            </Text>
                            : 
                            noPoints ?
                            <View style={style.subscribe}>
                                <Text style={style.nopointText}>
                                    <Text style={style.nopoint}>You do not have enough points to</Text>
                                    <Text style={style.nopoint}> start a new game session</Text>
                                </Text>
                                <Button full style={{color: 'blue'}} onPress={() => navigation.navigate('Subscribe')}>
                                    <Text style={style.subscribeText}>
                                        SUBSCRIBE
                                    </Text>
                                </Button>
                            </View>
                            : null
                        }
                    </View> 
                
                
            }
        </View>        
        </Content>
        {Object.entries(question).length ? <QuizFooter /> : null}
      </Container>
    <Overlay 
        isVisible={setlay} 
        deviceWidth={deviceWidth} 
        deviceHeight={deviceHeight}
        onBackButtonPress = {() => playAgain()}
        onBackdropPress={toggleOverlay} >
        
        <MemoizedQuizResult navigation={navigation} />      
    </Overlay>
    <Overlay isVisible={loading} >
        <Rolling text='Loading ...' />
    </Overlay>
    </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },         
    quizContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    subscribeText: {
        fontSize: 17
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscribe: {
        width: '80%'
    },
    nopoint: {
        color: '#fff',
        fontSize: 17,
        // fontWeight: 'bold'
    },
    nopointText: {
        textAlign: 'center',
        marginBottom: 30
    },
    subscribeText: {
        color: '#fff'
    }
})

export default PlayQuizScreen
export const MemoizedPlayQuizScreen = memo(PlayQuizScreen)