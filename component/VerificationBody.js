import React, { useRef, memo, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native'
import { deleteKey, getKey, storeKey } from '../processes/keyStore'
import CodeInput from 'react-native-confirmation-code-input'
import { Icon } from 'react-native-elements'
import { confirm, loginValue } from '../processes/lock'
import { useDispatch, useSelector } from 'react-redux';
import { vNumber, verification } from '../actions/login'

export default function VerificationBody({ navigation }) {
    const codes = useSelector(state => state.login).v_number
    const ref = useRef('')
    const dispatch = useDispatch()

    const onFulfill = async (code) => {
        if(code == codes){
            console.log(code)
            const val = await getKey(confirm)
            if(val !== undefined && val !== null){
                // signed up but haven't confirmed 
                await storeKey(loginValue, val)
                await deleteKey(confirm)
                // verication state set to false indicates that user is verified and confirm token removed
                await dispatch(verification(false))
            }
            navigation.navigate('UploadDp')
        }else{
            console.log(codes, 'error in the inputed code', code)
        }
    }
    useFocusEffect(
        useCallback(() => {
            if(codes === null){
                dispatch(vNumber(23456))
            }
            return () => {
                
            }
        }, [codes])
    )


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
                    sent to  your phone
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
                    className='border-b'
                    inputPosition='left'
                    onFulfill={(code) => onFulfill(code)}
                />                                              
            </View>
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
