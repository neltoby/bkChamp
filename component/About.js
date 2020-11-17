import React from 'react'
import Constants from 'expo-constants'
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'
import { Container, Button, Icon } from 'native-base';

// const text= 

export default function About({navigation}) {
    const { navigate } = navigation
    return (
        <Container style={style.container}>
            <View style={style.header}>
                <ImageBackground source={require('../assets/faqImage2.jpg')} style={style.image}>
                    <View style={style.direction}>
                        <Button transparent onPress={() => navigate('SelectHome')}>
                            <Icon  name={Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'} style={{color: '#fff'}} />
                        </Button>
                    </View>
                    <View style={style.faq}>
                        <Text style={style.faqText}>
                            About Bookchamp
                        </Text>
                    </View>
                    <View style={style.viewImage}>
                        {/* <View style */}
                        <Image source={require('../img/book-champ.png')} style={style.imageAbsolute}/>
                    </View>
                </ImageBackground>
            </View>
            <ScrollView style={style.about}>
                <Text style={style.abtText}>
                    <Text style={style.bold}>“Knowledge is like a precious Ornament, you decide how you want to be adorned.”</Text> <Text>– Joshua Akpovino (CEO – Book Champ)
                    Book Champ Nigeria Limited is a tech start-up domiciled in the city of Lagos, Nigeria. It owns Book Champ – an educational Social Networking Platform. Book Champ is an educational platform which aims at helping its audience to be diverse in knowledge. The platform provides its audience with rich and educative contents on ten (10) categories of knowledge, viz; History, Science and Technology, Sports, Geography, Finance, Socials, Politics, Entertainment, Health and Lifestyle. As the platform grows, more categories will be added for a richer user experience.
                    Our contents contain a minimum of three (3) words (that are not commonly used in everyday communication) and an idiomatic expression. This is to help improve the written and spoken English of our audience; our audience can get to see the meaning of those words in the context they were used with just a click.
                    More on, Book Champ has a Quiz section where users can test themselves on general knowledge. Now, the interesting part – cash prizes are given to users with the best performance and this happens daily. The best three (3) users are awarded cash prizes ranging from #5,000 - #15,000. The idea behind this is creating financial incentives that will encourage people to get back to the reading culture.
                    The primary target of the platform is the youthful population. The overarching goal of Book Champ is preparing our youths for Leadership. We believe that </Text><Text style={style.bold}>‘Leaders of tomorrow should be readers of today’.</Text><Text> Our monetary incentives will be increased over time. Also, contents that major on Leadership shall be incorporated into the platform with time.
                    Book Champ will experience a progressive form of remodeling as we work towards becoming the world’s biggest educational community. Our Official Partners are:</Text>
                </Text>
            </ScrollView>
        </Container>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    bold: {
        fontWeight: 'bold'
    }, 
    header: {
        flex: 0.3,
        zIndex: 10,
    },
    direction: {
        marginTop: Constants.statusBarHeight,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    faq: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    faqText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#eee'
    },
    viewImage: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: -60,
        left: 0,
        width: '100%',
    },
    imageAbsolute: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff'
    },
    about: {
        flex: 0.7,
        marginTop: 70, 
        paddingHorizontal: 10,
    }
})
