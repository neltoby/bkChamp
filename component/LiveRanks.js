/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Left,
  Text,
  Body,
  Right,
  List,
  ListItem,
  Thumbnail,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import isJson from '../processes/isJson';
import { getLiveRank } from '../actions/request';
import errorHandler from '../processes/errorHandler';
import deviceSize from '../processes/deviceSize';

const ShowNotification = ({ text }) => {
  const windowWidth = deviceSize().deviceWidth;
  const windowHeight = deviceSize().deviceHeight;
  return (
    <View style={[style.cover]}>
      <Text> {text} </Text>
    </View>
  );
};

const getData = (props) => (props.data !== undefined ? props.data : []);
export default function LiveRanks(props) {
  const dispatch = useDispatch();
  const rank = isJson(useSelector((state) => state).rank);

  const onClick = () => {};

  useEffect(() => {
    dispatch(getLiveRank({ reload: true, errorHandler }));
  }, []);

  return (
    <>
      {rank.reloadPage
        ? (
          <ShowNotification
            text="Loading the ranks of winners"
          />
        )
        : rank.liveRank.length ? (
          <List>
            {rank.liveRank.map((item, i) => (
              <ListItem avatar key={i} onClick={() => onClick(item.id)}>
                <Left>
                  <Thumbnail source={{ uri: item.img }} />
                </Left>
                <Body>
                  <Text>{item.user_id}</Text>
                  <Text note numberOfLines={1}>{item.score}</Text>
                </Body>
                <Right>
                  <Text note>{item?.time || 'Today'}</Text>
                </Right>
              </ListItem>
            ))}
          </List>
        )
          : (
            <ShowNotification
              text="You do not have any ranking yet"
            />
          )}
    </>
  );
}

const style = StyleSheet.create({
  reload: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    marginHorizontal: 20,
  },
  cover: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
