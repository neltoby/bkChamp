import { useFocusEffect } from '@react-navigation/native'
import { Body, Button, Container, Header, Icon as NativeIcon, Left, Right, Subtitle, Toast } from 'native-base'
import React, { useMemo, useState } from 'react'
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native'
// import { SlideAnimation, BottomModal, ModalTitle, ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
import { Badge } from 'react-native-elements'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Hyperlink from 'react-native-hyperlink'
import { useDispatch, useSelector } from 'react-redux'
import { onFailedArchive, onFailedLike, updateSeenArticle } from '../actions/learn'
import { archiveFxn, likeFxn, unarchiveFxn, unlikeFxn } from '../actions/request'
import deviceSize from '../processes/deviceSize'
import isJson from '../processes/isJson'
import CustomOverlay from './CustomOverlay'
import Image from './Image'
import useCheckpoint from './useCheckpoint'

const reactStringReplace = require('react-string-replace')

const ReadPost = ({ navigation, route }) => {
    const { subject } = route.params
    const items = route.params.item
    const item = route.params.type !== undefined ? route.params.item : isJson(useSelector(state => state.learn)).displayItems.find(element => element.id === items.id)
    const windowHeight = deviceSize().deviceHeight
    const dispatch = useDispatch()
    const [imageOverlay, setImageOverlay] = useState(false)
    const [word, setWord] = useState({})
    const store = isJson(useSelector(state => state.learn))
    const preview = useMemo(() => { uri: store.preview }, [store.preview])
    let replaceText
    replaceText = item.new_word_1 !== '' && item.new_word_1 !== null ? reactStringReplace(item.body, item.new_word_1.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.new_word_1.split(':')[1], 1)}>{match}</Text>
    )) : item.body
    replaceText = item.new_word_2 !== '' && item.new_word_2 !== null ? reactStringReplace(replaceText, item.new_word_2.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.new_word_2.split(':')[1], 1)}>{match}</Text>
    )) : replaceText
    replaceText = item.new_word_3 !== '' && item.new_word_3 !== null ? reactStringReplace(replaceText, item.new_word_3.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.new_word_3.split(':')[1], 1)}>{match}</Text>
    )) : replaceText
    replaceText = item.idioms_1 !== '' && item.idioms_1 !== null ? reactStringReplace(replaceText, item.idioms_1.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.idioms_1.split(':')[1], 0)}>{match}</Text>
    )) : replaceText
    replaceText = item.idioms_2 !== '' && item.idioms_2 !== null ? reactStringReplace(replaceText, item.idioms_2.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.idioms_2.split(':')[1], 0)}>{match}</Text>
    )) : replaceText
    replaceText = item.idioms_3 !== '' && item.idioms_3 !== null ? reactStringReplace(replaceText, item.idioms_3.split(':')[0], (match, i) => (
        <Text key={match + i} style={style.color} onPress={() => newWord(match, item.idioms_3.split(':')[1], 0)}>{match}</Text>
    )) : replaceText

    const newWord = (word, meaning, num) => {
        const obj = { word, meaning, type: num === 1 ? 'New word' : 'Idiom' }
        setWord(obj)
    }

    const closeWord = () => {
        setWord({})
    }

    const likes = async (id) => {
        if (item.liked === false) {
            const getResult = useCheckpoint(onFailureLike, onSuccessLike, id)
            getResult().then(res => {
                Toast.show(
                    {
                        text: 'You liked post',
                        buttonText: 'CLOSE',
                        type: 'success',
                        textStyle: { fontSize: 14 },
                        style: { marginHorizontal: 50, borderRadius: 20, marginBottom: 20 }
                    }
                )
            })
        } else {
            const getResult = useCheckpoint(onFailureUnlike, onSuccessUnlike, id)
            await getResult()
        }
    }

    const archive = (obj) => {
        if (!obj.item.archived) {
            const getResult = useCheckpoint(onFailureArchive, onSuccessArchive, obj)
            getResult()
        } else {
            const getResult = useCheckpoint(onFailureUnarchive, onSuccessUnarchive, obj)
            getResult()
        }
    }
    // when network is confirmed for a like request
    const onSuccessLike = (id) => {
        dispatch(likeFxn(id))
    }
    // when there is no network for a like request
    const onFailureLike = (id) => {
        dispatch(onFailedLike({ id, state: 1 }))
    }
    // when network is confirmed for an unlike request
    const onSuccessUnlike = (id) => {
        dispatch(unlikeFxn(id))
    }
    // when there is no network for an unlike request
    const onFailureUnlike = (id) => {
        dispatch(onFailedLike({ id, state: 0 }))
    }
    // when network is confirmed for an archive request
    const onSuccessArchive = (obj) => {
        dispatch(archiveFxn(obj))
    }
    // when there is no network for a archive request
    const onFailureArchive = (obj) => {
        dispatch(onFailedArchive({ ...obj, state: 1 }))
    }
    // when network is confirmed for an unarchive request
    const onSuccessUnarchive = (obj) => {
        dispatch(unarchiveFxn(obj))
    }
    // when there is no network for an unarchive request
    const onFailureUnarchive = (obj) => {
        dispatch(onFailedArchive({ ...obj, state: 0 }))
    }

    const displayImage = () => {
        setImageOverlay(!imageOverlay)
    }
    useFocusEffect(
        React.useCallback(() => {
            if (!item.read) {
                dispatch(updateSeenArticle(item.id))
            }
            return () => {
            }
        }, [item.id])
    )
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate(route.params.type !== undefined ? 'ViewArchive' : 'Subject')
                return true
            }

            BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            }
        }, [item.id])
    )

    return (
        <>
            <Container style={{ backgroundColor: "#fff" }}>
                <Header style={style.header}>
                    <Left>
                        <Button transparent onPress={() => navigation.navigate(route.params.type ? 'ViewArchive' : 'Subject')}>
                            <NativeIcon name={Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'} />
                        </Button>
                    </Left>
                    <Body>
                        <Subtitle>
                            {item.title}
                        </Subtitle>
                    </Body>
                    <Right>
                        <Button transparent >
                            <NativeIcon type='FontAwesome5' name='ellipsis-v' style={{ fontSize: 18, color: '#fff' }} />
                        </Button>
                    </Right>
                </Header>
                <View style={style.container}>
                    <View style={style.imageContaniner}>
                        <TouchableWithoutFeedback onPress={displayImage} style={style.imgView}>
                            <Image {...{ preview, uri: item.image_url }} style={style.img} />
                        </TouchableWithoutFeedback>
                        <View style={style.titleContainer}>
                            <Text numberOfLines={1} style={style.title}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <View style={style.emptyContent} />
                    <ScrollView style={style.content}>
                        <Hyperlink
                            linkDefault={true}

                            linkStyle={{ color: '#2980b9' }}
                        >
                            <View style={style.textView}>
                                <Text>{replaceText}</Text>
                            </View>
                        </Hyperlink>
                        {route.params.type === undefined ?
                            <View style={style.actions}>
                                <View style={style.action}>
                                    <NativeIcon
                                        type={item.liked ? 'Ionicons' : 'FontAwesome5'}
                                        onPress={() => likes(item.id)}
                                        name='heart'
                                        style={{ color: item.liked ? 'red' : '#777', fontSize: 28 }} />
                                    <Badge
                                        badgeStyle={{ width: 25, height: 25, borderRadius: 25 / 2, backgroundColor: 'transparent' }}
                                        value={<Text style={style.badgeText}>{item.likes}</Text>}
                                        containerStyle={{ position: 'absolute', top: -4, right: 20 }}
                                    />
                                </View>
                                <View style={style.action}>
                                    <NativeIcon
                                        type={item.read ? 'Ionicons' : 'FontAwesome5'}
                                        name='eye'
                                        style={{ color: '#777', fontSize: 28 }} />
                                </View>
                                <View style={style.action}>
                                    <NativeIcon
                                        onPress={() => { archive({ item }); Toast.show({ text: item.archived ? `Removed from archive` : `Saved to your ${subject} archive`, buttonText: 'CLOSE', style: { backgroundColor: item.archived ? 'red' : 'green' } }) }}
                                        type='Ionicons'
                                        name='md-archive'
                                        style={{ color: item.archived ? 'green' : '#777', fontSize: 28 }}
                                    />
                                </View>
                            </View>
                            : null
                        }
                    </ScrollView>
                </View>
            </Container>
            <CustomOverlay
                isVisible={imageOverlay}
                backgroundColor='rgba(0,0,0,1)'
                animation='slide'
            >
                <View style={{ ...style.imageContainer, height: windowHeight }}>
                    <View style={style.cover}>
                        <NativeIcon
                            type='FontAwesome'
                            onPress={displayImage}
                            name='times'
                            style={{ color: '#ddd', fontSize: 28, position: 'absolute', right: 20, top: 50 }} />
                    </View>
                    <View style={style.imageWrapper}>
                        <Image {...{ preview, uri: item.image_url }} style={style.bigimg} />
                    </View>
                    <View style={style.cover} />
                </View>
            </CustomOverlay>
            {/*} <BottomModal 
            modalAnimation={new SlideAnimation({
                initialValue: 0,
                slideFrom: 'bottom',
                useNativeDriver: true,
            })}
            onDismiss={() => setWord({})}
            modalTitle={<ModalTitle title={word.type} />}
            onHardwareBackPress={() =>{ setWord({}); return true}}
            onSwipeOut={ event => setWord({})}
            visible={Object.entries(word).length ? true : false}
            footer={
                <ModalFooter>
                    <ModalButton
                    text="OK"
                    onPress={() => setWord({})}
                    />
                </ModalFooter>
                }
        >
            <ModalContent>
                <View style={{...style.wordContainer}}>
                    <View style={style.wordtitle}>
                        <Text style={style.titleText}>{word.word}</Text>
                    </View>
                    <View style={style.wordtitle}>
                        <Text>{word.meaning}</Text>
                    </View>
                </View>
            </ModalContent>
        </BottomModal> */}
        </>
    )
}

const style = StyleSheet.create({
    header: {
        marginTop: 20,
        backgroundColor: '#054078',
    },
    container: {
        flex: 1
    },
    imageContaniner: {
        flex: 0.5,
    },
    emptyContent: {
        flex: 0.05,
    },
    content: {
        flex: 0.45,
        paddingTop: 10,
    },
    imgView: {

    },
    img: {
        width: '100%',
        height: '95%',
    },
    textView: {
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 15,
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 20
    },
    action: {
        flex: 0.33,
        alignItems: 'center',
    },
    heading: {
        fontWeight: 'bold',
        color: '#054078'
    },
    // wordsContainer: {
    //     padding: 10,
    // },
    color: {
        color: '#2980b9',
        fontWeight: 'bold',
    },
    wordtitle: {
        paddingHorizontal: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    // newWordsContainer: {
    //     marginBottom: 20
    // }, 
    // newWordTitle: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     paddingVertical: 5,
    // },
    // newTitle: {
    //     fontWeight: 'bold',
    //     fontSize: 17,
    //     color: '#444'
    // },
    // newWordContent: {
    //     marginBottom: 10,
    // }, 
    badgeText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },
    titleContainer: {
        height: '5%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#054078',
    },
    imageContainer: {
        height: '100%',
    },
    imageWrapper: {
        flex: 0.6
    },
    cover: {
        flex: 0.2
    },
    bigimg: {
        width: '100%',
        height: '100%',
    }
})

export default ReadPost

{/* <CustomOverlay
                isVisible={true}
                backgroundColor = 'rgba(0,0,0,0.5)'
                animation='slide'
            >
                <View style={{...style.wordContainer}}>
                    <View style={style.wordtitle}>
                        <Text>{word.type}</Text>
                        <Text>{word.word}</Text>
                    </View>
                    <View style={style.wordContent}>
                        <Text>{word.meaning}</Text>
                    </View>
                    <View style={style.wordClose} >
                        <Button onPress={closeWord}>
                            <Text>CLOSE</Text>
                        </Button>
                    </View>
                </View>
            </CustomOverlay> */}