import React, { useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native';
import {Container, Header, Content, Left, Body, Right, Button, Title, Icon as NativeIcon} from 'native-base'
import { ScrollView, StyleSheet, View, Text, StatusBar, Platform, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import deviceSize from '../processes/deviceSize'
import { getArchived } from '../actions/learn'
import isJson from '../processes/isJson';

const ArchiveScreen = ({ navigation }) => {
    const windowHeight = deviceSize().deviceHeight;
    const dispatch = useDispatch()
    const archive = isJson(useSelector(state => state.archive)).archive
    const loading = isJson(useSelector(state => state.archive)).loading
    
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('light-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#054078');
            return () => {
            }
        }, [])       
    )

    useEffect(() => {
        dispatch(getArchived())
        return () => {}
    }, [])

    // useFocusEffect(
    //     React.useCallback(() => {
    //         dispatch(getArchived())
    //         return () => {
    //         }
    //     }, [])       
    // )
    
    const goto = (loc) => {
        navigation.navigate('ViewArchive', {subject: loc})
    }
    const renderView = ({item}) => {
        const col = item.category === 'Science and Technology' ? '#00e600' :
            item.category === 'Finance' ? '#e85f29' : item.category === 'Politics' ? 
            'orange' : item.category === 'Sports' ? '#ff1a66' : item.category === 'Socials' ?
            '#e6e600' : item.category === 'Entertainment' ? '#9999ff' : 
            item.category === 'History' ? '#033268' : item.category === 'Lifestyle' ? 'green' : 'e85f29'
        return (
            <TouchableWithoutFeedback onPress={() => goto(item.category)}>
                <View style={{...style.cover, backgroundColor: col, borderColor: col}}>
                    <View style={style.item}>
                        <Text style={{...style.text, color: '#fff' }}>{item.category}</Text>
                    </View>
                    <View style={style.num}>
                        <Text style={style.numText}>{item.value.length}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    const _keyExtractor = (item, index) => `${item.category}${index}`
    return(
        <Container style={{backgroundColor: "#054078"}}>
            <LinearGradient
                colors={['transparent', '#e1efef']}
                style={{...style.gradient, height: windowHeight,}}
            />
            <Header transparent style={style.header}>          
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <NativeIcon  name={Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'} />
                    </Button>
                </Left>
                <Body>
                    <Title>
                        My Archive
                    </Title>
                </Body>
                <Right>
                <NativeIcon type= 'Ionicons' name= 'md-archive' style={{color: '#fff', fontSize: 24}} />
                </Right>
            </Header>
            {loading ? 
                <View style={style.content}>
                    <ActivityIndicator size='small' color='blue' />
                </View>
                :
                archive.length ? 
                    <FlatList 
                        style={style.flatList}
                        contentContainerStyle = {{justifyContent:'center', alignItems: 'center'}}
                        data={archive}
                        renderItem={renderView}
                        keyExtractor={_keyExtractor}
                    />
                    : 
                    <View style={style.content}>
                        <Text>
                            No archived article
                        </Text>
                    </View>
            }
        </Container>
    )
}

const style = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    header: {
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cover: {
        width: '90%', 
        flexDirection: 'row',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#054078',
        alignSelf: 'center',
        paddingVertical: 7,
        borderRadius: 50,
    },
    flatList: {     
        flex: 1,
        marginTop: 20,
        // width: '100%',
    },
    item: {
        width: '85%',
        paddingLeft: 15,
    },
    num: {
        width: '15%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    text: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    numText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
})

export default ArchiveScreen