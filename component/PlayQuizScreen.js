import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Container, Content } from 'native-base';
import React, { memo } from 'react';
import { Alert, BackHandler, Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { active, playingAgain, setOverlay, settime } from '../actions/quiz';
import deviceSize from '../processes/deviceSize';
import DisplayTime from './DisplayTime';
import Overlay from './Overlay';
import QuizFooter from './QuizFooter';
import { MemoizedQuizHeader } from './QuizHeader';
import QuizOptions from './QuizOptions';
import QuizQuestion from './QuizQuestion';
import { MemoizedQuizReport } from './QuizReport';
import MemoizedQuizResult from './QuizResult';
import Rolling from './Rolling';

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
                if (store !== 'timeOut') {
                    Alert.alert('Abort?', 'Are you sure you want to abort your current quiz session',
                        [
                            {
                                text: "Cancel",
                                onPress: () => null,
                                style: "cancel"
                            },
                            { text: "YES", onPress: () => navigation.navigate('SelectHome') }
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
            <Container style={{ backgroundColor: "#054078" }}>
                <LinearGradient
                    colors={['transparent', '#e1efef']}
                    style={{ ...style.gradient, height: deviceHeight, }}
                />
                <MemoizedQuizHeader navigation={navigation} />
                <Content >
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
                                                <Button full style={{ color: 'blue' }} onPress={() => navigation.navigate('Subscribe')}>
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
                onBackButtonPress={() => playingAgain()}
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
        fontSize: 17,
        color: '#fff'
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
})

export default PlayQuizScreen
export const MemoizedPlayQuizScreen = memo(PlayQuizScreen)