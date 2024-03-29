import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, Overlay, Icon } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { login, welcome } from '../actions/login'

export default function FinishSignUp(props) {
    const dispatch = useDispatch()
    const { visible, navigation } = props
    const nextSlide = () => {
        dispatch(login())
        dispatch(welcome('Welcome'))
    }
    return (
        <Overlay isVisible={visible} >
            <View style={style.modalView}>
                    <Icon
                        type='font-awesome'
                        name="check"
                        size={50}
                        color="#00cc00"
                    />
                <Text style={style.overlayText}>You are registered</Text>
                <Text style={style.overlayText}>CONGRATULATIONS!</Text>
                <Button
                    onPress = {nextSlide}
                    raised
                    buttonStyle = {{width: 150, backgroundColor: '#1258ba'}}
                    type = 'solid'
                    icon={
                        <Icon
                        type='font-awesome'
                        name="long-arrow-right"
                        size={20}
                        color="#fff"
                        />
                    }
                    iconRight 
                    titleStyle={{marginRight: 10}}
                    title="Continue"
                />
            </View>                   
        </Overlay>
    )
}

const style = StyleSheet.create({
    modalView: {
        padding: 20,
        backgroundColor: '#fff',
    },
    overlayText: {
        marginBottom: 20,
    },
})

export const MemoFinishSignUp = memo(FinishSignUp)
