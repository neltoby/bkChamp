import React, { useEffect } from 'react';
import { View, Clipboard, ToastAndroid, Alert, Button } from 'react-native';
// import Clipboard from '@react-native-community/clipboard';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FlatButton from '../dan-components/button';
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from '../dan-components/carousel-card-item';
import FlatDialog from '../dan-components/affiliate-dialog';
import data from '../data/affiliate-data';

const CarouselCards = () => {
  const refferal_code = 'r3gn2ihdt4eh5eu';
  const message = 'refferal code copied';

  const [dialogVisible, setDialogVisible] = React.useState(false);

  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  const showToast = () => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const handleDialogPress = () => {
    Clipboard.setString(refferal_code);
    setDialogVisible(false);
    showToast();
  };

  const copyCodeAlert = () =>
    Alert.alert(
      'Copy and Share Refferal code',
      `Your refferal code is ${refferal_code}`,
      [
        {
          text: 'Copy',
          onPress: () => {
              Clipboard.setString(refferal_code);
              showToast();
            }
        },
      ],
    );

  return (
    <View>
      <Carousel
        layout="default"
        layoutCardOffset={`9`}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
        loop={true}
        autoplay={true}

        
        // hasParallaxImages={true}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
     {/* <Button title="Get Started" onPress={copyCodeAlert}/> */}
      <FlatButton text="Get Started" onPress={copyCodeAlert} />
      <FlatDialog
        setDialogVisible={setDialogVisible}
        visible={dialogVisible}
        handleDialogPress={handleDialogPress}
        refferal_code={refferal_code}
      />
    </View>
  );
};

export default CarouselCards;
