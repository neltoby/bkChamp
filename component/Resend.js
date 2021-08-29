import React, { memo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Toast } from 'native-base'
import { vNumber } from '../actions/login'
import { useDispatch } from 'react-redux'

export default function Resend() {
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()
    const resend = () => {
        setDisabled(true)
        dispatch(vNumber(23456))
        Toast.show({
            text: 'You will be able to send again in 10s',
            buttonText: "CLOSE",
            duration: 3000
          })
        setTimeout(() => {
            setDisabled(false)
        }, 1000 * 10);
    }
    return (
        <View style={style.resendContainer}>
            <Text style={style.resendText}>
                if you didn't get the verification 
                code sent to your mail, kindly refresh 
                your inbox or check your spam. if you 
                still can't find the code, please
                hit the Resend button
            </Text>
            <View style={style.buttonContainer}>
                <Button style={style.buttons} disabled={disabled} small onPress={resend}>
                    <Text style={style.buttonsText}>
                        Resend
                    </Text>
                </Button>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    resendContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    resendText: {
        fontSize: 13,
        color: '#fff',
    }, 
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttons: {
        marginTop: 20,
        paddingHorizontal: 10
    },
    buttonsText: {
        color: '#fff'
    }
})

export const MemoResend = memo(Resend)