import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useCallback } from 'react';
import {
  Animated, Dimensions, Image,
  StyleSheet, Text, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getWeeklyWinners } from '../actions/request';
import {
  loadingWeeklyWinners, winnersErrDis
} from '../actions/winners';
import isJson from '../processes/isJson';
import useCheckpoint from './useCheckpoint';

const deviceWidth = Dimensions.get("screen").width;

const WeeklyWinners = () => {
  const dispatch = useDispatch();
  const store = isJson(useSelector((state) => state.winners));


  const onWinnerSuccess = async () => {
    dispatch(getWeeklyWinners());
  };
  const onWinnerFailure = () => {
    dispatch(winnersErrDis('weekly'));
  };

  const loadWeeklyWins = async () => {
    const getResult = useCheckpoint(onWinnerFailure, onWinnerSuccess);
    await onWinnerSuccess();
  };


  const date = new Date()
  if (date.getDay() === 0 && date.getHours >= 18) {
    loadWeeklyWins()
  }


  const fadeAnim = useRef(new Animated.Value(0.2)).current;

  const animatedLoader = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    dispatch(loadingWeeklyWinners());
    animatedLoader()
    loadWeeklyWins();
  }, []);
  // console.log(store.weekly_winners, "<===rendered winners")


  useFocusEffect(
    useCallback(
      () => {
        let weeklyWins = setInterval(() => {
          loadWeeklyWins();
        }, 10000)
        return () => clearInterval(weeklyWins)
      },
      [],
    )
  );

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 33,
        borderBottomRightRadius: 33,
        ...styles.elevation,
      }}>
      <View style={[styles.card]}>
        <Text
          style={{
            ...styles.textColor,
            textAlign: 'center',
            bottom: 36,
            fontSize: 22,
          }}>{`Last week's Champions`}</Text>
        {store.loading_weekly_winners ? (
          <Animated.Image
            style={{
              opacity: fadeAnim,
              width: 150,
              height: 150,
              alignSelf: 'center',
            }}
            source={require('../img/winners_cup.png')}
          />
        ) : store.loading_weekly_err ? (
          <Text style={{ color: '#fff' }}>
            There was an error loading weekly winners, Check your internet
            connection and try again
          </Text>
        ) : store.weekly_winners.length > 1 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{
                  ...styles.winnerAvatar,
                  borderRadius: 35,
                  width: 70,
                  height: 70,
                }}
                source={require('../img/anonymous.jpg')}
              />
              <View style={{ ...styles.winnerBadge, top: -15 }}>
                <Text>3</Text>
              </View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  marginVertical: 7,
                }}>@{store.daily_winners[2]['user_id']}</Text>
              <Text style={styles.textColor}>{store.daily_winners[2]['score']} points</Text>
            </View> */}
            <View
              style={{ justifyContent: 'space-around', alignItems: 'center' }}>
              <Image
                style={{
                  ...styles.winnerAvatar,
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                }}
                source={require('../img/anonymous.jpg')}
              />
              <View
                style={{
                  ...styles.winnerBadge,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  top: -8,
                }}>
                <Text style={{ fontSize: 15 }}>1</Text>
              </View>

              <Text
                style={{
                  ...styles.textColor,
                  fontSize: 20,
                  marginVertical: 7,
                }}>@{store.weekly_winners[0]["user_id"]}</Text>
              <Text style={styles.textColor}>{store.weekly_winners[0]['score']} points</Text>
            </View>
            <View
              style={{ justifyContent: 'space-around', alignItems: 'center' }}>
              <Image
                style={{
                  ...styles.winnerAvatar,
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                }}
                source={require('../img/anonymous.jpg')}
              />
              <View
                style={{
                  ...styles.winnerBadge,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  top: -8,
                }}>
                <Text style={{ fontSize: 15 }}>2</Text>
              </View>

              <Text
                style={{
                  ...styles.textColor,
                  fontSize: 20,
                  marginVertical: 7,
                }}>@{store.weekly_winners[1]["user_id"]}</Text>
              <Text style={styles.textColor}>{store.weekly_winners[1]['score']} points</Text>
            </View>
          </View>
        ) : (<Image
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
          }}
          source={require('../img/winners_cup.png')}
        />)}
      </View>
    </View>
  );
};

export default WeeklyWinners;
const styles = StyleSheet.create({
  // Weekly Card
  winnerAvatar: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  winnerBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 35,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#054078',
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '92%',
    height: 250,
    marginVertical: 25,
  },
  elevation: {
    position: "absolute",
    width: deviceWidth,
    elevation: 15,
    backgroundColor: '#054078',
  },
  textColor: {
    color: 'white',
  },
});
