/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-require-imports: "off" */

'use strict';
import React, { useCallback } from 'react';
import {
  SafeAreaView,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { colors, fontStyles } from '../../../../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { on } from 'events';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
  },
  preview: {
    flex: 1,
  },
  innerView: {
    flex: 1,
  },
  closeIcon: {
    marginTop: 20,
    marginRight: 20,
    width: 40,
    alignSelf: 'flex-end',
  },
  frame: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 100,
    opacity: 0.5,
  },
});

const frameImage = require('images/frame.png'); // eslint-disable-line import/no-commonjs

interface Props {
  visible: boolean;
  onSuccess: (signedTxData: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const ScanSignedTransactionModal = (props: Props) => {
  const { visible, onSuccess, onError, onCancel } = props;

  const onBarCodeRead = useCallback(
    (response) => {
      if (!response.data) {
        onError('Invalid QR code');
        return;
      }
      const regex = /\/tx\/#!([0-9a-fA-F]+)/;
      const result = response.data.match(regex);

      if (result) {
        onSuccess(result[1]);
      }

      onError('Invalid QR code');
    },
    [onSuccess, onError],
  );

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      onModalHide={() => {}}
      onModalWillShow={() => {}}
    >
      <View style={styles.container}>
        <RNCamera
          onMountError={(error) => onError(error.message)}
          captureAudio={false}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Scan signed transaction',
            message: 'Scan signed transaction',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          <SafeAreaView style={styles.innerView}>
            <TouchableOpacity style={styles.closeIcon} onPress={onCancel}>
              <Icon name={'ios-close'} size={50} color={'white'} />
            </TouchableOpacity>
            <Image source={frameImage} style={styles.frame} />
          </SafeAreaView>
        </RNCamera>
      </View>
    </Modal>
  );
};

export default ScanSignedTransactionModal;
