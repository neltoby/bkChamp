import React from 'react';
import Constants from 'expo-constants';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, Button, Icon } from 'native-base';

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
“Knowledge is like a precious ornament, you decide how you want to be adorned.” – Joshua Akpovino (Founder, Book Champ).{`

`}</Text>
          <Text>
Book Champ is the brainchild of JVEC Solutions (a tech start-up in the city of Lagos, Nigeria). Book Champ is an educational platform that aims at helping its users to be diverse in knowledge. {`
           
`}The platform provides its audience with rich and educative content on eleven (11) categories of knowledge, viz; History, Science, Technology, Sports, Geography, Finance, Socials, Politics, Entertainment, Health, and Lifestyle. As the platform grows, more categories will be added for a richer user experience. {`

`}Our contents contain a minimum of two (2) words (that are not commonly used in everyday communication) and an idiomatic expression or a phrasal verb. This is to help improve the written and spoken English of our audience; our users can get to see the meaning of these words in the context they were used with just a click. These words can also be saved for future reference. {`

`}More on, Book Champ has a Quiz section where users can test themselves on general knowledge. Now, the interesting part – we give cash rewards to our best two (2) users, this happens once weekly. The user with the best score is given #7,000 and the runner-up is gifted #3,000. The idea behind this is to create financial incentives that will encourage people to get back to the reading culture. {`

`}On Book Champ, there are two (2) modes of learning users can choose from - the free and the paid. Our educational contents are free for users but our quiz platform is not. Users will be required to buy a subscription plan to gain access to our quiz section. Subscription plans start from as little as #100. {`

`}The primary target of the platform is the youthful population. One of the objectives of Book Champ is preparing the youths for Leadership; we believe that{' '}
          </Text>
          <Text style={style.bold}>
            ‘Great Leaders are great readers’.
          </Text>
          <Text>
            {' '}
             Meaningful change must begin from the mind, hence, we shall create highly engaging contents that would raise the overall productivity of the youths. Also, content that majors in Leadership shall be incorporated into the platform with time. As the platform grows, we shall create content for other age brackets too. {`
             
`}When we talk about ‘Leadership,’ we are not just referring to Political leadership. We believe that leadership begins from the basic unit of every society – the family. Leadership is a fundamental human need and everyone born into this world is a potential leader. Book Champ seeks to raise the next generation of leaders in various industries and human endeavours. {`

`}Book Champ will experience a progressive form of remodeling as we work towards becoming the world’s biggest educational hub. Book Champ is powered by JVEC Solutions (First-class ICT Consultants).
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
