import React, { useState, useEffect } from 'react'
import { StyleSheet, Platform, ActivityIndicator, Text } from 'react-native'
import { Header, Item, Input, Button, Icon } from 'native-base'
import { actionCreator, getSearchItem, SEARCH_TEXT, SORT_SEARCH } from '../actions/search'
import { getSearchArray } from '../actions/request'
import { useDispatch, useSelector } from 'react-redux'
import isJson from '../processes/isJson'

export default function SearchHeader({navigation, subject}) {
    const search = isJson(useSelector(state => state.search)).search
    const typing = isJson(useSelector(state => state.search)).sort_search
    const { navigate } = navigation
    const dispatch = useDispatch()

    const setSearch = text => {
        dispatch(actionCreator(SEARCH_TEXT, text))
        dispatch(actionCreator(SORT_SEARCH, text.trim().length ? true : false))
    }
    const searchHeader = () => {
        dispatch(getSearchArray({subject, search}))
    }
    const searchContent = () => {}

    useEffect(() => {
        if(typing) dispatch(getSearchItem())
    },[typing])
    return (
        <Header searchBar style={style.header}>
            {Platform.OS == 'ios' ? 
                <>
                    <Item>
                        <Icon name="close" onPress={() => setSearch('')} />
                        <Input 
                            placeholder={`Search ${subject}`}
                            value={search}
                            onChangeText={text => {setSearch(text)}}
                        />
                        <Icon name="ios-search" onPress={searchHeader} />
                    </Item>
                    <Button transparent onPress={() => navigate('Subject')}>
                        <Text>Back</Text>
                    </Button>
                </>
                : 
                <>
                    <Item>
                        <Icon name="arrow-back" onPress={() => navigate('Subject')} />                            
                            <Input 
                                placeholder={`Search ${subject}`}
                                value = {search}
                                onChangeText = {text => setSearch(text)}
                            />
                        {search.length ? <Icon name="close" onPress={() => setSearch('')} /> : null}
                        {search.length && typing ? <ActivityIndicator size="small" color="#0000ff" /> : null}
                        <Icon name="ios-search"  onPress={searchHeader} />                      
                    </Item>
                </>
            }
        </Header>
    )
}

const style = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
    }
})
