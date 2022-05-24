import { Container, Header, Item, Input, Button, Icon } from 'native-base'
import FocusAwareStatusBar from './FocusAwareStatusBar'
import React, { useEffect, useState, useMemo } from 'react'
import Constants from 'expo-constants';
import SearchHeader from './SearchHeader'
import Overlay from './Overlay'
import ReadItems from './ReadItems'
import { SEARCH_TEXT, SORT_SEARCH, SEARCH_ITEM_ARRAY, SEARCH_ARRAY, actionCreator } from '../actions/search'
import { StyleSheet, ScrollView, View, Platform, ActivityIndicator, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import isJson from '../processes/isJson';
import { FlatList } from 'react-native-gesture-handler';


export default function Search({navigation, route}) {
    const display_text = isJson(useSelector(state => state.search)).sort_search
    const search_array = isJson(useSelector(state => state.search)).searchItemArray
    const searched = isJson(useSelector(state => state.search)).searchArray
    const loading = isJson(useSelector(state => state.search)).loading
    const dispatch = useDispatch()
    const prev = isJson(useSelector(state => state.learn)).preview
    const preview = useMemo(() => { uri: prev }, [prev])

    const subject = route.params ? route.params.subject : null

    const onClick = item => {
        dispatch(actionCreator(SEARCH_TEXT, item))
        dispatch(actionCreator(SORT_SEARCH, false))
    }

    const renderItem = ({item}) => {
        return <Text numberOfLines={1} onPress={() => onClick(item.searched)} style={style.items}>{item.searched}</Text>
    }

    const renderItems = ({item}) => {
        return (
            <ReadItems 
                navigation={navigation}
                item={item}
                subject={subject}
                preview={preview}
            />
        )
    }

    useEffect(() => {
        return () => {
            dispatch(actionCreator(SEARCH_ARRAY, []))
            dispatch(actionCreator(SEARCH_ITEM_ARRAY, []))
        }
    }, [])
    null

    return (
        <Container style={style.container}>
            <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
            <SearchHeader navigation={navigation} subject={subject} />
            
                {display_text ? 
                    search_array.length ?
                        <FlatList
                            style={style.content}
                            data={search_array}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.searched }
                        />
                        : null
                    :
                    loading ?
                        <Overlay isVisible={loading}>
                            <View style={style.loading}>
                                <View style={style.activity}>
                                    <ActivityIndicator size='small' color='#0000ff' />
                                </View>
                                <View style={[style.activity, style.activityText]}>
                                    <Text style={style.textLoading}>
                                        Searching ...
                                    </Text>
                                </View>                                
                            </View>
                        </Overlay>
                    :
                    searched.length ? 
                        <FlatList
                            style={style.content}
                            data={searched}
                            renderItem={renderItems}
                            keyExtractor={(item) => item.id }
                        />
                    : null
                }           
        </Container>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
    },
    loading: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    view: {
        height: 100,
    },
    activity: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityText: {
        width: '80%',
        alignItems: 'flex-start',
    },
    items: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    textLoading: {
        fontSize: 16
    }
})
