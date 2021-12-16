import { Restart } from 'fiction-expo-restart';
import { Button } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import Animated, { block, Easing, timing, Value } from 'react-native-reanimated';
import deviceSize from '../processes/deviceSize';

export default function ErrorUi() {
    const deviceWidth = deviceSize().deviceWidth;
    const val = new Value(0)
    const wval = new Value(0)
    const tval = new Value(0)

    const exitApp = () => {
        Restart();
        // BackHandler.exitApp()
    }
    useEffect(() => {
        block([
            timing(val, {
                duration: 100,
                toValue: 200,
                easing: Easing.inOut(Easing.ease),
            }).start(),
            timing(wval, {
                duration: 100,
                toValue: 0.9 * deviceWidth,
                easing: Easing.inOut(Easing.ease),
            }).start(),
            timing(tval, {
                duration: 200,
                toValue: 16,
                easing: Easing.inOut(Easing.ease),
            }).start(),
        ])
        return () => {
        }
    }, [])
    return (
        <View style={style.container}>
            <Animated.View style={[style.msg, { height: val, width: wval }]}>
                <View style={[style.textContainer, { alignItems: 'center', justifyContent: 'center' }]}><Animated.Text style={{ fontSize: tval }}>Report this error?</Animated.Text></View>
                <View style={style.inputContainer}>
                    <Input
                        placeholder='Write report...'
                    />
                </View>
                <View style={[style.textContainer, { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }]}>
                    <Button style={style.but}>
                        <Text style={style.color}>REPORT</Text>
                    </Button>
                    <Button style={style.but} onPress={exitApp}>
                        <Text style={style.color}>CLOSE</Text>
                    </Button>
                </View>
            </Animated.View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    msg: {
        // paddingTop: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center'
    },
    textContainer: {
        flex: 0.3,
        width: '100%',
    },
    inputContainer: {
        flex: 0.4,
        width: '100%',
        paddingHorizontal: 30,
    },
    but: {
        backgroundColor: '#1258ba',
        paddingHorizontal: 10,
    },
    color: {
        color: '#fff'
    }
})