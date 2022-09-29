import {
    DrawerContentScrollView, DrawerItem
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Image as RNImage, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { logoutWarning } from '../actions/login';
import isJson from '../processes/isJson';
import Image from './Image';

const CustomSideBar = (props) => {
    const { navigation } = props
    const dispatch = useDispatch()
    const points = isJson(useSelector(state => state.user.user)).points
    const userImg = useSelector(state => state.user).user.image
    const storePreview = isJson(useSelector(state => state.learn)).preview
    const preview = useMemo(() => { uri: storePreview }, [storePreview])
    const uri = userImg
    const username = isJson(useSelector(state => state.user)).user.username

    const logout = () => {
        navigation.closeDrawer()
        dispatch(logoutWarning(true))
    }

    let firstData = [
        {
            text: 'Subcribe',
            icon: <Icon type='material-community' name='account-check' size={24} color='#3480eb' />,
            onPress: () => navigation.navigate('Subscribe'),
        },
        {
            text: 'Archive',
            icon: <Icon type='material-community' name='archive' size={24} color='#3480eb' />,
            onPress: () => navigation.navigate('Archive'),
        },
        {
            text: 'Settings',
            icon: <Icon type='material-community' name='cogs' size={24} color='#3480eb' />,
            onPress: () => navigation.navigate('Setting'),
        },
        {
            text: 'FAQ(s)',
            icon: <Icon type='material-community' name='help-circle' size={24} color='#3480eb' />,
            onPress: () => navigation.navigate('Faq'),
        },
        {
            text: 'About Us',
            icon: <Icon type='material' name='info' size={24} color='#3480eb' />,
            onPress: () => navigation.navigate('About'),
        },
        {
            text: 'Logout',
            icon: <Icon type='material-community' name='logout' size={24} color='#3480eb' />,
            onPress: () => logout(),
        },

    ]
    return (
        <DrawerContentScrollView>
            <SafeAreaView style={style.container}>
                <View style={style.imgContainer}>
                    <LinearGradient
                        colors={['transparent', '#fff']}
                        style={{ ...style.gradient, height: 150, }}
                    />
                    <View style={style.imgView}>
                        {userImg === null || userImg === undefined ?
                            <RNImage source={require('../img/anonymous.jpg')} style={style.img} />
                            :
                            <Image
                                {...{ preview, uri }}
                                style={style.img}
                            />
                        }
                    </View>
                    <View style={style.detailView}>
                        <Text numberOfLines={1} style={style.name}>@{username}</Text>
                        <View style={style.bond}>
                            <Icon
                                type='font-awesome'
                                name='circle'
                                color='#FFA500'
                                size={16} />
                            <Text style={{ ...style.mode, fontSize: 18 }}> starter</Text>
                        </View>
                        <Text style={{ ...style.mode, paddingLeft: 10 }}>{points} units</Text>
                    </View>
                </View>
                {firstData.map((data, i) => {
                    return (
                        <DrawerItem
                            label={data.text}
                            icon={() => data.icon}
                            onPress={data.onPress}
                            key={`${data}${i}`}
                        />
                    )
                })}
            </SafeAreaView>
        </DrawerContentScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    imgContainer: {
        height: 150,
        backgroundColor: '#054078',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    imgView: {
        width: '50%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    img: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    name: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    mode: {
        color: '#fff',
    },
    bond: {
        paddingVertical: 7,
        paddingHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    detailView: {
        width: '50%',
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'flex-start'
    }

})

export default CustomSideBar