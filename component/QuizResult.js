import React, { memo, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, Image} from 'react-native'
import { Button } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import isJson from '../processes/isJson'
import {oops} from '../processes/image'
import { endGame, callStartGame } from '../actions/request'
import { active, setOverlay, playingAgain, loadQuiz, loadQuestion, noPoints } from '../actions/quiz'

export default function QuizResult({navigation}) {
    const store = isJson(useSelector(state => state))
    const points = store.user.user.points
    const skipped = useSelector(state => state.quiz).skipped
    const question = useSelector(state => state.quiz).question
    let score = useSelector(state => state.quiz).score
    const dispatch = useDispatch()

  const redirect = () => navigation.navigate('PlayQuiz');

    const playAgain = () => {
        dispatch(setOverlay('cancel'))
        dispatch(loadQuiz(true))
        dispatch(loadQuestion({}))
        if(points > 0){ 
            dispatch(playingAgain()) 
            dispatch(callStartGame(redirect))
        }else{
            dispatch(loadQuiz(false))
            dispatch(noPoints(true))
        }
        
    }

    const cancelQuiz = () => {
        dispatch(setOverlay('cancel'))
        navigation.navigate('SelectHome')
    }

    const reviewQuestion = () => {
        dispatch(active())
        dispatch(setOverlay('cancel'))
        navigation.navigate('ReviewQuestion')
    }
    useEffect(() => {
        if(store.quiz.setOverlay === 'end' || 
        store.quiz.setOverlay === 'timeOut'){           
            let unanswered = []               
            question.easy.forEach(element => {
                unanswered.push(element.id)
            });
            question.moderate.forEach(element => {
                unanswered.push(element.id)
            });
            question.difficult.forEach(element => {
                unanswered.push(element.id)
            });
            let payload = {skipped, undisplayed: unanswered, score}
            null
            dispatch(endGame({payload}))
        }
        return () => {
        }
    }, [store.quiz.setOverlay])
    return (
        <View style={style.overlay}>
        <ScrollView contentContainerStyle={{alignItems: 'center'}}> 
            {
                store.quiz.setOverlay === 'end' ? (
                    <>
                        <View style={style.endGame}>
                            <Text style={style.endText}>
                                Congratulations! 
                            </Text>
                            <Text style={style.congratText}>
                                You have exhausted all questions
                            </Text>
                        </View>               
                    </>
                ) :
                (
                    <>
                        <Text style={style.oops}>
                            Ooops... Your time is out!
                        </Text>
                        <View style={style.oopsView}>
                            <Image source={oops()} style={style.oopsImage} />
                        </View>
                    </>
                )
            }
                <View style={style.optionContent}>
                    <View style={style.sayOption}> 
                        <Text>
                            <Text style={style.ans}>Questions answered :</Text>
                            <Text style={style.val}>{parseInt(store.quiz.correct.length) + parseInt(store.quiz.wrong.length)}</Text>
                        </Text>
                    </View>
                    <View style={style.sayOption}>
                        <Text>
                            <Text style={style.ans}>Correctly answered :</Text>
                            <Text style={style.val}>{store.quiz.correct.length} </Text>
                        </Text>
                    </View>
                    <View style={style.sayOption}>
                        <Text>
                            <Text style={style.ans}>Wrongly answered :</Text>
                            <Text style={style.val}>{store.quiz.wrong.length}</Text>
                        </Text>
                    </View>
                    <View style={style.sayOption}>
                        <Text>
                            <Text style={style.ans}>Skipped questions :</Text>
                            <Text style={style.val}>{store.quiz.skipped.length}</Text>
                        </Text>
                    </View>
                    <View style={style.sayOption}>
                        <Text>
                            <Text style={style.ans}>Final score :</Text>
                            <Text style={style.val}>{store.quiz.score}</Text>
                        </Text>
                    </View>
                </View>
            <View style={style.selectOptions}> 
                <Button
                    transparent
                    onPress={() => playAgain()}
                >
                    <Text style={[style.buttonText, {color: '#555'}]}>Play again</Text>
                </Button>                  
                <Button 
                    transparent
                    onPress = {() => reviewQuestion()}
                >
                    <Text style={[style.buttonText, {color: '#555'}]}>Review</Text>
                </Button>
                <Button 
                    style={[{backgroundColor: '#2288dc', paddingHorizontal: 10, borderRadius: 3}]}
                    onPress = {() => cancelQuiz()}
                >
                    <Text style={[style.buttonText, {color: '#fff'}]}>Cancel</Text>
                </Button>
            </View>               
        </ScrollView>  
        </View>
    )
}

const style = StyleSheet.create({
    endGame: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    endText: {
        fontSize: 17,
        fontWeight: 'bold', 
        color: '#444',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        backgroundColor: '#fff',
        width: '90%',
        flex: 0.7,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
    },
    congratText: {
        fontSize: 17
    },
    oopsImage: {
        width: 100,
        height: 100,
    },
    oops: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#777',
    },
    oopsView: {
        alignItems: 'center'
    },
    optionContent: {
        marginVertical: 10,
    },
    sayOption: {
        marginTop: 10,
    },
    ans: {
        color: '#777',
        fontWeight: '600'
    },
    val: {
        paddingLeft: 10,
        marginLeft: 10,
        color: '#777',
        fontWeight: 'bold',
    },
    selectOptions: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-evenly',
    },
})

export const MemoizedQuizResult = memo(QuizResult)