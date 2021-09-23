import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'native-base';

import isJson from '../processes/isJson'
import { deleteAccountWarning } from '../actions/user';

const ConfirmDeleteAccount = ({ setDeleteState }) => {
    const dispatch = useDispatch();
    return (
        <View>
            <View> 
                <Text>
                    Deleting your account will erase all
                </Text>
                <Text>
                    your personal data from BookChamp.
                </Text>
            </View>
            <View>
                <Text>
                    ARE YOU SURE YOU WANT TO DO THIS?
                </Text>
            </View>
            <View>
                <Button
                    onPress = {() => setDeleteState('feedback')}
                    style={{backgroundColor: '#1258ba', width: '100%'}}
                    full
                >
                    <Text style={{color: '#fff'}}>YES</Text>
                    <Icon
                        type='font-awesome'
                        name="chevron-circle-right"
                        size={20}
                        color="#fff"
                        containerStyle={{marginLeft: 8}}
                    />
                </Button>
                <Button
                    onPress = {() => dispatch(deleteAccountWarning(false))}
                    style={{backgroundColor: '#1258ba', width: '100%'}}
                    full
                >
                    <Text style={{color: '#fff'}}>NO</Text>
                    <Icon
                        type='font-awesome'
                        name="chevron-circle-right"
                        size={20}
                        color="#fff"
                        containerStyle={{marginLeft: 8}}
                    />
                </Button>
            </View>
        </View>
    );
}
