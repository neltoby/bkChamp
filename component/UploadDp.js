import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import FocusAwareStatusBar from './FocusAwareStatusBar'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import Container from './Container'
import { Icon, Button as NButton } from 'native-base'
import { Badge } from 'react-native-elements'

export default function UploadDp() {
    const [imgUrl, setImg] = useState({})
    const [cloudImg, setCloudImg] = useState('')
    const [loading, setLoading] = useState(false)

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
        setLoading(true)
        let base64Img = `data:image/jpg;base64,${imgUrl.base64}`;
        let data = {
            "file": base64Img,
            "upload_preset": "",
        }
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
                        <Image 
                            source={Object.entries(imgUrl).length ? { uri: imgUrl.uri } : require('../img/anonymous.jpg') } 
                            style={style.imgUrl} 
                        />
                        <Badge containerStyle={[style.badge]}
                            value = {<Icon name="camera" style={{ fontSize: 25, color: "#054078" }}/>}
                            onPress= {pickImage}
                        />
                        {loading ? 
                            <View style={style.loading}>
                                <Text style={style.loadingText}>Loading</Text>
                            </View> 
                            : null
                        }
                    </View>
                </View>
                <View style={style.infoDirection}>
                    <View style={style.direction}>
                        <NButton transparent iconLeft style={style.button} onPress={pickImage}>
                            <Icon name='cloud-upload' style={[style.icon, style.color]} />
                            <Text style={[style.butTex, style.color]}>UPLOAD</Text>
                        </NButton>
                        <NButton transparent iconRight style={style.button}>
                            <Text style={style.butTex}>SKIP</Text>
                            <Icon name='ios-arrow-forward' style={style.icon} />
                        </NButton>
                    </View>
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
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    loadingText: {
        fontSize: 15,
        color: '#fff',
    },
    button: {
        // paddingHorizontal:
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
