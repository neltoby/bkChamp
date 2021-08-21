import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {onFailedLike, onFailedArchive} from '../actions/learn'
import { likeFxn, unlikeFxn, archiveFxn, unarchiveFxn } from '../actions/request'
import useCheckpoint from './useCheckpoint'
import Image from './Image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Toast, Card, CardItem, Body, Icon as NativeIcon } from 'native-base'
import { useDispatch } from 'react-redux'

export default function ReadItems({item, navigation, subject, preview}) {
    let uri = item.image_url 
    const dispatch = useDispatch()
    
    const takeTo = ({item}) => {
        navigation.navigate('ReadPost', {subject, item})
    }

    const likes = async (id, liked) => {
        if(!liked){
            const getResult = useCheckpoint(onFailureLike, onSuccessLike, id)
            getResult().then(res => {
                Toast.show(
                    { 
                        text: 'You liked post', 
                        buttonText: 'CLOSE', 
                        type: 'success',
                        textStyle: { fontSize: 14 },
                        style: {marginHorizontal: 50, borderRadius: 20, marginBottom: 20 }
                    }
                )
            })
            
        }else{
            const getResult = useCheckpoint(onFailureUnlike, onSuccessUnlike, id)
            await getResult()
        } 
    }

    const onSuccessLike = (id) => {
        dispatch(likeFxn(id))
    }
    const onFailureLike = (id) => {
        dispatch(onFailedLike({id,state: 1}))
    }
    const onSuccessUnlike = (id) => {
        dispatch(unlikeFxn(id))
    }
    const onFailureUnlike = (id) => {
        dispatch(onFailedLike({id,state: 0}))
    }
    const archive = (obj) => {
        if(!obj.item.archived) {
            const getResult = useCheckpoint(onFailureArchive, onSuccessArchive, obj)
            getResult()
        }else{
            const getResult = useCheckpoint(onFailureUnarchive, onSuccessUnarchive, obj)
            getResult()
        }
    }

    // when network is confirmed for an unarchive request
    const onSuccessUnarchive = obj => {
        dispatch(unarchiveFxn(obj))
    }

    // when there is no network for an unarchive request
    const onFailureUnarchive = obj => {
        dispatch(onFailedArchive({...obj,state: 0}))
    }

    // when network is confirmed for an archive request
    const onSuccessArchive = (obj) => {
        dispatch(archiveFxn(obj))
    }

    // when there is no network for a archive request
    const onFailureArchive = (obj) => {
        dispatch(onFailedArchive({...obj,state: 1}))
    }

    return (
        <Card style={style.cardContent} key={item.id}>
            <CardItem>
                <Body>
                    <View style={style.titleContainer}>
                        <Text numberOfLines={1} style={style.title}>
                            {item.title}
                        </Text> 
                    </View>
                    <View style={style.imgContainer}>
                        {item.image !== null ? (
                        <View style={style.viewImg}> 
                            <TouchableWithoutFeedback onPress={() => takeTo({item})}>
                                <Image style={style.league} {...{preview, uri}} />
                            </TouchableWithoutFeedback>
                        </View>
                        ) : null}
                        <View style={{...style.imgText, width: item.image !== null ? '60%': '100%'}}>
                            <TouchableWithoutFeedback onPress={() => takeTo({item})}>
                                <Text numberOfLines={6}>
                                    {item.body}
                                </Text>                        
                            </TouchableWithoutFeedback>
                            <View style={item.image_url !== null ? style.action : {...style.action, flexDirection: 'row-reverse'}}>
                                <View style={{width: item.image_url !== null ? '100%' : '60%', flexDirection: 'row'}}>
                                    <View style={style.actions}>
                                        <NativeIcon type={item.liked ? 'Ionicons' : 'FontAwesome5'} onPress={() => likes(item.id, item.liked)} name='heart' style={{color: item.liked ? 'red' : '#777', fontSize: 25}} />
                                    </View>
                                    <View style={style.actions}>
                                        <NativeIcon type={item.read ? 'Ionicons' : 'FontAwesome5'} name='eye' style={{color: '#777', fontSize: 25}} />
                                    </View>
                                    <View style={style.actions}>
                                        <NativeIcon 
                                            onPress={() => {archive({item}); Toast.show({ text: item.archived ? `Removed from archive` : `Saved to your ${subject} archive`, buttonText: 'CLOSE', style: {backgroundColor: item.archived ? 'red' : 'green'} })}} 
                                            type= 'Ionicons' 
                                            name= 'md-archive' 
                                            style={{color: item.archived ? 'green' : '#777', fontSize: 25}} 
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Body>
            </CardItem>
        </Card>
    )
}

const style = StyleSheet.create({
    titleContainer: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#054078',
    },
    imgContainer: {
        flexDirection: 'row',
    }, 
    viewImg: {
        width: '40%'
    },
    league: {
        width: '100%',
        height: 130,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    imgText: {       
        paddingLeft: 15,
    },
    action: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    actions: {
        width: '33%',
        alignItems: 'center',
    },
})