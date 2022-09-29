import Constants from 'expo-constants';
import { Button, Container, Icon } from 'native-base';
import React from 'react';
import {
  Image, ImageBackground, Platform, StyleSheet,
  Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// const text=

export default function About({ navigation }) {
  const { navigate } = navigation;
  return (
    <Container style={style.container}>
      <View style={style.header}>
        <ImageBackground
          source={require('../assets/faqImage2.jpg')}
          style={style.image}>
          <View style={style.direction}>
            <Button transparent onPress={() => navigate('SelectHome')}>
              <Icon
                name={
                  Platform.OS == 'ios' ? 'chevron-back-outline' : 'arrow-back'
                }
                style={{ color: '#fff' }}
              />
            </Button>
          </View>
          <View style={style.faq}>
            <Text style={style.faqText}>About Bookchamp</Text>
          </View>
          <View style={style.viewImage}>
            {/* <View style */}
            <Image
              source={require('../img/book-champ.png')}
              style={style.imageAbsolute}
            />
          </View>
        </ImageBackground>
      </View>
      <ScrollView style={style.about}>
        <Text style={style.abtText}>
          <Text style={style.bold}>
            {` 
            “Knowledge is like a precious ornament, you decide how you want to be adorned.” – Joshua Akpovino (Founder, Book Champ).
            `}</Text>
          <Text>
            {' '}
            Book Champ is the brainchild of JVEC Solutions (a tech start-up in the city of Lagos, Nigeria).

            Book Champ is an educational platform that aims at helping its users to be diverse in knowledge.
          </Text>
          <Text>
            Book Champ has a Quiz section where users can test themselves on general knowledge. {`
           
`}We give cash rewards to our best two (2) users, this happens once weekly. {`

`}The user with the best score wins #5,000 and the runner-up wins #2,000  {`

`}The idea behind this is to create financial incentives that will encourage people to get back to the reading culture. {`

`}Book Champ will experience a progressive form of remodeling as we work towards becoming the world's biggest educational community.
          </Text>
        </Text>
      </ScrollView>
    </Container>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  bold: {
    fontWeight: 'bold',
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
    resizeMode: 'cover',
  },
  faq: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#eee',
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
    borderColor: '#fff',
  },
  about: {
    flex: 0.7,
    marginTop: 70,
    paddingHorizontal: 10,
  },
  abtText: {
    fontSize: 16
  }
});
