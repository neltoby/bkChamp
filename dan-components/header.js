import { Picker } from 'native-base';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  articleErrRem, loadingArticle, loadingArticleStop, setArticle,
  setSubject
} from '../actions/learn';
import FocusAwareStatusBar from '../component/FocusAwareStatusBar';
import { db } from '../processes/db';
import isJson from '../processes/isJson';

export const categories = [
  'today',
  'Politics',
  'Science and Technology',
  'Finance',
  'Health',
  'Entertainment',
  'Sports',
  'History',
  'Socials',
  'Lifestyle',
  'Geography',
];





const Header = ({ top }) => {
  const store = isJson(useSelector((state) => state.learn));
  const dispatch = useDispatch();
  const pickerRef = useRef(null);

  const selectCategory = async (category) => {
    let sql =
      category === 'today'
        ? `SELECT * FROM articles`
        : `SELECT * FROM articles WHERE category = ? `;

    let param = category === 'today' ? null : [category];
    await dispatch(articleErrRem());

    // set the activityindicator rolling
    await dispatch(loadingArticle());

    // set article array to empty
    await dispatch(setArticle([]));
    console.log(sql);
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          param,
          (txObj, { rows: { length, _array } }) => {
            console.log(length);
            console.log(_array);
            if (length > 0) {
              let newArr = [..._array];
              newArr.forEach((obj) => {
                obj.read = obj.read === 1 ? true : false;
                obj.archived = obj.archived === 1 ? true : false;
                obj.liked = obj.liked === 1 ? true : false;
              });
              dispatch(setArticle(newArr));
              console.log(newArr);
              dispatch(loadingArticleStop());
            } else {
              dispatch(setArticle([]));
              console.log('nothing');
              dispatch(loadingArticleStop());
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

  return (
    <View style={styles.header}>
      <FocusAwareStatusBar barStyle='dark-content' backgroundColor='#fff' />
      <Text style={styles.headerText}>Learn</Text>
      <Picker
        ref={pickerRef}
        selectedValue={store.subject}
        style={{ height: 50, width: 50, marginLeft: 100 }}
        prompt="categories"
        mode={'dropdown'}
        onValueChange={(itemValue) => {
          dispatch(setSubject(itemValue));
          selectCategory(itemValue);
        }}>
        {categories.map((category, index) => {
          return <Picker.Item key={index} label={category} value={category} />;
        })}
      </Picker>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#333',
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
  },
  headerText: {
    fontSize: 27,
    padding: 15,
  },
});
