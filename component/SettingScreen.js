import React, { useState, useEffect, useMemo } from 'react';
import Constants from 'expo-constants';
import deviceSize from '../processes/deviceSize';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import ListSeparator from './ListSeparator';
import Animated, { Easing } from 'react-native-reanimated';
import {
  View,
  Text,
  Image as RNImage,
  StyleSheet,
  Alert,
  ImageBackground,
  Keyboard,
  FlatList,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
// import { WebView } from 'react-native-webview';
// import { Badge } from 'react-native-elements'
import { Container, Button, Badge, Toast, Icon as NBIcon } from 'native-base';
import Rolling from './Rolling'
import Overlay from './Overlay';
import Image from './Image';
import { Icon } from 'react-native-elements';
import isJson from '../processes/isJson';
import SetPassword from './SetPassword';
import EditBox from './EditBox';
import { updateUserinfo } from '../actions/user';
import { useDispatch, useSelector } from 'react-redux';
import CustomOverlay from './CustomOverlay';
import {
  ScrollView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { deleteUser } from '../actions/request';
import { storeKey, getKey, deleteKey } from '../processes/keyStore';
import { loginValue, confirm } from '../processes/lock';
import { logOutUser, notLogin } from '../actions/login';

const {
  Value,
  timing,
  spring,
  block,
  cond,
  eq,
  call,
  useCode,
  diffClamp,
  add,
  interpolate,
  set,
  color,
} = Animated;

const AnimatedIcon = Animated.createAnimatedComponent(NBIcon);
const AnimatedBadge = Animated.createAnimatedComponent(Badge);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedImageBg = Animated.createAnimatedComponent(ImageBackground);
const AnimatedContent = Animated.createAnimatedComponent(ScrollView);
// const AnimatedContents = Animated.createAnimatedComponent(FlatList)
const api = 'https://api.cloudinary.com/v1_1/bookchmap/image/upload';

const SettingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const windowHeight = deviceSize().deviceHeight;
  const deviceWidth = deviceSize().deviceWidth;
  const [imgUrl, setImg] = useState({});
  const [empty, setEmpty] = useState(false);
  const [cloudImg, setCloudImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const store = isJson(useSelector((state) => state));
    null

  const user = [];
  var deleteTimer;
  const storePreview = isJson(useSelector((state) => state.learn)).preview;
  const user_pk = isJson(useSelector((state) => state.user.user));
  const preview = useMemo(() => {
    uri: storePreview;
  }, [storePreview]);
  const uri = store.user.user.image;
  Object.entries(isJson(store.user.user)).forEach((item) => {
    let label = item[0];
    let icon =
      label === 'username' || label === 'fullname'
        ? 'person'
        : label === 'email'
          ? 'email'
          : label === 'phone_number'
            ? 'call'
            : label === 'institution'
              ? 'school'
              : null;
    if (
      label === 'username' ||
      label === 'fullname' ||
      label === 'email' ||
      label === 'phone_number' ||
      label === 'institution' ||
      label === 'date_of_birth'
    ) {
      user.push({
        value: item[1],
        label,
        icon,
      });
    }
  });
  const details = [
    { fullname: isJson(store.user.user).fullname, icon: 'person' },
    { username: isJson(store.user.user).username, icon: 'person' },
    { email: isJson(store.user.user).email, icon: 'email' },
    { mobile: isJson(store.user.user).phone_number, icon: 'call' },
  ];
  user.push({ value: '', label: 'password', icon: 'https' });
  const [verify, setVerify] = useState(false);
  const [edit, setEdit] = useState(false);
  const nameVal = new Value(deviceSize().deviceWidth);
  const springVal = new Value(windowHeight);
  const animatedMargin = new Value(0);
  const HEIGHT = 300;
  const dragY = new Value(0);
  const offsetY = new Value(HEIGHT);
  const gestureState = new Value(-1);
  const onGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      dragY.setValue(event.nativeEvent.translationY);
      gestureState.setValue(event.nativeEvent.state);
      offsetY.setValue(add(clampedVal, event.nativeEvent.translationY));
    }
  };

  const transY = cond(
    eq(gestureState, State.ACTIVE),
    add(offsetY, dragY),
    set(offsetY, add(offsetY, dragY))
  );

  const clampedVal = diffClamp(transY, 0, HEIGHT);
  const translateY = interpolate(clampedVal, {
    inputRange: [0, HEIGHT],
    outputRange: [0, HEIGHT],
    extrapolate: 'clamp',
  });
  const translateX = interpolate(clampedVal, {
    inputRange: [0, HEIGHT],
    outputRange: [0.8 * deviceWidth, deviceWidth + 20],
    extrapolate: 'clamp',
  });
  const borderRadius = interpolate(translateY, {
    inputRange: [0, HEIGHT],
    outputRange: [0, 20],
    extrapolate: 'clamp',
  });
  const iconOpacity = interpolate(clampedVal, {
    inputRange: [0, 299, HEIGHT],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const endconOpacity = interpolate(clampedVal, {
    inputRange: [0, 299, HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const startView = interpolate(clampedVal, {
    inputRange: [0, HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const endView = interpolate(clampedVal, {
    inputRange: [0, HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const animatedHeight = interpolate(clampedVal, {
    inputRange: [0, HEIGHT],
    outputRange: [200, 0],
    extrapolate: 'clamp',
  });
  const bgColor = color(
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [5, 225],
      extrapolate: 'clamp',
    }),
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [64, 225],
      extrapolate: 'clamp',
    }),
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [120, 225],
      extrapolate: 'clamp',
    }),
    1
  );
  const editColor = color(
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [255, 0],
      extrapolate: 'clamp',
    }),
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [255, 0],
      extrapolate: 'clamp',
    }),
    interpolate(clampedVal, {
      inputRange: [0, HEIGHT],
      outputRange: [255, 0],
      extrapolate: 'clamp',
    }),
    1
  );

  const pickImage = async () => {
    null
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImg(result);
      uploadPix(result);
    }
  };
  const uploadPix = (result) => {
    if (result.base64) {
      setLoading(true);
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      let data = {
        file: base64Img,
        upload_preset: 'bookchampUsers',
      };
      fetch(api, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (res) => {
          let data = await res.json();
          null
          return data.secure_url;
        })
        .then((url) => {
          setLoading(false);
          setCloudImg(url);
          dispatch(updateUserinfo({ name: 'image', value: url }));
          Toast.show({
            text: url,
            buttonText: 'CLOSE',
            duration: 10000,
          });
        })
        .catch((err) => {
          setLoading(false);
          setEmpty(true);
          Toast.show({
            text: 'error uploading profile',
            buttonText: 'CLOSE',
            duration: 3000,
          });
          setTimeout(() => {
            setEmpty(false);
          }, 2000);
        });
    } else {
      console('empty value for upload');
      setEmpty(true);
      setTimeout(() => {
        setEmpty(false);
      }, 2000);
    }
  };
  const [loader, setLoader] = useState(false);
  const confirmDeleteAccount = () => {
    Alert.alert(
      'Are you sure?',
      "There's no going back; deleting your account will permanently delete your ranking progress as well as all related data",
      [
        {
          text: 'DELETE',
          onPress: () => {
            setLoader(true);
            deleteTimer = setTimeout(() => {
              deleteAccount();
            }, 3000);
          },
        },
        { text: 'CANCEL' },
      ]
    );
  };

  const deleteAccount = async () => {
    const domain = 'https://bookchamp.herokuapp.com/api/v1/';

    // get token from securestore
    const user_pk = store.user.user.user_pk;
    // get token from securestore
    const val = await getKey(loginValue);
    // set headers and other params
    const param = {
      method: 'POST',
      headers: {
        Authorization: `Token ${val}`,
      },
    };
    null
    if (val !== undefined && val !== null) {
      fetch(`${domain}user/${user_pk}/delete`, param)
        .then((res) => res.json())
        .then((res) => {
          null
          if (res.status === 'Success') {
            dispatch(logOutUser());
            setLoader(false);
            dispatch(notLogin())
          }
        })
        .catch((err) => {
          null
        });
    }
  };
  useEffect(() => {
    const backAction = () => {
      clearTimeout(deleteTimer)
      navigation.goBack()
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (verify) {
        block([
          timing(springVal, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }).start(),
          timing(nameVal, {
            duration: 1000,
            toValue: 25,
            easing: Easing.inOut(Easing.ease),
          }).start(),
        ]);
      }
      return () => {
        if (verify) springVal.setValue(windowHeight);
        if (verify) setVerify(false);
      };
    }, [verify])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (verify) {
        timing(nameVal, {
          duration: 1000,
          toValue: 25,
          easing: Easing.inOut(Easing.ease),
        }).start();
      }
      return () => { };
    }, [edit])
  );

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);
  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } =
          await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  const _keyboardDidShow = (e) => {
    timing(animatedMargin, {
      duration: e.duration,
      toValue: e.endCoordinates.height,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };
  const _keyboardDidHide = (e) => {
    timing(animatedMargin, {
      toValue: 0,
      duration: e.duration,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const editSpringFalse = () => {
    setEdit(false);
  };
  const editSpring = () => {
    setEdit(true);
  };

  const openSetting = () => {
    setVerify(true);
  };

  // useCode(() => {
  //     return call([borderRadius], (borderRadius) => {
  //         null
  //     })
  // }, [borderRadius])
  return (
    <>
      <Container style={{ backgroundColor: '#054078' }}>
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#054078"
        />
        <AnimatedContent
          style={[
            style.profileview,
            // { transform: [{ translate: springVal }] },
          ]}>
          <View style={style.profile}>
            {uri === null ? (
              <RNImage
                source={require('../img/anonymous.jpg')}
                style={{ width: '100%', height: 300 }}
              />
            ) : (
              <Image
                {...{ preview, uri }}
                style={{ width: '100%', height: 300 }}
              />
            )}
            <Animated.View
              style={{
                ...style.nameText,
                transform: [{ translateX: nameVal }],
              }}>
              <Text style={style.name} numberOfLines={1}>
                {details[0].fullname}
              </Text>
            </Animated.View>
          </View>
          <View>
            <LinearGradient
              colors={['transparent', '#e1efef']}
              style={{ ...style.gradient, height: windowHeight }}
            />
            <View style={{ ...style.emptyview, width: deviceWidth, flexDirection: "row", justifyContent: "space-between" }}>

              <Text style={{ color: 'yellow', fontWeight: 'bold' }}>
                Details
              </Text>
              <View style={{
                width: deviceWidth - 50,
                height: 0,
                borderTopWidth: 1,
                borderTopColor: "#fff",
                alignSelf: "center"
              }}>
              </View>
            </View>
            <Button
              iconLeft
              onPress={editSpring}
              bordered
              style={{
                paddingHorizontal: 20,
                borderColor: '#fff',
                alignSelf: "flex-end",
                marginHorizontal: 20,
              }}>
              <Icon
                type="material"
                name="folder-shared"
                size={24}
                color="#f1f1f1"
                containerStyle={{ marginRight: 15 }}
              />
              <Text style={{ color: '#fff', fontWeight: 'bold', }}>Edit</Text>
            </Button>
            <View style={style.list}>
              {details.map((det, i) => {
                if (Object.keys(det).includes('fullname')) {
                  return null;
                } else {
                  return (
                    <ListSeparator data={det} time={i} key={i} edit={edit} />
                  );
                }
              })}
            </View>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ paddingBottom: 13, width: deviceWidth, flexDirection: "row", justifyContent: "space-between" }}>

              <Text style={{ color: 'yellow', fontWeight: 'bold' }}>
                Manage Account
              </Text>
              <View style={{
                width: deviceWidth - 50,
                height: 0,
                borderTopWidth: 1,
                borderTopColor: "#fff",
                alignSelf: "center"
              }}>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{ paddingVertical: 10 }}
                onPress={() => navigation.navigate('Privacy')}>
                <Text style={{ color: '#fff', fontSize: 16 }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{ paddingVertical: 10 }}
                onPress={confirmDeleteAccount}>
                <Text style={{ color: 'red', fontSize: 16 }}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedContent>
      </Container>
      <Overlay isVisible={loader}>
        <Rolling text="Deleting User..." />
      </Overlay>

      {edit ? (
        <CustomOverlay isVisible={edit} backHandler={editSpringFalse}>
          <PanGestureHandler
            maxPointers={1}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onGestureEvent}>
            <Animated.View
              style={[
                {
                  ...style.titleView,
                  height: windowHeight,
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                },
                { transform: [{ translateY: translateY }] },
              ]}>
              <View>
                <Animated.View
                  style={[
                    { ...style.editHeading },
                    {
                      backgroundColor: bgColor,
                      borderTopLeftRadius: borderRadius,
                      borderTopRightRadius: borderRadius,
                    },
                  ]}>
                  <Animated.View
                    style={[
                      { flex: iconOpacity },
                      { paddingLeft: 10, justifyContent: 'center' },
                    ]}>
                    <Animated.Text
                      onPress={editSpringFalse}
                      style={[
                        {
                          opacity: iconOpacity,
                          color: editColor,
                          fontWeight: 'bold',
                        },
                      ]}>
                      CLOSE
                    </Animated.Text>
                  </Animated.View>
                  <Animated.View style={[{ paddingLeft: 15 }, { flex: 3 }]}>
                    <Animated.Text
                      style={[style.editText, { color: editColor }]}>
                      Edit Profile
                    </Animated.Text>
                  </Animated.View>
                  <Animated.View
                    style={[
                      { flex: endconOpacity },
                      { paddingRight: 15, alignItems: 'flex-end' },
                    ]}>
                    <Animated.Text
                      onPress={editSpringFalse}
                      style={[{ opacity: endconOpacity, fontWeight: 'bold' }]}>
                      CLOSE
                    </Animated.Text>
                  </Animated.View>
                </Animated.View>
                <Animated.View style={[{ height: animatedHeight }]}>
                  {uri === null ? (
                    <AnimatedImageBg
                      source={require('../img/anonymous.jpg')}
                      style={[
                        {
                          flex: 1,
                          justifyContent: 'flex-end',
                          paddingLeft: 15,
                          paddingBottom: 15,
                        },
                        { opacity: iconOpacity },
                      ]}>
                      <Text style={style.name}>{details[0].fullname}</Text>
                    </AnimatedImageBg>
                  ) : (
                    <AnimatedImage
                      {...{ preview, uri }}
                      style={[style.imgUrl, { opacity: iconOpacity }]}
                    />
                  )}
                  <AnimatedBadge containerStyle={[style.badge]}
                    value={<Icon name="camera" style={{ fontSize: 25, color: "#054078" }} />}
                    onPress={pickImage}
                  />
                  <AnimatedBadge style={[style.badge, { left: translateX }]}>
                    <AnimatedIcon
                      name="camera"
                      onPress={pickImage}
                      style={{ fontSize: 25, color: '#054078' }}
                    />
                  </AnimatedBadge>
                </Animated.View>
              </View>
              <AnimatedContent
                style={[
                  { paddingBottom: animatedMargin, backgroundColor: '#054078' },
                ]}>
                <LinearGradient
                  colors={['#e1efef', 'transparent']}
                  style={[{ paddingTop: 15, paddingBottom: 25 }]}>
                  {user.map((item, i) => (
                    <TouchableWithoutFeedback style={[style.editBox]} key={i}>
                      <EditBox item={item} />
                    </TouchableWithoutFeedback>
                  ))}
                </LinearGradient>
              </AnimatedContent>
            </Animated.View>
          </PanGestureHandler>
        </CustomOverlay>
      ) : null}
    </>
  );
};

const style = StyleSheet.create({
  profileview: {
    flex: 1,
    padding: 0,
    width: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  profile: {
    position: 'relative',
    width: '100%',
    height: 300,
    padding: 0,
    marginBottom: 15,
  },
  emptyview: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#fff',
    paddingBottom: 10,
  },
  list: {
    width: '100%',
    alignSelf: 'center',
  },
  nameText: {
    position: 'absolute',
    top: 250,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 15,
    borderColor: '#f1f1f1',
  },
  all: {
    color: 'yellow',
    fontSize: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2,
  },
  titleView: {
    backgroundColor: '#fff',
    paddingVertical: 0,
  },
  imgUrl: {
    height: '100%',
    width: '100%',
  },
  editBox: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    borderBottomColor: '#777',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  editHeading: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  editText: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
});

export default SettingScreen;
