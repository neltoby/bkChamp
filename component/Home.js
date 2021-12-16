import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NewLearn from '../screens/learn/index';
import About from './About';
import ArchiveScreen from './ArchiveScreen';
import FaqScreen from './FaqScreen';
import LearnScreen from './LearnScreen';
import NotificationScreen from './NotificationScreen';
import { MemoizedPlayQuizScreen } from './PlayQuizScreen';
import PrivacyPolicy from './PrivacyPolicy';
import QuizScreen from './QuizScreen';
import RankingScreen from './RankingScreen';
import ReadPost from './ReadPost';
import ReviewQuestion from './ReviewQuestion';
import Search from './Search';
import SearchArchive from './SearchArchive';
import SelectHome from './SelectHome';
import SettingScreen from './SettingScreen';
import Subject from './Subject';
import Subscribe from './Subscribe';
import TransSummary from './TransSummary';
import ViewArchive from './ViewArchive';

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
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="PlayQuiz" component={MemoizedPlayQuizScreen} />
      <Stack.Screen name="Subject" component={Subject} />
      <Stack.Screen name="LearnScreen" component={NewLearn} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="ReadPost" component={ReadPost} />
      <Stack.Screen name="TransSummary" component={TransSummary} />
      <Stack.Screen name="SearchArchive" component={SearchArchive} />
      <Stack.Screen name="Privacy" component={PrivacyPolicy} />
      <Stack.Screen name="ViewArchive" component={ViewArchive} />
      <Stack.Screen name="ReviewQuestion" component={ReviewQuestion} />
    </Stack.Navigator>
  );
};
// ReadPost
export default Home;
