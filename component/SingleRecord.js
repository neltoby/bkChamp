import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, } from 'react-native'
import { Avatar } from 'react-native-elements';

export default function SingleRecord(props) {
    const { name, value } = props.info

    return (
        <View style={style.updateOptions}>
            <View>
                <Text style={{ color: "#fff" }}>
                    {name}
                </Text>
            </View>
            <View style={style.count}>
                <Text style={{ ...style.info, color: '#A8FF33' }}>{value}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    updateOptions: {
        width: '15%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    info: {
        fontWeight: 'bold',
    },
})

SingleRecord.defaultProps = {
    type: 'font-awesome'
}

SingleRecord.propTypes = {
    info: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        type: PropTypes.string
    })

}