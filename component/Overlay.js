import React from 'react'
import deviceSize from '../processes/deviceSize'
import Modal from 'react-native-modal';

export default function Overlay(props) {
    const windowHeight = props.deviceHeight || deviceSize().deviceHeight;
    const deviceWidth = props.deviceWidth || deviceSize().deviceWidth;
    return (
        <Modal
            isVisible={props.isVisible}
            deviceWidth={deviceWidth}
            deviceHeight={windowHeight}
            style={{ alignItems: 'center', justifyContent: 'center' }}
        >
            {props.children}
        </Modal>
    )
}
