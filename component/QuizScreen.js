import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import { Container, Content, Toast } from 'native-base';
import React, { useEffect } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  ActivityIndicator,
  Dimensions, Image, ScrollView, StatusBar, Text, View
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { createdb, loadQuiz } from '../actions/quiz';
import { callStartGame } from '../actions/request';
import deviceSize from '../processes/deviceSize';
import isJson from '../processes/isJson';
import FocusAwareStatusBar from './FocusAwareStatusBar';

const ContainerView = ({ width, height, style, children }) => {
  if (width > height) {
    return<Content>{children}</Content>;
  }
  return <Container style={style}>{children}</Container>;
};

const AdaptiveContent = ({ width, height, style, children }) => {
  if (width > height) {
    return<View style={style}>{children}</View>;
  }
  return <ScrollView style={{...style, maxHeight: '50%'}}>{children}</ScrollView>;
};
const data = [
  { no: 1, text: 'Every correct answer attracts 3 marks' },
  { no: 2, text: 'Every wrong answer attracts -0.1' },
  { no: 3, text: 'You have the option to skip question up to 3 times' },
  { no: 4, text: 'Winners are selected every Sunday by 6pm' },
  { no: 5, text: 'Quiz Duration: 6 minutes 30 secs' },
];

const guidelines = () => (
  <>
          <Text style={style.head}>QUIZ GUIDELINES</Text>
          {data.map((item, i) => {
            return (
              <Text style={style.textContainer} key={`${item}${i}`}>
                <Text style={style.thick}>{item.no}.</Text>
                <Text style={style.info}>{item.text}</Text>
              </Text>
            );
          })}
  </>
    
    )
const deviceHeight = Dimensions.get("window").height;

const QuizScreen = ({ navigation }) => {
  // const {width, height} = useWindowDimensions()
  const dispatch = useDispatch();
  const windowWidth = deviceSize().deviceWidth;
  const windowHeight = deviceSize().deviceHeight;

  const points = isJson(useSelector((state) => state.user.user)).points;
  const loading = isJson(useSelector((state) => state.quiz)).loadingQuiz;
  const errStateGame = isJson(useSelector((state) => state.quiz)).startGameErr;

  const redirect = () => navigation.navigate('PlayQuiz');

  const playQuiz = async () => {
     const { isConnected, isInternetReachable } =
          await Network.getNetworkStateAsync();
        const airplane = await Network.isAirplaneModeEnabledAsync();
        if (airplane) {
          Toast.show({
            text: `Offline mode`,
            buttonText: 'CLOSE',
            type: 'danger'
          });
        } else if (!isConnected && !isInternetReachable){
          Toast.show({
            text: `Network error, please check your connection.`,
            buttonText: 'CLOSE',
            type: 'danger'
          });
        }
    dispatch(callStartGame(redirect));
  };

  const disable = () => { };

  const subscribe = () => navigation.navigate('Subscribe');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');

      if (loading) dispatch(loadQuiz(false));
    }, [])
  );

  useEffect(() => {
    createdb();
    return () => { };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (errStateGame !== null) {
        Toast.show({
          type: "danger",
          text: errStateGame,
          buttonText: 'CLOSE',
          textStyle: { fontSize: 14 },
        });
      }
    }, [errStateGame])
  );
  return (
    <ContainerView
      height={windowHeight}
      width={windowWidth}
      style={style.container}
    >
      <FocusAwareStatusBar barStyle='dark-content' backgroundColor='#fff' />

      <View
        style={[style.fore, { flex: windowHeight > windowWidth ? 0.20 : 0.5 }]}>
        <Image
          source={require('../img/book-champ.png')}
          style={style.foreImg}
        />
      </View>
      <View
        style={{
          ...style.secContainer,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
          flex: windowHeight > windowWidth ? 0.80 : 0.5,
        }}>
        <LinearGradient
          colors={['transparent', '#e1efef']}
          start={{ x: 0.1, y: 0.2 }}
          style={{ ...style.gradient, height: "100%" }}
        />
        {/* <View style={{ ...style.viewImg, marginTop: Constants.statusBarHeight }}>
             <Image source={require('../img/book-champ.png')} style={style.img} />
        </View> */}
        <AdaptiveContent width={windowWidth} height={ windowHeight} style={style.guide}>
          <Text style={style.head}>QUIZ GUIDELINES</Text>
          {data.map((item, i) => {
            return (
              <Text style={style.textContainer} key={`${item}${i}`}>
                <Text style={style.thick}>{item.no}.</Text>
                <Text style={style.info}>{item.text}</Text>
              </Text>
            );
          })}
        </AdaptiveContent>

          <View style={{ flex: 0.3, alignItems: 'center', width: '100%' }}>
          {points > 0 ? (
            <TouchableHighlight onPress={loading ? disable : playQuiz}>
              <View style={style.but}>
                {loading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text style={{ color: '#3480eb', fontWeight: 'bold' }}>
                    LET'S DO THIS
                  </Text>
                )}
              </View>
            </TouchableHighlight>
          ) : (
            <>
              <Text style={style.subText}>
                Sorry, you do not have enough cilver for the quiz, please subscribe.
              </Text>
              <TouchableHighlight onPress={subscribe}>
                <View style={style.but}>
                  <Text style={{ color: '#3480eb', fontWeight: 'bold' }}>
                    SUBSCRIBE
                  </Text>
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>
    </ContainerView>
  );
};

const style = EStyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  secContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#054078',
  },
  fore: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // marginTop: Constants.statusBarHeight,
  },
  foreImg: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  viewImg: {
    marginBottom: 50,
    alignItems: 'center',
  },
  img: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: -50,
  },
  guide: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '80%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: "4rem"  ,
    marginBottom: 25,
  },
  head: {
    alignSelf: 'center',
    paddingBottom: 6,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textContainer: {
    paddingBottom: 8,
  },
  thick: {
    fontWeight: '700',
    marginRight: 10,
  },
  info: {
    fontSize: 16,
    marginLeft: 10,
  },
  but: {
    backgroundColor: '#fff',
    width: 180,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: 3,
  },
  subText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 27,
    padding: 15,
  },
});

export default QuizScreen;
