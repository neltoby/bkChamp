import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getDailyWinners } from '../actions/request';
import { loadingWinners, setDailyWinners } from '../actions/winners';
import isJson from '../processes/isJson';

const HEADER_WIDTH = Dimensions.get('window').width

export default function DailyWins() {

  const data = [...Array(30).keys()].map((key) => ({
    id: key.toString(),
    data: 'Item ' + key.toString(),
  }));
  
  const winnersStore = isJson(useSelector((state) => state.winners));
  const userStore = isJson(useSelector((state) => state.user));
  const daily_winners = winnersStore.daily_winners;

  const dispatch = useDispatch();
  const refContainer = useRef(null);

  const onSuccess = () => {
    console.log('onsuccess was called');
    dispatch(getDailyWinners());
  };

  const getWinners = () => {
    dispatch(loadingWinners());
    // dispatch(setDailyWinners([]));
    onSuccess();
  };

  useEffect(() => {
    getWinners();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const intervalId = setInterval(() => {
        getWinners();
      }, 10000);
      return () => clearInterval(intervalId);
    }, [])
  );


  const renderUser = (user, index) => {
    let rankBgColor =
      index % 2 === 0
        ? '#CCCCFF'
        : '#fff'

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.rank}>
          <Card style={{ paddingVertical: 10, backgroundColor: rankBgColor }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '50%',
                }}>
                <Text style={{ marginLeft: 12 }}>{index + 1}</Text>
                {/*<Avatar rounded title={user.user_[0]} />*/}
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                  {user.user_id}
                </Text>
              </View>
              <Text style={{ marginRight: 12 }}>{user.score} pts</Text>
            </View>
          </Card>
        </View>
      </View>
    );
  }

  return (
    
      <FlatList
        data={daily_winners}
        keyExtractor={(data) => data.id.toString()}
        renderItem={({ item, index }) => renderUser(item, index)}
      />
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#b0e0e6',
    width: HEADER_WIDTH,
    height: 250,
  },

  rank: {
    marginVertical: 12,
    width: HEADER_WIDTH * 0.9,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});