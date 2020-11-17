import React, { lazy, Suspense, useMemo, useCallback } from 'react'
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { Container, Toast, Card, CardItem, Body, Icon as NativeIcon } from 'native-base'
import { View, ScrollView, Text, StyleSheet, BackHandler } from 'react-native'
import isJson from '../processes/isJson'; 
import deviceSize from '../processes/deviceSize'
import Rolling from './Rolling'
import { MemoizedSubjectHeader } from './SubjectHeader'
import ReadItems from './ReadItems'
import Image from './Image'
import { TabRouter, useFocusEffect } from '@react-navigation/native'
import {loadingArticleStop} from '../actions/learn'
// import { likeFxn, unlikeFxn, archiveFxn } from '../actions/request'
// import useCheckpoint from './useCheckpoint'
import { useDispatch, useSelector } from 'react-redux';

const Overlay = lazy(() => import('./Overlay'))
const ErrorPage = lazy(() => import('./ErrorPage'))
// const deviceHeight = deviceSize().deviceHeight
// const deviceWidth = deviceSize().deviceWidth

const uris = {
    history: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230128/Categories/History_ndetqy.jpg',
    health: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230123/Categories/Health_cover_z40x2g.jpg',
    geography: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230121/Categories/Geography_oqgvbc.jpg',
    finance: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230109/Categories/Finance_o4i2xw.jpg',
    sport: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230107/Categories/Sports_okhqqt.jpg',
    socials: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230086/Categories/Socials_pmz5gk.jpg',
    science: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230081/Categories/Science_lglise.jpg',
    politics: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230077/Categories/Politics_mmds91.jpg',
    lifestyle: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230047/Categories/Lifestyle_cbwqqv.jpg',
    entertainment: 'https://res.cloudinary.com/bookchmap/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1603230030/Categories/Entertainment_s0wxqp.jpg'
}


const Subject = ({ navigation, route }) => {
    const deviceHeight = deviceSize().deviceHeight
    const deviceWidth = deviceSize().deviceWidth
    const {subject} = route.params
    const dispatch = useDispatch()
    const store = isJson(useSelector(state => state.learn))
    const preview = useMemo(() => { uri: store.preview }, [store.preview])
    const disItems = isJson(store.displayItems)
    const uri = subject === 'Science and Technology' ? uris.science : uris[subject.toLowerCase()]
    // const updateSearch = (search) => {
    //     setSearch(search)
    //     if(search){
    //         setLoading(true)
    //     }
    // }
    
    

    
    const searchContent = () => {} 

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                console.log(store.loading_article, 'value for loading_article' )
                if(store.loading_article == true){
                    dispatch(loadingArticleStop())
                    return true
                }else if(store.loading_article == false) {
                    navigation.navigate('Learn')
                    return true
                }else{
                    return false
                }
            }

            BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            }
        }, [])
    )

    return(
        <Container style={style.container}>
            <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
            <MemoizedSubjectHeader navigation={navigation} subject={subject} />
            <ScrollView style={style.content}>
                {store.load_error ?
                    (
                        <Suspense fallback={<View style={style.loading}><Text>Loading...</Text></View>}>
                            <ErrorPage/>
                        </Suspense>
                    )
                    :
                    store.loading_article ?
                    (
                        <Suspense fallback={<View><Text>Loading...</Text></View>}>
                            <Overlay isVisible={store.loading_article} deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
                                <Rolling text={`${subject}...`} />
                            </Overlay>
                        </Suspense>
                    )
                    :
                    disItems.length ? 
                    (
                        <View>
                            <View style={[style.viewImage]}>
                                <Image {...{preview, uri}} style={style.lionel} />
                                <Text style={style.subject}> {subject} </Text>
                            </View>
                            {disItems.map((item, i) => {
                                return (
                                    <ReadItems 
                                        item={item} 
                                        subject={subject} 
                                        navigation={navigation} 
                                        preview={preview} 
                                        key={i}
                                    />
                                    )
                            }
                            )}
                        </View>
                    )
                    :
                    (
                        <View style={style.loading}>
                            <Text>There was no article for {subject}</Text>
                        </View>
                    )
                }
            </ScrollView>
        </Container>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Constants.statusBarHeight ,
        backgroundColor: '#fff',     
    },
    content: {
        // flex: 1,
        backgroundColor: "#000",
    },
    viewImage: {
        // paddingTop: 0,
        // marginTop: 0,
        position: 'relative',
        height: 250,
    },
    subject: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lionel: {
        width: '100%',
        height: '100%',
    },
    content: {
        marginTop: 25,
    },
    blue: {
        color: 'blue',
    },
})

export default Subject