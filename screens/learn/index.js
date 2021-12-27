import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../../dan-components/header';
import Learn from './learn';

export default function LearnApp() {
  return (
      <View>
        <Header />
        <Learn />
      </View>
  );
}
const styles = StyleSheet.create({});
