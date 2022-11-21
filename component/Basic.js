/* eslint-disable no-trailing-spaces */
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import PaystackWebView from 'react-native-paystack-webview';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon } from 'native-base';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { buyPoints } from '../actions/request';
import { paystack } from '../processes/lock';
import { noPoints } from '../actions/quiz';
import { updateUserinfo } from '../actions/user';
import isJson from '../processes/isJson';
import deviceSize from '../processes/deviceSize';

const Basic = (props) => {
  const paystackWebViewRef = useRef();
  const dispatch = useDispatch();
  const store = isJson(useSelector((state) => state));
  const windowWidth = deviceSize().deviceWidth;
  const windowHeight = deviceSize().deviceHeight;
  const { dataContent, navigation } = props;
  const [transactionFinished, setTransactionFinished] = useState();
  const [selected, setSelected] = useState(false);
  const [itemSelect, setItem] = useState({});
  const reference_code = +Date.now() + Math.floor(Math.random() * 1000000000);
  const amt = itemSelect.amt === undefined ? 0 : itemSelect.amt.substr(1);
  const points =
    itemSelect.unit === undefined ? null : itemSelect.unit.split(' ')[0];
  useFocusEffect(React.useCallback(() => () => undoSelect(), []));
  const undoSelect = () => {
    setItem({});
    setSelected(false);
  };
  const naviTrans = (trxref, message, transaction) => {
    navigation.navigate('TransSummary', {
      amt: itemSelect.amt,
      unit: itemSelect.unit,
      ref: trxref,
      id: transaction,
      message: message
    });
  };
  const makePayment = () => {
    const payment_data = {
      game_plan: `${itemSelect.amt} plan`,
      reference_code: `${reference_code}`,
    };
    dispatch(buyPoints(payment_data));
  };
  const selectedItem = (item) => {
    setItem(item);
    setSelected(true);
  };
  const displayContent = ({ item }) => (
    <Button
      style={{
        ...style.content,
        width: windowWidth - 100,
        backgroundColor: '#054078',
      }}
      onPress={() => selectedItem({ amt: item.amt, unit: item.unit })}>
      <Text style={style.butText}>
        {item.amt} - {item.unit}
      </Text>
    </Button>
  );

  const _keyExtractor = (item, index) => `${index}${item.unit}`;
  return (
    <>
      {selected ? (
        <View style={{ flex: 1, backgroundColor: '#054078' }}>
          <LinearGradient
            colors={['transparent', '#e1efef']}
            style={{ ...style.gradient, height: windowHeight }}
          />
          <View style={style.selectedContainer}>
            <Text style={style.resTitle}>You selected</Text>
            <Text style={style.margin}>
              <Text style={style.unitDisplay}>Unit</Text>
              <Text> - </Text>
              <Text style={style.costDisplay}>{itemSelect.unit}</Text>
            </Text>
            <Text>
              <Text style={style.unitDisplay}>Cost</Text>
              <Text> - </Text>
              <Text style={style.costDisplay}>{itemSelect.amt}</Text>
            </Text>
          </View>
          <View style={style.viewbutton}>
            <View style={{ width: '80%' }}>
              <PaystackWebView
                buttonText="Pay Now"
                showPayButton={false}
                paystackKey={`${paystack.key}`}
                amount={amt}
                billingEmail={paystack.email}
                billingMobile={paystack.mobile}
                billingName={paystack.name}
                refNumber={`${reference_code}`}
                ActivityIndicatorColor="green"
                SafeAreaViewContainer={{ marginTop: 0 }}
                SafeAreaViewContainerModal={{ marginTop: 0 }}
                handleWebViewMessage={(e) => {
                  null
                }}
                onCancel={(e) => {
                  null
                }}
                onSuccess={({ transactionRef }) => {
                  const { trxref, message, transaction } = transactionRef
                  // setTransactionFinished(true);
                  makePayment();
                  dispatch(noPoints(false));
                  dispatch(updateUserinfo({ name: 'points', value: points }));
                  naviTrans(trxref, message, transaction);
                }}
                ref={paystackWebViewRef}
              />
              <Button
                full
                onPress={() => {
                  paystackWebViewRef.current.StartTransaction();
                }}
                style={{ backgroundColor: 'green', marginBottom: 10 }}>
                <Text style={style.mycolor}>Pay Now</Text>
              </Button>
              <Button
                full
                onPress={undoSelect}
                style={{ backgroundColor: '#054078' }}>
                <Text style={style.mycolor}>Back</Text>
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <View style={style.button}>
          <LinearGradient
            colors={['transparent', '#e1efef']}
            style={{ ...style.gradient, height: windowHeight }}
          />
          <View
            style={[
              style.cover,
              { height: windowWidth < windowHeight ? '70%' : '100%' },
            ]}>
            <FlatList
              style={style.flatlist}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              data={dataContent}
              renderItem={displayContent}
              keyExtractor={_keyExtractor}
            />
          </View>
        </View>
      )}

      <Modal
        isVisible={transactionFinished}
        onBackdropPress={() => setTransactionFinished(false)}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}>
        <View style={style.modalContent}>
          <Text>Congrats! you have just purchased {points} units. </Text>
          <TouchableOpacity onPress={() => setTransactionFinished(false)}>
            <View style={style.modalButton}>
              <Text>Ok</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const style = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  flatlist: {
    marginHorizontal: 20,
  },
  cover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: '#054078',
    justifyContent: 'center',
    alignItems: 'center',
  },
  butText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  unitDisplay: {
    fontWeight: '600',
    fontSize: 19,
    color: '#fff',
  },
  costDisplay: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  margin: {
    marginBottom: 15,
  },
  viewbutton: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  mycolor: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Basic;
