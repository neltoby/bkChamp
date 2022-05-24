import { useFocusEffect } from '@react-navigation/native';
import { Container, Content } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {useWindowDimensions, Dimensions, FlatList, StatusBar, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveRanks, getWeeklyWinners } from '../actions/request';
import { loadingDailyWinners } from '../actions/winners';
import isJson from '../processes/isJson';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import WeeklyWinners from './WeeklyWins';


const deviceWidth = Dimensions.get('screen').width;

const RankingScreen = () => {
  const {height, width } = useWindowDimensions()
  const [refreshing, setRefreshing] = useState(false)
  const winnersStore = isJson(useSelector((state) => state.winners));
  const userStore = isJson(useSelector((state) => state.user));
  const daily_winners = winnersStore.daily_winners;
  const winners = winnersStore.winners;
  const current_user = userStore.user
  const dispatch = useDispatch();
  const refContainer = useRef(null);

  const onSuccess = async () => {
    null
    setRefreshing(!refreshing)
    dispatch(getLiveRanks());
    setRefreshing(!refreshing)
  };


  const liveRanks = async () => {
    await onSuccess();
  };


  useEffect(() => {
    dispatch(loadingDailyWinners());
    liveRanks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      getWeeklyWinners()
      liveRanks();
      const intervalId = setInterval(() => {
        liveRanks();
      }, 10000);
      return () => clearInterval(intervalId);
    }, [])
  );
  null
  const renderUsers = (user, index) => {
    const rankBgColor = index % 2 === 0 ? '#CCCCFF' : '#fff';
    const user_color = user.user_id === current_user.username ? "#00ff00" : "#000"
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', height, width }}>
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
                  style={{ marginLeft: 27, fontWeight: 'bold', fontSize: 17, color: user_color }}>
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
    <Container>
      <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />

      <WeeklyWinners />
      <Content>
        <View style={{ width: '95%', alignSelf: 'center', marginTop: 310 }}>
          <Text style={{ fontSize: 20 }}>{`This week's Leaderboard`}</Text>
          <Text>
            {`Earn as much points in the quiz and rise to the top of this week's Leaderboard.`}
          </Text>
        </View>
        {daily_winners.length ? (
          <FlatList
            data={daily_winners}
            keyExtractor={(data) => data.id.toString()}
            renderItem={({ item, index }) => renderUsers(item, index)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={liveRanks} />
            }
          />
        ) : (<ActivityIndicator color="blue" size="large" />)}
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
