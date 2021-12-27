import React from 'react';
import CustomSideBar from './CustomSideBar';
import SelectHome from './SelectHome';
import Subscribe from './Subscribe';
import NotificationScreen from './NotificationScreen';
import FaqScreen from './FaqScreen';
import SettingScreen from './SettingScreen';
import LearnScreen from './LearnScreen';
import QuizScreen from './QuizScreen';
import Search from './Search';
import About from './About';
import ArchiveScreen from './ArchiveScreen';
import RankingScreen from './RankingScreen';
import ReadPost from './ReadPost';
import ViewArchive from './ViewArchive';
import SearchArchive from './SearchArchive';
import { MemoizedPlayQuizScreen } from './PlayQuizScreen';
import ReviewQuestion from './ReviewQuestion';
import Subject from './Subject';
import TransSummary from './TransSummary';
import NewLearn from '../screens/learn/index';
import PrivacyPolicy from './PrivacyPolicy';
import { createStackNavigator } from '@react-navigation/stack';

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
