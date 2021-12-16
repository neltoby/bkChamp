import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Header from '../../dan-components/new_header';
import { MemoizedLearn } from './learn';


export default function LearnApp() {
  const deviceHeight = Dimensions.get("screen").height
  return (
    <View style={{ flex: 1, height: deviceHeight, backgroundColor: '#fff' }}>
      <Header />
      <MemoizedLearn />
    </View>
  );
}
const styles = StyleSheet.create({});
