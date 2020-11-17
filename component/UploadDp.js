import React, { useState, useEffect, useCallback, useMemo } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native'
import Constants from 'expo-constants';
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { View, Text, StyleSheet, Image as RNImage, Alert } from 'react-native'
import Image from './Image'
import Container from './Container'
import { Icon, Button as NButton, Toast } from 'native-base'
import { Badge } from 'react-native-elements'
import { login, welcome } from '../actions/login'
import { updateUserinfo } from '../actions/user'
import { useDispatch, useSelector } from 'react-redux';
import isJson from '../processes/isJson'

const api = 'https://api.cloudinary.com/v1_1/bookchmap/image/upload'

export default function UploadDp({navigation}) {
    const dispatch = useDispatch()
    const [imgUrl, setImg] = useState({})
    const [empty, setEmpty] = useState(false)
    const [cloudImg, setCloudImg] = useState(null)
    const [loading, setLoading] = useState(false)
    const storePreview = isJson(useSelector(state => state.learn)).preview
    const preview = useMemo(() => { uri: storePreview }, [storePreview])
    const uri = cloudImg 

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
        setImg(result);
        }
    }

    const uploadPix = () => {
        if(imgUrl.base64){
            setLoading(true)
            let base64Img = `data:image/jpg;base64,${imgUrl.base64}`;
            let data = {
                "file": base64Img,
                "upload_preset": "bookchampUsers",
            }
            fetch(api, {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            })
            .then(async res => {
                let data = await res.json()
                setLoading(false)
                setCloudImg(data.secure_url)
                dispatch(updateUserinfo({name: 'image', value: data.secure_url}))
            }).catch(err => {
                setLoading(false)
                setEmpty(true)
                Toast.show({
                    text: 'error uploading profile',
                    buttonText: "CLOSE",
                    duration: 3000
                })
                setTimeout(() => {
                    setEmpty(false)
                }, 2000);
            })
        }else{
            setEmpty(true)
            setTimeout(() => {
                setEmpty(false)
            }, 2000);
        }       
    }
    useFocusEffect(
        useCallback(() => {
            dispatch(welcome('Welcome'))
            return () => {}
        }, [])
    )

    const skip = () => {
        // dispatch(welcome('Welcome'))
        setTimeout(() => {
            dispatch(login())  
        }, 500);             
    }
    const finished = () => {
        dispatch(login())
    }

    useEffect(() => {
        (async () => {
            if (Constants.platform.ios) {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    return (
        <Container>
            <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
            <View style={style.container}>
                <View style={style.info}/>
                <View style={[style.info, style.infotext]}>
                    <Text style={style.textInfo}>
                        Upload a profile picture
                    </Text>
                </View>
                <View style={style.infoImage}>
                    <View style={style.imageContainer}>
                        {cloudImg === null || !cloudImg ? 
                            <RNImage source={require('../img/anonymous.jpg')} style={style.imgUrl} />
                        :
                            <Image 
                                {...{preview, uri}}
                                style={style.imgUrl} 
                            />
                        }
                        
                        <Badge containerStyle={[style.badge]}
                            value = {<Icon name="camera" style={{ fontSize: 25, color: "#054078" }}/>}
                            onPress= {pickImage}
                        />
                        {loading ? 
                            <View style={style.loading}>
                                <Text style={style.loadingText}>Loading</Text>
                            </View> 
                        : empty ?
                            <View style={style.loading}>
                                <Text style={style.loadingText}>Error</Text>
                            </View> 
                         : null 
                        }
                    </View>
                </View>
                <View style={style.infoDirection}>
                    {cloudImg === null || !cloudImg ? 
                        <View style={style.direction}>
                            <NButton transparent iconLeft style={style.button} onPress={uploadPix}>
                                <Icon name='cloud-upload' style={[style.icon, style.color]} />
                                <Text style={[style.butTex, style.color]}>UPLOAD</Text>
                            </NButton>
                            <NButton transparent iconRight style={style.button} onPress={skip}>
                                <Text style={style.butTex}>SKIP</Text>
                                <Icon name='ios-arrow-forward' style={style.icon} />
                            </NButton>
                        </View>
                    :
                        <View style={style.directions}>
                            <NButton block style={style.buttons} onPress={finished}>
                                <Text style={style.butTex}>FINISHED</Text>
                            </NButton>
                        </View>
                    }
                </View>                
            </View>
        </Container>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    info: {
        flex: 0.1
    },
    infotext: {
        alignItems: "center",
    },
    textInfo: {
        color: '#eee',
        fontSize: 19,
        // fontWeight: 'bold',
    },
    infoImage: {
        flex: 0.2,
        alignItems: 'center'
    },
    infoDirection:{
        flex: 0.6,
        paddingTop: 30
    },
    direction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
    },
    directions: {
        paddingHorizontal: 30,
    },
    imageContainer: {
        height: 130,
        width: 130,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        bottom: -5,
        right: 0,
        borderRadius: 20,
        width: 40, 
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee'
    },
    imgUrl: {
        width: 140,
        height: 140,
        borderRadius: 70
    },
    loading: {
        width: 80,
        position: 'absolute',
        top: 50,
        right: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 15,
        color: '#fff',
    },
    buttons: {

    },
    butTex: {
        color: '#fff',
        fontWeight: 'bold'
    },
    icon: {
        paddingHorizontal: 10,
        color: '#fff',
    },
    color: {
        color: 'yellow'
    }
})
