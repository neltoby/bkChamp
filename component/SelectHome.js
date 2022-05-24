import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  BackHandler, StyleSheet, Image
} from 'react-native';
// import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutWarning, notLogin } from '../actions/login';
import { db } from '../processes/db';
import deviceSize from '../processes/deviceSize';
import { deleteKey } from '../processes/keyStore';
import { loginValue } from '../processes/lock';
import CustomModal from './CustomModal';
// import SettingsScreen from './SettingScreen'
import Profile from './Profile';
import QuizScreen from './QuizScreen';
import RankingScreen from './RankingScreen';

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

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        setBack(true)
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [])
  )

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
                                    null
                                    dispatch(notLogin());
                                    navigation.navigate('Login');
                                  },
                                  (err) =>
                                    null
                                );
                              },
                              (err) => null
                            );
                          },
                          (err) => null
                        );
                      },
                      (err) => null
                    );
                  },
                  (err) => null
                );
              },
              (err) => null
            );
          },
          (err) => null
        );
      },
      (err) => null
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
          activeColor: "#054078",
          inactiveColor: "#CCCCFF",
          headerShown: false,
        }}
        shifting={true}
        barStyle={{ backgroundColor: '#fff' }}>
        <Tab.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            tabBarIcon: ({ color }) => (
              // <Icon name="game-controller" type="ionicon" color={color} />
              <Image style={{ width: 25, height: 25, }} source={require('../assets/game-control.png')} />
            ),
          }}
        />
        <Tab.Screen
          name="Ranking"
          component={RankingScreen}
          options={{
            tabBarIcon: ({ color }) => (
              // <Icon name="podium" type="ionicon" color={color} />
              <Image style={{ width: 25, height: 25, }} source={require('../assets/rank.png')} />

            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              // <Icon name="person-circle" type="ionicon" color={color} />
              <Image style={{ width: 25, height: 25, }} source={require('../assets/user.png')} />
            ),
          }}
        />
      </Tab.Navigator>
      <CustomModal
        visible={warning}
        title={"Are you sure?"}
        options={["No", "Yes"]}
        close={() => dispatch(logoutWarning(false))}
        confirm={() => setLogout()} />
      <CustomModal
        visible={back}
        title={"Exit App?"}
        options={["No", "Yes"]}
        close={() => setBack(false)}
        confirm={() => exitApp()}
      />
      {/*   
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
    justifyContent: "space-between"
  },
});

export default SelectHome;

