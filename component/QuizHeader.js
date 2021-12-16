import React, { memo } from 'react'
import { Alert } from 'react-native'
import { Header, Button, Left, Body, Right, Icon as NativeIcon, Title, } from 'native-base'

export default function QuizHeader({ navigation }) {
    console.log('quizHeader memoized')
    return (
        <Header transparent>
            <Left>
                <Button transparent onPress={() => Alert.alert('Abort?', 'Are you sure you want to abort your current quiz session',
                    [
                        {
                            text: "Cancel",
                            onPress: () => null,
                            style: "cancel"
                        },
                        { text: "YES", onPress: () => navigation.navigate('SelectHome') }
                    ]
                )}>
                    <NativeIcon name='arrow-back' />
                </Button>
            </Left>
            <Body>
                <Title>Play Quiz</Title>
            </Body>
            <Right />
        </Header>
    )
}
export const MemoizedQuizHeader = memo(QuizHeader)