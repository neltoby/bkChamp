import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import { Body, Button, Container, Content, Footer, FooterTab, Header, Icon as NativeIcon, Left, Right, Title } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { loadQuestion, loadQuiz, playedCurrent, playedPrev, playingAgain, resetplayedCurrent, settime } from '../actions/quiz';
import { callStartGame } from '../actions/request';
import { noQuestion } from '../processes/image';
import isJson from '../processes/isJson';
import CustomModal from './CustomModal';
import Overlay from './Overlay';
import { MemoizedPlayAgainButton } from './PlayAgainButton';
import Rolling from './Rolling';

const ReviewQuestion = ({ navigation }) => {
    const [startAgain, setStartAgain] = useState(false)
    const loading = isJson(useSelector(state => state.quiz)).loadingQuiz
    const windowHeight = useWindowDimensions().height;
    const store = isJson(useSelector(state => state))
    const dispatch = useDispatch()
    const played = store.quiz.played
    const no = store.quiz.playedCurrent
    const current = isJson(played[no])
    const points = useSelector(state => state.user).user.points
    const avail = Object.entries(current).length
    const col = current.answer === current.selected ? '#00ff00' : 'red';
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#054078');
            return () => {
                dispatch(resetplayedCurrent(0))
                dispatch(playingAgain())
                dispatch(settime(''))
            }
        }, [])
    )

    const setAgain = useCallback(
        () => {
            setStartAgain(true)
        },
        [],
    )

    const redirect = () => {
        navigation.navigate('PlayQuiz')
    }

    const playAgain = () => {
        dispatch(loadQuiz(true))
        setStartAgain(false)
        dispatch(loadQuestion({}))
        dispatch(callStartGame(redirect))
    }
    const nextQuestion = () => {
        dispatch(playedCurrent())
    }
    const prevQuestion = () => dispatch(playedPrev())
    const goback = () => {
        navigation.navigate('SelectHome')
    }
    return (
        <Container style={{ backgroundColor: "#054078" }}>
            <LinearGradient
                colors={['transparent', '#e1efef']}
                style={{ ...style.gradient, height: windowHeight, }}
            />
            <Header transparent>
                <Left>
                    <Button transparent onPress={goback}>
                        <NativeIcon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>
                        Question Review
                    </Title>
                </Body>
                <Right />
            </Header>
            <Content>
                <View style={style.container}>
                    {played.length ?
                        <View style={style.review}>
                            <View style={style.content}>
                                <Text style={style.questag}>Q{parseInt(parseInt(no) + 1)}</Text>
                            </View>
                            <View style={[style.levelContent,
                            { backgroundColor: current.difficulty === 'EASY' ? '#019900' : current.difficulty === 'MODERATE' ? '#0033ff' : '#ff3300' }]}>
                                <Text style={style.levelContainer}>
                                    <Text style={style.levelText}>
                                        Difficulty level -
                                    </Text>
                                    <Text style={style.levelText}>
                                        -
                                    </Text>
                                    <Text style={style.levelText}>
                                        {
                                            current.difficulty === 'EASY' ?
                                                'Easy' :
                                                current.difficulty === 'MODERATE' ? 'Moderate' : 'Difficult'
                                        }
                                    </Text>
                                </Text>
                            </View>
                            <View style={style.textContent}>
                                <View style={style.countContainer}>
                                    <Text style={style.question}>
                                        {current.question}
                                    </Text>
                                </View>
                                <Text style={{ ...style.question, color: col }}>
                                    YOUR ANSWER : {current.selected}
                                </Text>
                                {current.answer !== current.selected ?
                                    <Text style={{ ...style.question, color: '#00ff00' }}>
                                        CORRECT ANSWER : {current.answer}
                                    </Text> :
                                    <Text />
                                }
                            </View>
                            <View style={style.textContent}>
                                <Text>
                                    <Text style={style.note}>NOTE: </Text>
                                    <Text style={style.noteContent}>{current.notes}</Text>
                                </Text>
                            </View>
                            <View style={style.next}>
                                {no !== 0 ?
                                    <Icon type="material" name="chevron-left" size={33} onPress={() => { prevQuestion() }} />
                                    :
                                    null
                                }
                                {no < played.length - 1 ?
                                    <Icon type="material" name="navigate-next" size={33} onPress={() => nextQuestion()} />
                                    :
                                    null
                                }
                            </View>
                            <MemoizedPlayAgainButton setStartAgain={setAgain} />
                        </View>
                        :
                        <>
                            <View style={style.noreview}>
                                <Text style={style.noQuest}>You have not answered any question!</Text>
                                <Image source={noQuestion()} style={style.img} />
                            </View>
                            <MemoizedPlayAgainButton setStartAgain={setAgain} />
                        </>
                    }
                </View>
            </Content>
            <Footer >
                <FooterTab>
                    <Button>
                        <Text style={style.displayed}>You  answered {played.length} question(s)</Text>
                    </Button>
                </FooterTab>
            </Footer>
            <CustomModal
                defaultColor
                visible={startAgain}
                title={points ? "Play Again?" : "Not enough points"}
                options={points ? ["No", "Yes"] : ["Cancel", "Subscribe"]}
                close={() => { setStartAgain(false); navigation.navigate('SelectHome') }}
                confirm={points ? () => playAgain() : () => navigation.navigate('Subscribe')}
            />
            {/*<Modal
                useNativeDriver={true}
                visible={startAgain}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={event => setStartAgain(false)}
                onHardwareBackPress={() => setStartAgain(false)}
                modalTitle={<ModalTitle title='Play again?' />}
                footer={
                    <ModalFooter>
                        {points > 0 ? 
                            <>
                                <ModalButton
                                    text="No"
                                    onPress={() => setStartAgain(false)}
                                />
                                <ModalButton
                                    text="Yes"
                                    onPress={() => playAgain()}
                                /> 
                            </>
                            :
                            <>
                                <ModalButton
                                    text="Cancel"
                                    onPress={() => setStartAgain(false)}
                                />
                                <ModalButton
                                    text="Subscribe"
                                    onPress={() => navigation.navigate('Subscribe')}
                                />
                            </>
                        }
                    </ModalFooter>
                  }
            >
                <ModalContent>                   
                    <View style={style.showView}>                       
                        {points > 0 ? 
                            <Text>
                                You are about to start a new quiz session
                            </Text>
                            : 
                            <>
                                <Text>
                                    You do not have sufficient points to start a game session
                                </Text>
                                <Text>
                                    Use the subscribe button below
                                </Text>
                            </>
                        }                        
                    </View>
                </ModalContent>
            </Modal> */}
            <Overlay isVisible={loading} >
                <Rolling text='Loading ...' />
            </Overlay>
        </Container>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    noreview: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startBut: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center'
    },
    review: {
        marginTop: 15,
        width: '85%',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    img: {
        width: 100,
        height: 100,
    },
    noQuest: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 45,
        color: '#fff',
    },
    questag: {
        fontWeight: 'bold',
        fontSize: 19,
        color: '#777',
        marginBottom: 10,
    },
    levelContent: {
        alignItems: 'center',
        paddingVertical: 7,
        borderRadius: 40,
    },
    levelContainer: {
        textAlign: 'center'
    },
    levelText: {
        paddingHorizontal: 10,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textContent: {
        paddingHorizontal: 10,
    },
    question: {
        lineHeight: 35,
        fontSize: 18,
        fontWeight: 'bold',
    },
    next: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    note: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    noteContent: {
        fontSize: 18,
        color: '#777'
    },
    displayed: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

export default ReviewQuestion