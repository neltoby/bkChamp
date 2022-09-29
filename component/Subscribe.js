import React from 'react'
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Container, Header, Left, Button, Icon, Body, Title, Right } from 'native-base';
import { StyleSheet, Platform } from 'react-native'
import Basic from './Basic'
const Tab = createMaterialTopTabNavigator();
const dataContent = [
    { amt: '#100', unit: '4 unit' },
    { amt: '#200', unit: '8 unit' },
    { amt: '#300', unit: '12 unit' },
    { amt: '#400', unit: '16 unit' },
]
const medium = [
    { amt: '#500', unit: '22 unit' },
    { amt: '#800', unit: '34 unit' },
    { amt: '#1000', unit: '42 unit' },
    { amt: '#1500', unit: '62 unit' },
    { amt: '#2000', unit: '82 unit' },
]

const title = [
    { text: 'Basic', dataContent: dataContent },
    { text: 'Medium', dataContent: medium },
]

const Base = ({ navigation }) => <Basic dataContent={dataContent} navigation={navigation} />
const Medium = ({ navigation }) => <Basic dataContent={medium} navigation={navigation} />
// const Mega = ({navigation}) => <Basic dataContent={mega} navigation={navigation} />

const Subscribe = ({ navigation }) => {

    return (
        <Container style={style.header}>
            <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
            <Header transparent hasTabs >
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name={Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'} />
                    </Button>
                </Left>
                <Body>
                    <Title>Subscription</Title>
                </Body>
                <Right />
            </Header>
            <Tab.Navigator
                initialRouteName='Basic'
                backBehavior='order'
                tabBarOptions={{
                    activeTintColor: 'yellow',
                    inactiveTintColor: '#fff',
                    labelStyle: { fontWeight: 'bold' },
                    style: { backgroundColor: 'transparent', elevation: 0 }
                }}
            >
                <Tab.Screen name="Basic" component={Base} />
                <Tab.Screen name="Medium" component={Medium} />
            </Tab.Navigator>
        </Container>
    )
}

const style = StyleSheet.create({
    header: {
        // marginTop: 20,
        backgroundColor: '#054078',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    tabBar: {
        backgroundColor: 'green'
    }
})

export default Subscribe