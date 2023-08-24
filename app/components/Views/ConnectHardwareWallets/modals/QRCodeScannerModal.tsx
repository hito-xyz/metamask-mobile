/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-require-imports: "off" */

'use strict';
import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { colors, fontStyles } from '../../../../styles/common';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';


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
  text: {
    flex: 1,
    fontSize: 17,
    color: colors.white,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  hint: {
    backgroundColor: colors.whiteTransparent,
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    width: 240,
    maxWidth: '80%',
    color: colors.black,
    textAlign: 'center',
    fontSize: 16,
    ...fontStyles.normal,
  },
  bold: {
    ...fontStyles.bold,
  },
});

const frameImage = require('images/frame.png'); // eslint-disable-line import/no-commonjs

interface AnimatedQRScannerProps {
  visible: boolean;
  purpose: 'sync' | 'sign';
  onScanSuccess: (address: string) => void;
  onScanError: (error: string) => void;
  hideModal: () => void;
  pauseQRCode?: (x: boolean) => void;
}

const AnimatedQRScannerModal = (props: AnimatedQRScannerProps) => {
  const {
    visible,
    onScanError,
    purpose,
    onScanSuccess,
    hideModal,
    pauseQRCode,
  } = props;


  const onBarCodeRead = useCallback((response) => {
    if (response.data.split(':')[0] === 'ethereum') {
      onScanSuccess(response.data);
    } else {
      onScanError('Invalid QR code');
    }
  }, []);

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      onModalHide={() => {
        pauseQRCode?.(false);
      }}
      onModalWillShow={() => pauseQRCode?.(true)}
    >
      <View style={styles.container}>
        <RNCamera
          onMountError={(error) => {
            console.log('onMountError', error);
          }}
          captureAudio={false}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Zdarova zaibal Title',
            message: 'Zdarova zaibal message',
            buttonPositive: 'Zdarova Ok',
            buttonNegative: 'Zdarova Cancel',
          }}
          onStatusChange={(e) => {
            console.log('onStatusChange', e)
          }}
        >
          <SafeAreaView style={styles.innerView}>
            <TouchableOpacity style={styles.closeIcon} onPress={hideModal}>
              <Icon name={'ios-close'} size={50} color={'white'} />
            </TouchableOpacity>
            <Image source={frameImage} style={styles.frame} />
          </SafeAreaView>
        </RNCamera>
      </View>
    </Modal>
  );
};

export default AnimatedQRScannerModal;
