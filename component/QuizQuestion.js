import React, {useMemo} from 'react'
import { View, ScrollView, Text, StyleSheet} from 'react-native'
import { useSelector } from 'react-redux'
import isJson from '../processes/isJson'

export default function QuizQuestion() {
    // const store = isJson(useSelector(state => state))
    // let allQuestion = useMemo(() => isJson(store.quiz.question), [store.quiz.question])
    // const current = store.quiz.current
    const level = useSelector(state => state.quiz).level
    const question = isJson(useSelector(state => state.quiz)).currentQuestion
    return (
        <ScrollView  style={style.scrollContainer}>                        
            <View>
                <Text style={[style.questionText, {fontSize: 16, marginBottom: 10, color: level === 'easy' ? '#019900' : level === 'moderate' ? '#0033ff' : '#ff3300'}]}>
                    {level}
                </Text>
            </View>
            <View>               
                <Text style={style.questionText}>
                    {question.question}
                </Text>
            </View>
        </ScrollView>
    )
}

 const style = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        width: '90%',
        borderRadius: 8,
        marginTop: 35,
        height: 200,
        paddingTop: 30,
    },
    questionText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
 })
