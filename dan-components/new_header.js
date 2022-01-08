import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import {
    articleErrRem, loadingArticle, loadingArticleStop, setArticle,
    setSubject
} from '../actions/learn';
import FocusAwareStatusBar from '../component/FocusAwareStatusBar';
import { db } from '../processes/db';
import isJson from '../processes/isJson';

const data = [
    { label: 'today', value: 'today' },
    { label: 'Politics', value: 'Politics' },
    { label: 'Science and technology', value: 'Science and Technology' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Health', value: 'Health' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Sports', value: 'Sports' },
    { label: 'History', value: 'History' },
    { label: 'Socials', value: 'Socials' },
    { label: 'LifeStyle', value: 'Lifestyle' },
    { label: 'Geography', value: 'Geography' },

];


const DropdownComponent = () => {
    const [value, setValue] = useState(null);

    const store = isJson(useSelector((state) => state.learn));
    const dispatch = useDispatch();
    const pickerRef = useRef(null);

    const selectCategory = (category) => {
        let sql =
            category === 'today'
                ? `SELECT * FROM articles`
                : `SELECT * FROM articles WHERE category = ? `;

        // let param = category === 'today' ? null : [category];
        dispatch(articleErrRem());

        // set the activityindicator rolling
        dispatch(loadingArticle());

        // set article array to empty
        dispatch(setArticle([]));
        // const selectedItems = store.displayItems.filter((item) => item.category === category)
        // console.log(selectedItems, "selectedItems")
        // dispatch(setArticle(selectedItems))
        db.transaction(
            (tx) => {
                tx.executeSql(
                    sql,
                    param,
                    (txObj, { rows: { length, _array } }) => {
                        if (length > 0) {
                            let newArr = [..._array];
                            newArr.forEach((obj) => {
                                obj.read = obj.read === 1 ? true : false;
                                obj.archived = obj.archived === 1 ? true : false;
                                obj.liked = obj.liked === 1 ? true : false;
                            });
                            dispatch(setArticle(newArr));
                            dispatch(loadingArticleStop());
                        } else {
                            dispatch(setArticle([]));
                            console.log('nothing');
                            dispatch(loadingArticleStop());
                        }
                    },
                    (txObj, err) => {
                    }
                );
            },
            (err) => {
                console.log(err);
            },
            () => console.log('completed transactions')
        );
    };

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === store.subject && (
                    <AntDesign
                        style={styles.icon}
                        color="green"
                        name="Safety"
                        size={20}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.header}>

            <FocusAwareStatusBar barStyle='dark-content' backgroundColor='#fff' />
            <Text style={styles.headerText}>Learn</Text>

            <Dropdown
                style={styles.dropdown}
                data={data}
                search
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={store.subject}
                onChange={item => {
                    console.log(item)
                    dispatch(setSubject(item.value));
                    selectCategory(item.value);
                }}
                renderLeftIcon={() => (
                    <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                )}
                renderItem={renderItem}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    dropdown: {
        height: 50,
        margin: 20,
        width: "60%",
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
});