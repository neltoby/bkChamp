import { Badge } from 'native-base'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function FaqQuestions(props) {
    const {answer, question} = props
    return (
        <View style={style.container}>
            <View style={[style.question, {marginBottom: 10}]}>
                <View style={style.quBadge}>
                    <Badge style={style.badge}>
                        <Text style={style.qBadgeText}>
                            Q
                        </Text>
                    </Badge>
                </View>
                <View style={style.viewQuestion}>
                    <Text style={style.qText}>
                        {question}
                    </Text>
                </View>
            </View>
            <View style={[style.question, {marginBottom: 20, marginHorizontal: 10}]}>                
                <View style={[style.viewQuestion, {width: '90%', backgroundColor: '#1258ba', paddingVertical: 7, borderRadius: 3}]}>
                    <Text style={[style.qText, {color: '#fff', fontWeight: 'bold'}]}>
                        {answer}
                    </Text>
                </View>
                <View style={style.quBadge}>
                <Badge style={style.abadge}>
                    <Text style={style.qBadgeText}>
                        A
                    </Text>
                </Badge>
                </View>
            </View>
        </View>
    )
}
 const style = StyleSheet.create({
    container: {},
    question: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    badge: {
        width: 30,
        height: 30,
        borderRadius: 0,
        borderRightWidth: 1,
        borderRightColor: '#121212',
        backgroundColor: 'transparent',
    },
    abadge: {
        width: 30,
        height: 30,
        borderRadius: 0,
        backgroundColor: 'transparent',
    },
    quBadge: {
        width: '10%'
    },
    viewQuestion: {
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        width: '90%'
    },
    qText: {
        textAlign: 'left'
    },
    qBadgeText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
 })