import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  Image,
  Button,
  Platform,
  Animated,
  UIManager,
  Dimensions,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  LayoutAnimation,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'native-base';
import Hyperlink from 'react-native-hyperlink';
import Card from '../../dan-components/card';
import { Icon } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import LearnCarouselCardItem from '../../dan-components/learnCarouselCardItem';
import { onFailedLike, onFailedArchive } from '../../actions/learn';
import {
  likeFxn,
  unlikeFxn,
  archiveFxn,
  unarchiveFxn,
} from '../../actions/request';
import { useDispatch, useSelector } from 'react-redux';
import useCheckpoint from '../../component/useCheckpoint';
import learn_data from '../../data/learn_data';
import Modal from 'react-native-modal';
const reactStringReplace = require('react-string-replace');

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.852);

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Content = ({
  content,
  topic,
  text,
  category,
  img,
  id,
  liked,
  archived,
}) => {
  const [word, setWord] = useState({});
  const [likePressed, setLikePressed] = useState(false);
  const [archivePressed, setArchivePressed] = useState(false);
  let replaceText;

  replaceText =
    content.new_word_1 !== '' && content.new_word_1 !== null
      ? reactStringReplace(
          content.body,
          content.new_word_1.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() =>
                newWord(match, content.new_word_1.split(':')[1], 1)
              }>
              {match}
            </Text>
          )
        )
      : content.body;

  replaceText =
    content.new_word_2 !== '' && content.new_word_2 !== null
      ? reactStringReplace(
          replaceText,
          content.new_word_2.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() =>
                newWord(match, content.new_word_2.split(':')[1], 1)
              }>
              {match}
            </Text>
          )
        )
      : replaceText;

  replaceText =
    content.new_word_3 !== '' && content.new_word_3 !== null
      ? reactStringReplace(
          replaceText,
          content.new_word_3.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() =>
                newWord(match, content.new_word_3.split(':')[1], 1)
              }>
              {match}
            </Text>
          )
        )
      : replaceText;

  replaceText =
    content.idioms_1 !== '' && content.idioms_1 !== null
      ? reactStringReplace(
          replaceText,
          content.idioms_1.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() => newWord(match, content.idioms_1.split(':')[1], 0)}>
              {match}
            </Text>
          )
        )
      : replaceText;

  replaceText =
    content.idioms_2 !== '' && content.idioms_2 !== null
      ? reactStringReplace(
          replaceText,
          content.idioms_2.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() => newWord(match, content.idioms_2.split(':')[1], 0)}>
              {match}
            </Text>
          )
        )
      : replaceText;

  replaceText =
    content.idioms_3 !== '' && content.idioms_3 !== null
      ? reactStringReplace(
          replaceText,
          content.idioms_3.split(':')[0],
          (match, i) => (
            <Text
              key={match + i}
              style={styles.color}
              onPress={() => newWord(match, content.idioms_3.split(':')[1], 0)}>
              {match}
            </Text>
          )
        )
      : replaceText;

  const newWord = (word, meaning, num) => {
    const obj = { word, meaning, type: num === 1 ? 'New word' : 'Idiom' };
    setWord(obj);
  };

  const closeWord = () => {
    setWord({});
  };

  const dispatch = useDispatch();
  let numberOfReads = 256;

  const [expand, setExpand] = useState(false);

  const animatedExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand(!expand);
  };

  const showToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const likes = async (id, liked) => {
    if (!liked) {
      const getResult = useCheckpoint(onFailureLike, onSuccessLike, id);
      getResult().then((res) => {
        Toast.show({
          text: 'You liked this post',
          buttonText: 'CLOSE',
          type: 'success',
          textStyle: { fontSize: 14 },
          style: { marginHorizontal: 50, borderRadius: 20, marginBottom: 20 },
        });
      });
    } else {
      const getResult = useCheckpoint(onFailureUnlike, onSuccessUnlike, id);
      await getResult();
    }
  };

  const onSuccessLike = (id) => {
    dispatch(likeFxn(id));
    setLikePressed(!likePressed);
  };
  const onFailureLike = (id) => {
    dispatch(onFailedLike({ id, state: 1 }));
  };
  const onSuccessUnlike = (id) => {
    dispatch(unlikeFxn(id));
    setLikePressed(!likePressed);
  };
  const onFailureUnlike = (id) => {
    dispatch(onFailedLike({ id, state: 0 }));
  };

  const archive = (content) => {
    if (!content.archived) {
      const getResult = useCheckpoint(
        onFailureArchive,
        onSuccessArchive,
        content
      );
      getResult();
    } else {
      const getResult = useCheckpoint(
        onFailureUnarchive,
        onSuccessUnarchive,
        content
      );
      getResult();
    }
  };

  // when network is confirmed for an unarchive request
  const onSuccessUnarchive = (obj) => {
    dispatch(unarchiveFxn(obj));
    setArchivePressed(!archivePressed);
  };

  // when there is no network for an unarchive request
  const onFailureUnarchive = (obj) => {
    dispatch(onFailedArchive({ ...obj, state: 0 }));
  };

  // when network is confirmed for an archive request
  const onSuccessArchive = (obj) => {
    dispatch(archiveFxn(obj));
    setArchivePressed(!archivePressed);
  };

  // when there is no network for a archive request
  const onFailureArchive = (obj) => {
    dispatch(onFailedArchive({ ...obj, state: 1 }));
  };

  return (
    <View>
      {!expand ? (
        <Card style={{ paddingBottom: 7 }}>
          <TouchableOpacity onPress={() => animatedExpand()}>
            <View style={styles.preview}>
              <View style={{ width: img !== null ? '60%' : '100%' }}>
                <Text style={styles.titleText}>{topic}</Text>
                <Text numberOfLines={3}>{text}</Text>
              </View>
              {img && <Image style={styles.thumbNail} source={{ uri: img }} />}
            </View>
          </TouchableOpacity>
          {/*<View style={styles.iconGroup}>
            <Text>{numberOfReads} reads</Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
                <Icon
                  name={liked ? 'heart' : 'heart-o'}
                  type={'font-awesome'}
                  color={liked || likePressed ? 'red':'#808080'}
                  size={20}
                  onPress={() => {
                    likes(id, liked);
                  }}
                  iconStyle={{paddingHorizontal: 17}}
                />
                <Icon
                  name={'archive'}
                  type={'font-awesome'}
                  color={archived || archivePressed ? '#2980b9' : '#808080'}
                  size={20}
                  onPress={() => {
                    archive(content);
                  }}
                  iconStyle={{paddingHorizontal: 17}}
                />
                <Icon
                  name={'expand'}
                  type={'font-awesome'}
                  color={'#2980b9'}
                  size={20}
                  onPress={() => animatedExpand()}
                  iconStyle={{paddingHorizontal: 17}}
                />
              </View>
            </View>*/}
        </Card>
      ) : (
        <View style={{ marginVertical: 12 }}>
          <View>
            <TouchableOpacity onPress={() => animatedExpand()}>
              <Image source={{ uri: img }} style={styles.image} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.titleText}>{topic}</Text>
            </View>
            <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
              <View style={styles.textView}>
                <Text>{replaceText}</Text>
              </View>
            </Hyperlink>
          </View>
        </View>
      )}
      <Modal
        isVisible={Object.entries(word).length ? true : false}
        onBackdropPress={() => setWord({})}
        style={styles.bottomModal}>
        <View
          style={{
            borderTopRightRadius: 11,
            borderTopLeftRadius: 11,
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              fontSize: 22,
              color: '#2980b9',
              padding: 8,
            }}>
            <Text>{word.type}</Text>
          </View>
          <View style={styles.wordtitle}>
            <Text style={styles.modalTitleText}>{word.word}</Text>
            <View styles={styles.divider}></View>
            <Text style={{ fontStyle: 'italic', padding: 8 }}>
              {word.meaning}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 19,
  },
  preview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    paddingVertical: 10
  },
  thumbNail: {
    width: 100,
    height: 100,
    borderRadius: 7,
  },
  image: {
    width: SLIDER_WIDTH,
    height: SLIDER_WIDTH * 0.65,
  },
  iconGroup: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  color: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
  wordtitle: {
    fontSize: 18,
    paddingHorizontal: 20,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    padding: 8,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
  textView: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#3480eb',
    marginVertical: 10,
    alignSelf: 'center',
  },
});
