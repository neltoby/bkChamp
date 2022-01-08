import React from 'react'
import { StyleSheet, Text, View, FlatList, Animated } from 'react-native'

const AnimatedLoader = () => {

    const DATA = [...Array(30).keys()].map((key) => ({
        key: key.toString()
    }));

    const fadeAnim = useRef(new Animated.Value(0.2)).current;

    const animatedLoader = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        animatedLoader()
    }, [])

    const renderPlaceHolder = ({ item }) => {
        return (
            <Animated.View style={styles.placeholder} key={item.key}></Animated.View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                key={(item) => item.key}
                data={DATA}
                renderItem={renderPlaceHolder}
            />
        </View>
    )
}

export default AnimatedLoader

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    placeholder: {
        backgroundColor: "#C0C0C0",
        width: '80%',
        height: 7,
        alignSelf: 'center',
        marginVertical: 10,
        opacity: fadeAnim
    }
})
