import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Dimensions, FlatList, Image, StatusBar, StyleSheet, RefreshControl,
  Text,
  View
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import {
  articleErrRem,
  loadingArticle, loadingArticleStop, setArticle, setCategoryImages,
} from '../../actions/learn';
import { getArticles } from '../../actions/request';
import LearnCarouselCardItem from '../../dan-components/learnCarouselCardItem';
import carousel_imgs from '../../data/carousel_data';
import { db } from '../../processes/db';
import isJson from '../../processes/isJson';
import Content from './content';
import { CacheManager } from "react-native-expo-image-cache";
import { category_imgs } from '../../data/cat_imgs'

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.852);

const Learn = (props) => {
  const dispatch = useDispatch();
  const store = isJson(useSelector((state) => state.learn));
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  const cacheCategoryImages = React.useCallback(
    async (categories) => {
      const cat_imgs = new Object()
      for (const item of Object.entries(categories)) {
        let key = item[0]
        const path = await CacheManager.get(item[1]).getPath();
        cat_imgs[key] = path
      }
      dispatch(setCategoryImages(cat_imgs))
    }, []
  )

  const handleRefresh = () => {
    setRefreshing(true);
    onSuccess();
    setRefreshing(false);
  };

  const onSuccess = async (payload = null) => {
    console.log('onsuccess was called');
    await dispatch(getArticles());
  };

  const onFailure = async (payload = null) => {
    const sql = `SELECT * FROM articles`;
    await db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          (txObj, { rows: { length, _array } }) => {
            if (length > 0) {
              let newArr = [..._array];
              newArr.forEach((arr) => {
                arr.read = arr.read === 1 ? true : false;
                arr.archived = arr.archived === 1 ? true : false;
                arr.liked = arr.liked === 1 ? true : false;
              });
              dispatch(loadingArticleStop());
              dispatch(setArticle(newArr));
            } else {
              dispatch(loadingArticleStop());
              dispatch(setArticle([]));
            }
          },
          (txObj, err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      },
      () => console.log('completed transactions')
    );
  };
  const getAllArticles = async () => {
    // const getResult = useCheckpoint(onFailure, onSuccess, null);
    // unset/remove the error display page
    dispatch(articleErrRem());

    // set the activityindicator rolling
    dispatch(loadingArticle());

    // set article array to empty
    dispatch(setArticle([]));

    onSuccess();
  };

  useEffect(() => {
    const sql =
      'CREATE TABLE IF NOT EXISTS articles (aid INTEGER PRIMARY KEY AUTOINCREMENT, id INT UNIQUE, title TEXT, body TEXT, category TEXT, image_url TEXT, likes INT, idioms_1 TEXT, idioms_2 TEXT, idioms_3 TEXT, new_word_1 TEXT, new_word_2 TEXT, new_word_3 TEXT, read INT, archived INT, liked INT, header_image_url TEXT)';
    const sqli =
      'CREATE TABLE IF NOT EXISTS unsent (uid INTEGER PRIMARY KEY AUTOINCREMENT, id INT UNIQUE, title TEXT)';
    const sqlii =
      'CREATE TABLE IF NOT EXISTS archive (aid INTEGER PRIMARY KEY AUTOINCREMENT, id INT UNIQUE, category TEXT)';
    const sqliii =
      'CREATE TABLE IF NOT EXISTS archiveunsent (aid INTEGER PRIMARY KEY AUTOINCREMENT, id INT UNIQUE, title TEXT)';
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          null,
          (txObj, { insertId, rowsAffected }) => {
            txObj.executeSql(
              sqli,
              null,
              (txO, { rows }) => {
                console.log('table unsent created successfully');
                getAllArticles();
                cacheCategoryImages(category_imgs)
                txO.executeSql(
                  sqlii,
                  null,
                  (txOb, { rows }) => {
                    console.log('archive table created');
                    txOb.executeSql(
                      sqliii,
                      null,
                      (txObI, { row }) => {
                        console.log('created archive unsent');
                      },
                      (err) =>
                        console.log(err, 'archiveunsent cud not be created')
                    );
                  },
                  (err) => console.log(err, 'table archive creation failed')
                );
              },
              (err) => console.log(err, 'cud not drop table')
            );
          },
          (err) => console.log(err, ' table creation failed ')
        );
      },
      (err) => console.log(err, 'from learnscreen'),
      () => console.log('table articles created')
    );
    return () => { };
  }, []);



  const learnCarousel = () => {
    return (
      <>
        {
          store.subject === 'today' ? (
            <View>
              <Carousel
                layout="default"
                ref={isCarousel}
                data={carousel_imgs}
                renderItem={LearnCarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={SLIDER_WIDTH}
                onSnapToItem={(index) => setIndex(index)}
                useScrollView={true}
                loop={true}
                enableSnap={true}
                autoplay={true}
              // hasParallaxImages={true}
              />
              <Pagination
                dotsLength={carousel_imgs.length}
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
            </View>
          ) : (
            <Image
              style={{ width: SLIDER_WIDTH, height: 250 }}
              source={{
                uri: store.category_images[store.subject],
              }}
            />
          )
        }
      </>
    )
  }
  const renderContent = (content, index) => {
    return (
      <Content
        content={content}
        topic={content.title}
        text={content.body}
        category={content.category}
        img={content.image_url}
        liked={content.liked}
        archived={content.archived}
        id={index}
      />
    );
  };

  return (
    <View style={{ marginBottom: 90, backgroundColor: "#fff" }}>
      {
        store.loading_article ? (
          <ActivityIndicator size="small" color="blue" />
        ) : store.displayItems.length > 0 ? (
          <FlatList
            data={store.displayItems.slice(0, 10)}
            keyExtractor={(content) => content.id.toString()}
            renderItem={({ item, index }) => renderContent(item, index)}
            ListHeaderComponent={learnCarousel()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        ) : (
          <Text>There are no articles for {store.subject}</Text>
        )
      }
    </View>
  );
};

export const MemoizedLearn = memo(Learn);

const styles = StyleSheet.create({});

          // <ScrollView style={{ marginBottom: 45, backgroundColor: "#fff" }}>
// </ScrollView>
