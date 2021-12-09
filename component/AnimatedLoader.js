import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

items = [...Array(7).keys()].map((key) => ({ id: key.toString(), data: 'Item ' + key.toString() }))

const AnimatedLoader = () => {
    return (
        <FlatList
            data={items}
            key={item => item.data}
            renderItem={({ index, item }) => {
                (
                    <View style={styles.loader}></View>
                )
            }}
        />
    )
}

export default AnimatedLoader

const styles = StyleSheet.create({
    loader: {
        backgroundColor: "whitesmoke",
        width: "75%",
        height: 20,
        paddingVertical: 20
    }
})
