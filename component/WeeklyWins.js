import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import useCheckpoint from './useCheckpoint';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import isJson from '../processes/isJson';
import {
  loadingWeeklyWinners,
  getWeeklyWinners,
  winnersErrDis,
  setWeeklyWinners,
  loadingWeeklyWinnersStop,
} from '../actions/winners';

const WeeklyWinners = () => {
  const dispatch = useDispatch();
  const store = isJson(useSelector((state) => state.winners));

  const onWinnerSuccess = async () => {
    setWeeklyWinners([]);
    await dispatch(loadingWeeklyWinners());
    await dispatch(getWeeklyWinners());
  };
  const onWinnerFailure = () => {
    dispatch(winnersErrDis('weekly'));
  };

  const loadWeeklyWins = async () => {
    const getResult = useCheckpoint(onWinnerFailure, onWinnerSuccess);
    await getResult();
  };
  useEffect(() => {
    loadWeeklyWins();
  }, [loadWeeklyWins]);

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
    animatedLoader();
    setTimeout(() => {
      dispatch(loadingWeeklyWinnersStop())
    }, 10000)
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#054078',
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
              width: 100,
              height: 100,
              alignSelf: 'center',
            }}
            source={require('../img/winners_cup.png')}
          />
        ) : store.loading_weekly_err ? (
          <Text style={{ color: '#fff' }}>
            There was an error loading weekly winners, Check your internet
            connection and try again
          </Text>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                }}>{`@DannyEll`}</Text>
              <Text style={styles.textColor}>129 points</Text>
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
                <Text style={{ fontSize: 15 }}>1</Text>
              </View>

              <Text
                style={{
                  ...styles.textColor,
                  fontSize: 20,
                  marginVertical: 7,
                }}>{`@Thelma`}</Text>
              <Text style={styles.textColor}>129 points</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                <Text>2</Text>
              </View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  marginVertical: 7,
                }}>{`@JoshAOC`}</Text>
              <Text style={styles.textColor}>129 points</Text>
            </View>
          </View>
        )}
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
    borderRadius: 6,
    elevation: 15,
    shadowColor: '#333',
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
  },
  textColor: {
    color: 'white',
  },
});
