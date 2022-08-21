import { Button, Toast } from 'native-base'
import React, { memo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vNumber } from '../actions/login'
import { requestVerification } from '../actions/request'
import isJson from '../processes/isJson'

export default function Resend() {
    const email = isJson(useSelector((state) => state.user)).user.email;

    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()
    const onSuccess = () => {
        Toast.show({
            type: "success",
            text: 'You will be able to send again in 10s',
            buttonText: "CLOSE",
            duration: 3000
        })
    }

    const onFail = () => {
         Toast.show({
            type: "danger",
            text: 'Resend request failed',
            buttonText: "CLOSE",
            duration: 3000
        })
    }
    const resend = async () => {
        setDisabled(true)
        // dispatch(vNumber(23456))
      dispatch(requestVerification({email: "danielchibuezeolah@gmail.com"}, onSuccess, onFail))

        
        setTimeout(() => {
            setDisabled(false)
        }, 1000 * 10);
    }
    return (
        <View style={style.resendContainer}>
            <Text style={style.resendText}>
                if you didn't get the verification
                number sent to your phone please
                click the resend button below
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
        textAlign: "center",
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