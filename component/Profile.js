import React, { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { logoutWarning } from '../actions/login';
import Image from './Image';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image as RNImage,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import Constants from 'expo-constants'
import {useFocusEffect} from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import isJson from '../processes/isJson';

const Profile = (props) => {
  const deviceWidth = Dimensions.get('screen').width;
  const { navigation } = props;
  const dispatch = useDispatch();
  const points = isJson(useSelector((state) => state.user.user)).points;
  const userImg = useSelector((state) => state.user).user.image;
  const storePreview = isJson(useSelector((state) => state.learn)).preview;
  const preview = useMemo(() => {
    uri: storePreview;
  }, [storePreview]);
  const uri = userImg;
  const username = isJson(useSelector((state) => state.user)).user.username;

   useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  const logout = () => {
    dispatch(logoutWarning(true));
  };

  let firstData = [
    {
      text: 'Subscribe',
      onPress: () => navigation.navigate('Subscribe'),
    },
    {
      text: 'Settings',
      onPress: () => navigation.navigate('Setting'),
    },
    {
      text: 'FAQ(s)',
      onPress: () => navigation.navigate('Faq'),
    },
    {
      text: 'About Us',
      onPress: () => navigation.navigate('About'),
    },
    {
      text: 'Logout',
      onPress: () => logout(),
    },
  ];
  return (
    <ScrollView>
      <SafeAreaView style={style.container}>
        <View style={style.imgContainer}>
          <LinearGradient
            colors={['transparent', '#fff']}
            style={{ ...style.gradient, height: 150 }}
          />
          <View style={style.imgView}>
            {userImg === null || userImg === undefined ? (
              <RNImage
                source={require('../img/anonymous.jpg')}
                style={style.img}
              />
            ) : (
              <Image {...{ preview, uri }} style={style.img} />
            )}
          </View>
          <View style={style.detailView}>
            <Text numberOfLines={1} style={style.name}>
              @{username}
            </Text>
            <View style={style.bond}>
              <Icon
                type="font-awesome"
                name="circle"
                color="#FFA500"
                size={16}
              />
              <Text style={{ ...style.mode, fontSize: 18 }}> starter</Text>
            </View>
            <Text style={{ ...style.mode, paddingLeft: 10 }}>
              {points} units
            </Text>
          </View>
        </View>
    
        <View style={{flex:0.65, backgroundColor: "#fff", paddingTop: 24}}>
  {firstData.map((data, i) => {
          return (
            <TouchableOpacity
              key={`${data}${i}`}
              onPress={data.onPress}
              style={{ width: deviceWidth, paddingVertical: 13, paddingHorizontal: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  
                }}>
                <Text style={{ fontSize: 18 }}>{data.text}</Text>
                <Icon type={'font-awesome'} name={'chevron-right'} size={15}/>
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  imgContainer: {
    paddingTop: 13,
    flex: 0.35,
    height: 150,
    backgroundColor: '#054078',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  imgView: {
    width: '50%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  mode: {
    color: '#fff',
  },
  bond: {
    paddingVertical: 7,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailView: {
    width: '50%',
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default Profile;