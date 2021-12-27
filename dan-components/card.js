import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Card = (props) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {props.children}
            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        elevation: 3,
        backgroundColor: '#fff',
        shadowColor: '#333',
        shadowRadius: 2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        marginHorizontal: 4,
        marginVertical: 6
    },
    // cardContent: {
    //     marginHorizontal: 1,
    //     marginVertical: 7,
    // }

})
