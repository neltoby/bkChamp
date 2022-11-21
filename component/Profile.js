import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useEffect, useState } from 'react';

import {
  Dimensions, Image as RNImage, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { logoutWarning } from '../actions/login';
import isJson from '../processes/isJson';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import Image from './Image';

const Profile = (props) => {
  const [headerDisplay, setHeaderDisplay] = useState("flex")
  const deviceWidth = Dimensions.get('screen').width;
  const deviceHeight = Dimensions.get('screen').height;
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

  useEffect(() => {
    const es = Dimensions.addEventListener('change', ({window:{width,height}})=>{
      if (width > height) {
        setHeaderDisplay("none")
      } else {
        setHeaderDisplay("flex")
      }
    })
     return () => es && es.remove()
  }, [])
  

  const logout = () => {
    dispatch(logoutWarning(true));
  };

  let firstData = [
    {
      text: 'Subscribe',
      onPress: () => navigation.navigate('Subscribe'),
      icon: (<RNImage style={{ width: 20, height: 20 }} source={require('../assets/bill.png')} />)
    },
    {
      text: 'Settings',
      onPress: () => navigation.navigate('Setting'),
      icon: (<RNImage style={{ width: 20, height: 20 }} source={require('../assets/settings.png')} />)
    },
    {
      text: 'FAQ(s)',
      onPress: () => navigation.navigate('Faq'),
      icon: (<RNImage style={{ width: 20, height: 20 }} source={require('../assets/question.png')} />)

    },
    {
      text: 'About Us',
      onPress: () => navigation.navigate('About'),
      icon: (<RNImage style={{ width: 20, height: 20 }} source={require('../assets/information-button.png')} />)

    },
    {
      text: 'Logout',
      onPress: () => logout(),
      icon: (<RNImage style={{ width: 20, height: 20 }} source={require('../assets/log-out.png')} />)

    },
  ];
  return (
    <SafeAreaView style={style.container}>
      <FocusAwareStatusBar barStyle='light-content' backgroundColor='#054078' />
      <View style={{...style.imgContainer, display:headerDisplay}}>
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

      <View style={{ backgroundColor: "#fff", paddingTop: 24 }}>
        {firstData.map((data, i) => {
          return (
            <TouchableOpacity
              key={`${data}${i}`}
              onPress={data.onPress}
              style={{ width: deviceWidth, paddingVertical: 13, paddingHorizontal: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',

                }}>
                {data.icon}
                <Text style={{ fontSize: 18, paddingLeft: 15 }}>{data.text}</Text>
                {/* <Icon type={'font-awesome'} name={'chevron-right'} size={15} /> */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
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
    paddingRight: 25
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
    paddingLeft: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default Profile;
