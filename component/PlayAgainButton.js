import React, { memo } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Button } from 'native-base'

export default function PlayAgainButton(props) {
    console.log('play again was called')
    return (
        <View style={{alignItems: 'center', width: '100%'}}>
            <View style={[style.startBut, {width: '80%'}]}>
                <Button full onPress={props.setStartAgain}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Play again</Text>
                </Button>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    startBut: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center'
    },
})

export const MemoizedPlayAgainButton = memo(PlayAgainButton)