import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

export const SLIDER_HEIGHT = Dimensions.get('window').height;
export const SLIDER_WIDTH = Dimensions.get('window').width;
// export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.827);

const LearnCarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <View style={styles.caption}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 9,
    width: SLIDER_WIDTH,
  },
  image: {
    width: SLIDER_WIDTH,
    borderRadius: 9,
    height: 300,
  },
  text: {
    fontSize: 23,
  },
  caption:{
    width: SLIDER_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default LearnCarouselCardItem;
