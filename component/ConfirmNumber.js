import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { MemoCNOverlay } from './CNOverlay';
import Container from './Container';
import { MemoResend } from './Resend';
import { MemoVerificationBody } from './VerificationBody';


const ConfirmNumber = ({ navigation }) => {
    const [close, setClose] = useState(false)

    const closeApp = useCallback(() => {
        setClose(false)
        BackHandler.exitApp()
    }, [])
    const cancel = () => {
        setClose(false)
    }

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                if (!close) {
                    setClose(true)
                    return true
                } else {
                    closeApp()
                    return false
                }
            }
            BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            }
        }, [])
    )

    return (
        <>
            <Container>
                <View style={style.container}>
                    <MemoVerificationBody navigation={navigation} />
                    <View style={style.resend}>
                        <MemoResend />
                    </View>
                </View>
            </Container>
            {close ?
                (
                    <MemoCNOverlay
                        close={close}
                        closeApp={closeApp}
                        cancel={cancel}
                    />
                ) : null
            }
        </>
    )
}

export default ConfirmNumber

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    resend: {
        flex: 0.5,
        paddingTop: 20,
    }
})