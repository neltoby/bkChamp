import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../dan-components/new_header';
import { MemoizedLearn } from './learn';

export default function LearnApp() {
  return (
    <View>
      <Header />
      <MemoizedLearn />
    </View>
  );
}
const styles = StyleSheet.create({});
