import React from 'react';
import { Alert, Appearance, Image, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const modalStyles = StyleSheet.create({
  centeredView: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 16,
    alignItems: 'center',
    gap: 24
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1098FC',
  },
  textStyle: {
    color: '#1098FC',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  }
});


const nfc_image = require('../../../../images/nfc.png'); // eslint-disable-line

const ReadyToScanModal = ({ opened, close }: { opened: boolean, close: () => void }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={opened}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Ready to Scan</Text>
          <Image
            source={nfc_image}
            resizeMethod={'auto'}
            testID={`nfc-connect-image`}
          />
          <Text style={modalStyles.modalSubtitle}>Please tap NFC tags</Text>
          <Pressable
            style={modalStyles.button}
            onPress={close}>
            <Text style={modalStyles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ReadyToScanModal;