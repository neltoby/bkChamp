import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { Container, Header, Button, Right } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import RankingScreen from './RankingScreen';
import QuizScreen from './QuizScreen';
import LearnScreen from '../screens/learn';
// import SettingsScreen from './SettingScreen'
import Profile from './Profile';
import deviceSize from '../processes/deviceSize';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKey } from '../processes/keyStore';
import { notLogin, logoutWarning } from '../actions/login';
import { loginValue } from '../processes/lock';
import { db } from '../processes/db';

const sql = 'DROP TABLE IF EXISTS articles';
const sqli = 'DROP TABLE IF EXISTS archive';
const sqlii = 'DROP TABLE IF EXISTS user';
const sqlx = 'DROP TABLE IF EXISTS archiveunsent';
const sqlix = 'DROP TABLE IF EXISTS unsent';
const sqlxi = 'DROP TABLE IF EXISTS search';
const sqlxii = 'DROP TABLE IF EXISTS endquestions';

const SelectHome = ({ navigation }) => {
  const windowHeight = deviceSize().deviceHeight;
  const [back, setBack] = useState(false);
  const dispatch = useDispatch();
  const warning = useSelector((state) => state.login).logoutWarning;

  const setLogout = async () => {
    dispatch(logoutWarning(false));
    await deleteKey(loginValue);
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          null,
          (txO, { rows }) => {
            txO.executeSql(
              sqli,
              null,
              (txOb, { rows }) => {
                txOb.executeSql(
                  sqlii,
                  null,
                  (txObx, { rows }) => {
                    txObx.executeSql(
                      sqlx,
                      null,
                      (tx, { rows }) => {
                        tx.executeSql(
                          sqlix,
                          null,
                          (txO, { rows }) => {
                            txO.executeSql(
                              sqlxi,
                              null,
                              (txO, { rows }) => {
                                txO.executeSql(
                                  sqlxii,
                                  null,
                                  (txOb, { rows }) => {
                                    console.log('successfully dropped table');
                                    dispatch(notLogin());
                                    navigation.navigate('Login');
                                  },
                                  (err) =>
                                    console.log(err, 'failed dropped endpoints')
                                );
                              },
                              (err) => console.log('failed search dropped')
                            );
                          },
                          (err) => console.log('failed unsent drooped')
                        );
                      },
                      (err) => console.log('failed archiveunsent dropped')
                    );
                  },
                  (err) => console.log('failed dropped user')
                );
              },
              (err) => console.log('failed dropped archive')
            );
          },
          (err) => console.log(err, 'failed err dropping table')
        );
      },
      (err) => console.log(err, 'failed transxn'),
      () => console.log('failed successful transxn')
    );
  };


  const exitApp = () => {
    setBack(false);
    setTimeout(() => {
      BackHandler.exitApp();
    }, 100);
  };

  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        shifting={true}
        activeColor="#054078"
        inactiveColor="#b0b6e3"
        barStyle={{ backgroundColor: 'whitesmoke' }}>
        <Tab.Screen
          name="Ranking"
          component={RankingScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="trophy" color={color} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="gamepad" color={color} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="Learn"
          component={LearnScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="book" color={color} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="user-circle" color={color} type="font-awesome" />
            ),
          }}
        />
      </Tab.Navigator>
      <Modal
        isVisible={warning}
        animationIn={'slideInLeft'}
        animationOut={'slideOutRight'}>
        <View style={{ backgroundColor: '#fff' }}>
          <Text>Are you sure you want to log out?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => dispatch(logoutWarning(false))}>
              <Text>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setLogout()}>
              <Text>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*   <Modal
                useNativeDriver={true}
                visible={warning}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={event => dispatch(logoutWarning(false))}
                onHardwareBackPress={() => dispatch(logoutWarning(false))}
                modalTitle={<ModalTitle title='Log out?' />}
                footer={
                    <ModalFooter>
                      <ModalButton
                        text="No"
                        onPress={() => dispatch(logoutWarning(false))}
                      />
                      <ModalButton
                        text="Yes"
                        onPress={() => setLogout()}
                      />
                    </ModalFooter>
                  }
            >
                <ModalContent>
                    <View style={style.showView}>
                        <Text style={style.warning}>
                            Are you sure you want to log out?
                        </Text>
                    </View>
                </ModalContent>
            </Modal>
            <Modal
                useNativeDriver={true}
                visible={back}
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={event => setBack(false)}
                onHardwareBackPress={() => setBack(false)}
                modalTitle={<ModalTitle title='Exit?' />}
                footer={
                    <ModalFooter>
                      <ModalButton
                        text="No"
                        onPress={() => setBack(false)}
                      />
                      <ModalButton
                        text="Yes"
                        onPress={() => exitApp()}
                      />
                    </ModalFooter>
                  }
            >
                <ModalContent>
                    <View style={style.showView}>
                        <Text style={style.warning}>
                            Are you sure you want to exit?
                        </Text>
                    </View>
                </ModalContent>
            </Modal> */}
    </>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
});

export default SelectHome;
