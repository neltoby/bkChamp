import * as React from 'react';
import { IconButton } from 'react-native-paper';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Dialog, Portal, Provider } from 'react-native-paper';

const FlatDialog = ({ visible, setDialogVisible, handleDialogPress, refferal_code }) => {

    return (
      <TouchableWithoutFeedback onPress={() => setDialogVisible(false)}>
        <Provider>
            <View>

                <Portal>
                    <Dialog visible={visible} style={styles.dialog}>
                        <Dialog.Title>Generate refferal code</Dialog.Title>
                        <Dialog.Content>
                            <View style={styles.dialogParagraph}>
                                <Text style={{ paddingTop: 10 }}>Your refferal code is </Text>

                                <Text style={{ paddingTop: 10 }}>{refferal_code}</Text>
                                <IconButton
                                    icon="content-copy"
                                    color='blue'
                                    size={20}
                                    onPress={handleDialogPress}
                                />
                                {/* <TextInput value="r3gn2ihdt4eh5eu" style={styles.textInput} /> */}
                            </View>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    dialog: {
        width: '80%',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
    },
    dialogParagraph: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})

export default FlatDialog;