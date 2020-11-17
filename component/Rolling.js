import React from 'react'
import { View, Text} from 'react-native'
import { Spinner } from 'native-base'
import deviceSize from '../processes/deviceSize'

export default function Rolling(props) {
    const deviceWidth = deviceSize().deviceWidth
    return (
        <View style={{ backgroundColor: '#fff',padding: 3, flexDirection: 'row', width: '80%', borderRadius: 3 }}>
            <View style={{width: '20%', justifyContent: 'center', alignItems: 'center',}}>
                <Spinner color='#054078' />
            </View>
            <View style={{width: '80%',paddingHorizontal: 10, justifyContent: 'center', alignItems: 'flex-start',}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#054078' }}>{props.text}</Text>
            </View>           
        </View>
    )
}
