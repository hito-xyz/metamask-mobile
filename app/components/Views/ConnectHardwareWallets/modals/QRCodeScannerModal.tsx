/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-require-imports: "off" */

'use strict';
import React, { useCallback, useState } from 'react';
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
import { strings } from '../../../../../locales/i18n';

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

const QRCodeScannerModal = (props: AnimatedQRScannerProps) => {
  const { visible, onScanError, onScanSuccess, hideModal, pauseQRCode } = props;

  const onBarCodeRead = (response: any) => {
    if (!visible) {
      return;
    }
    if (!response.data) {
      return;
    }
    const chain = response.data.split(':')[0];
    const address = response.data.split(':')[1];

    if (chain === 'ethereum') {
      onScanSuccess(address);
    } else {
      onScanError(strings('transaction.unknown_qr_code'));
    } 
  };
  
  const onStatusChange = useCallback(
    (event) => {
      if (event.cameraStatus === 'NOT_AUTHORIZED') {
        onScanError(strings('transaction.no_camera_permission'));
      }
    },
    [onScanError],
  );

  const onError = useCallback(
    (error) => {
      if (onScanError && error) {
        onScanError(error.message);
      }
    },
    [ onScanError],
  );

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
          onMountError={onError}
          captureAudio={false}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: strings('qr_scanner.allow_camera_dialog_title'),
            message: strings('qr_scanner.allow_camera_dialog_message'),
            buttonPositive: strings('qr_scanner.ok'),
            buttonNegative: strings('qr_scanner.cancel'),
          }}
          onStatusChange={onStatusChange}
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

export default QRCodeScannerModal;
