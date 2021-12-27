import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Container, Header, Content } from 'native-base';
import { Avatar } from 'react-native-elements';
import { Card } from 'react-native-paper';
import WeeklyWinners from './WeeklyWins';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getDailyWinners, getWeeklyWinners } from '../actions/request';
import { loadingDailyWinners, setDailyWinners } from '../actions/winners';
import isJson from '../processes/isJson';

const deviceWidth = Dimensions.get('screen').width;

const RankingScreen = () => {
  const winnersStore = isJson(useSelector((state) => state.winners));
  const userStore = isJson(useSelector((state) => state.user));
  const daily_winners = winnersStore.daily_winners;
  const winners = winnersStore.winners;

  const dispatch = useDispatch();
  const refContainer = useRef(null);

  const onSuccess = async () => {
    console.log('onsuccess was called');
    await dispatch(getDailyWinners());
  };

  const getWinners = async () => {
    await onSuccess();
  };

  // const [dueTime, setDueTime] = useState({
  //   days: '',
  //   hours: '',
  //   mins: '',
  //   secs: '',
  // });
  // const dueDate = new Date('Nov 7, 2021 18:10:00').getTime();

  // useEffect(() => {
  //   const clear = setInterval(() => {
  //     const today = new Date();
  //     const now = new Date().getTime();

  //     const timeleft = dueDate - now;

  //     // Calculating the days, hours, minutes and seconds left
  //     var days = Math.floor(timeleft / (1000 * 60 * 60 * 24)) + 'days';
  //     var hours =
  //       Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + 'h';
  //     setDueTime({ days, hours });
  //     if (timeleft < 0) {
  //       setDueTime({ days: '', hours: '', min: '', sec: '' });
  //       dueDate.setDate(today.getDate + 7);
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(clear);
  //   };
  // }, []);

  useEffect(() => {
    dispatch(loadingDailyWinners());
    getWinners();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');

      const intervalId = setInterval(() => {
        getWinners();
      }, 10000);
      return () => clearInterval(intervalId);
    }, [])
  );

  const renderUsers = (user, index) => {
    let rankBgColor = index % 2 === 0 ? '#CCCCFF' : '#fff';

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={styles.rank}>
          <Card style={{ paddingVertical: 15, backgroundColor: rankBgColor }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '50%',
                }}>
                <Text style={{ marginLeft: 15 }}>{index + 1}</Text>
                {/*<Avatar rounded title={user.user_[0]} />*/}
                <Text
                  style={{ marginLeft: 27, fontWeight: 'bold', fontSize: 17 }}>
                  {user.user_id}
                </Text>
              </View>
              <Text style={{ marginRight: 12 }}>{user.score} pts</Text>
            </View>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <Container style={styles.ranks}>
      <WeeklyWinners />
      <Content>
        <ScrollView style={{marginTop: -13}}>
          <View style={{ width: '95%', alignSelf: 'center', marginTop: 20 , marginBottom: 15}}>
            <Text style={{ fontSize: 20 }}>{`This week's Leaderboard`}</Text>
            <Text>
              {`Earn as much points in the quiz and rise to the top of this week's Leaderboard.`}
            </Text>
          </View>
          <FlatList
            data={daily_winners}
            keyExtractor={(data) => data.id.toString()}
            renderItem={({ item, index }) => renderUsers(item, index)}
          />
        </ScrollView>
      </Content>
    </Container>
  );
};

export default RankingScreen;

const styles = StyleSheet.create({
  rank: {
    width: deviceWidth,
    borderRadius: 19,
  },
});
/* 
box-shadow: 0 15px 25px rgba(0,0,0,0.12),0 5px 10px rgba(0,0,0,0.05);
*/
