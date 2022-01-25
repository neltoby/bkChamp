import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import About from './About';
import FaqScreen from './FaqScreen';
import NotificationScreen from './NotificationScreen';
import { MemoizedPlayQuizScreen } from './PlayQuizScreen';
import PrivacyPolicy from './PrivacyPolicy';
import QuizScreen from './QuizScreen';
import RankingScreen from './RankingScreen';
import ReviewQuestion from './ReviewQuestion';
import SelectHome from './SelectHome';
import SettingScreen from './SettingScreen';
import Subscribe from './Subscribe';
import TransSummary from './TransSummary';

const Stack = createStackNavigator();

const Home = () => {
  return (
    <Stack.Navigator
      initialRouteName="SelectHome"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="SelectHome" component={SelectHome} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Faq" component={FaqScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Subscribe" component={Subscribe} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="PlayQuiz" component={MemoizedPlayQuizScreen} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="TransSummary" component={TransSummary} />
      <Stack.Screen name="Privacy" component={PrivacyPolicy} />
      <Stack.Screen name="ReviewQuestion" component={ReviewQuestion} />
    </Stack.Navigator>
  );
};
// ReadPost
export default Home;
