import React, { useMemo } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import {
    DrawerContentScrollView, DrawerItem,
  } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { logoutWarning } from '../actions/login'
import { deleteAccountWarning } from '../actions/login';
import Image from './Image'
import { SafeAreaView, View, Text, StyleSheet, Image as RNImage } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import isJson from '../processes/isJson'

const CustomSideBar = (props) => {
    const {navigation} = props
    const dispatch = useDispatch()
    const points = isJson(useSelector(state => state.user.user)).points 
    const userImg = isJson(useSelector(state => state.user)).user.image
    const storePreview = isJson(useSelector(state => state.learn)).preview
    const preview = useMemo(() => { uri: storePreview }, [storePreview])
    const uri = userImg 
    const username = isJson(useSelector(state => state.user)).user.username
    
    const logout = () => {
        navigation.closeDrawer()
        dispatch(logoutWarning(true))
    }
    const deleteUser = () => {
        navigation.closeDrawer();
        dispatch(deleteAccountWarning(true))
    }

    let firstData = [
        {
            text: 'Quiz', 
            icon: <Icon type='material-community' name='gamepad-variant' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Quiz'),
        },
        {
            text: 'Ranking', 
            icon: <Icon type='material-community' name='star' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Ranking'),
        },
        {
            text: 'Learn', 
            icon: <Icon type='font-awesome' name='book' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Learn'),
        },
        {
            text: 'Subcribe', 
            icon: <Icon type='material-community' name='account-check' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Subscribe'),
        },
        {
            text: 'Archive', 
            icon: <Icon type='material-community' name='archive' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Archive'),
        },
    ]
    let lastData = [
        {
            text: 'Settings', 
            icon: <Icon type='material-community' name='cogs' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Setting'),
        },
        {
            text: 'Notification', 
            icon: <Icon type='material-community' name='bell' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Notifications'),
        },
        {
            text: 'FAQ(s)', 
            icon: <Icon type='material-community' name='help-circle' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('Faq'),
        },
        {
            text: 'About Us', 
            icon: <Icon type='material' name='info' size={24} color='#3480eb'/>,
            onPress: () => navigation.navigate('About'),
        },
        {
            text: 'Delete account', 
            icon: <Icon type='material' name='delete' size={24} color='#3480eb'/>,
            onPress: () => deleteUser(),
        },
        {
            text: 'Logout', 
            icon: <Icon type='material-community' name='logout' size={24} color='#3480eb'/>,
            onPress: () => logout(),
        },

    ] 
    return (
        <DrawerContentScrollView>
            <SafeAreaView style={style.container}>
                <View style={style.imgContainer}>
                <LinearGradient
                    colors={['transparent', '#e1efef']}
                    style={{...style.gradient, height: 150,}}
                />
                    <View style={style.imgView}>
                        {userImg === null || userImg === undefined ?
                            <RNImage source={require('../img/anonymous.jpg')} style={style.img} />
                        :
                            <Image 
                                {...{preview, uri}}
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
                            <Text style={{...style.mode, fontSize: 18}}> starter</Text>
                        </View>
                        <Text style={{...style.mode, paddingLeft: 10}}>{points} units</Text>
                    </View>
                </View>
                {firstData.map((data, i) => {
                    return(
                        <DrawerItem 
                        label={data.text}
                        icon={() => data.icon}
                        onPress={data.onPress}
                        key={`${data}${i}`}
                        />
                    )
                })}
                <View style={style.divider}/>
                {lastData.map((data, i) => {
                    return(
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
        justifyContent: 'center'
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
    },
    divider: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#3480eb',
        marginVertical: 10,
        alignSelf: 'center',

    }

})

export default CustomSideBar 