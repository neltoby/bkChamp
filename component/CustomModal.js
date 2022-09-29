import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const CustomModal = ({ visible, title, options, close, confirm, defaultColor }) => {
    return (
        <Modal
            isVisible={visible}
            animationIn={'slideInLeft'}
            animationOut={'slideOutRight'}
        // style={{ width: "60%" }}
        >
            <View style={{ backgroundColor: "#fff", borderRadius: 9, paddingVertical: 15 }}>
                <Text style={{ paddingLeft: 12, fontSize: 21, paddingBottom: 12 }}>{title}</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity activeOpacity={0.9} style={{ paddingRight: 20 }} onPress={() => close()}>
                        <Text style={{ color: "black", fontSize: 21 }}>{options[0]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.65} style={{ paddingRight: 12 }} onPress={() => confirm()}>
                        <Text style={{ color: defaultColor ? "black" : "red", fontSize: 21 }}>{options[1]}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create({})
