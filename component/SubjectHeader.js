import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import Constants from 'expo-constants'
import { Text, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import { Header, Left, Body, Title, Right, Button, Icon as NativeIcon } from 'native-base'

export default function SubjectHeader({navigation, subject}) {
    const {navigate} = navigation
    return (
        <Header style={style.header}>
            <Left>
                <Button transparent onPress={() => navigate('Learn')}>
                    <NativeIcon  name={Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'} />
                </Button>
            </Left>
            <Body>
                <Title>
                    {subject}
                </Title>
            </Body>
            <Right>
                <NativeIcon onPress={() => navigate('Search', { subject })} name={Platform.OS == 'ios' ? 'ios-search' : 'search'} style={{color: '#fff', fontSize: 22}} />
            </Right>
        </Header>
    )
}

const style = StyleSheet.create({
    header: {
        backgroundColor: '#054078',
        marginTop: Constants.statusBarHeight
    },
})

SubjectHeader.propTypes = {
    navigation: PropTypes.object,
    subject: PropTypes.string
}

export const MemoizedSubjectHeader = memo(SubjectHeader)