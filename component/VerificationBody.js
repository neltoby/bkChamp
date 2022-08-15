import React, { useRef, memo, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native'
import { deleteKey, getKey, storeKey } from '../processes/keyStore'
import CodeInput from 'react-native-confirmation-code-input'
import { Icon } from 'react-native-elements'
import { confirm, loginValue } from '../processes/lock'
import { useDispatch, useSelector } from 'react-redux';
import { vNumber, verification, welcome } from '../actions/login'
import { Toast } from 'native-base';
import { awaitingRequest, requestVerification, verifyEmail } from '../actions/request';
import isJson from '../processes/isJson';


export default function VerificationBody({ navigation }) {
    const login = useSelector(state => state.login)
    const email = isJson(useSelector((state) => state.user)).user.email;
    const request_status = isJson(useSelector(state => state.request)).status

    const ref = useRef('')
    const dispatch = useDispatch()

//     useFocusEffect(
//     useCallback(() => {
//       dispatch(requestVerification({ email}))
//     }, [])
//   );
    const onSuccess = async () => {
        console.log("called")
            Toast.show({
                text: "Email Verified!",
                type: "success",
                duration: 5000
            })
            const val = await getKey(confirm)
            if (val !== undefined && val !== null) {
                // signed up but haven't confirmed 
                await storeKey(loginValue, val)
                await deleteKey(confirm)
                // verication state set to false indicates that user is verified and confirm token removed
                dispatch(verification(false))
                dispatch(welcome('Welcome'))
            }
            // return
        return navigation.navigate("Username")
    }
    const onFail = () => {
        Toast.show({
                text: "Invalid Token",
                type: "danger",
                duration: 5000
            })
    }
    const onFulfill = async (code) => {
        // navigation.navigate("FinishSignUp")
        dispatch(verifyEmail({ email, email_token: code }, onSuccess, onFail))
        
    }

    return (
        <>
            <View style={style.info} />
            <View style={style.info}>
                <Text style={style.vText}>
                    Verification
                </Text>
            </View>
            <View style={style.info}>
                <Icon
                    type='material'
                    name='https'
                    size={28}
                    color='#fff'
                />
            </View>
            <View style={style.info}>
                <Text style={style.verificationText}>
                    Please enter the verification text we 
                </Text>
                <Text style={style.verificationText}>
                    sent to  your email
                </Text>
            </View>
            <View style={style.textContainer}>
                <CodeInput
                    ref={ref}
                    secureTextEntry
                    keyboardType="numeric"
                    className={'border-b'}
                    space={5}
                    size={30}
                    inputPosition='left'
                    onFulfill={(code) => onFulfill(code)}
                />                                              
            </View>
            {request_status === "awaiting" && <Text>Verifying...</Text>}
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    info: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 0.1,
        alignItems: 'center',
    },
    vText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    }, 
    verificationText: {
        color: '#fff'
    },
})

export const MemoVerificationBody = memo(VerificationBody)
