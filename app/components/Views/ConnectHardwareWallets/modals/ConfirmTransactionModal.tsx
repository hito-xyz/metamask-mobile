import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button, { ButtonSize, ButtonVariants, ButtonWidthTypes } from '../../../../component-library/components/Buttons/Button';
import { HitoSDKController } from '@hito-wallet/hito-react-native-sdk';

import Modal from 'react-native-modal';
import { useTheme } from '../../../../util/theme';
import ScanSignedTransactionModal from './ScanSignedTransactionModal';
import { INFCState } from '../../../UI/QRHardware/types';
import Engine from '../../../../core/Engine';
import { toChecksumAddress } from 'ethereumjs-util';

const createStyles = (colors: any) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    centeredView: {
      width: '100%',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 8,
    },
    modalView: {
      width: '100%',
      borderRadius: 32,
      padding: 16,
      alignItems: 'center',
      gap: 24,
      backgroundColor: colors.background.default,
    },
    button: {
      height: 50,
      width: '100%',
      borderRadius: 100,
    },
    modalTitle: {
      fontSize: 24,
      textAlign: 'center',
      color: colors.text.default,
    },
    modalSubtitle: {
      fontSize: 14,
      textAlign: 'center',
      maxWidth: 300,
      color: colors.text.default,
    },
    containerView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8
    },
    transactionInfoView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.border.default,
      borderRadius: 8,
      padding: 16
    },
    amountTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    addressTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
    },
    amountCount: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.info.default,
    },
    flexStartContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.border.default,
      margin: 8
    }
  });

interface Props {
  isVisible: boolean;
  NFCState: INFCState;
  onCancel: () => void;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

const ConfirmTransactionModal = ({ onCancel, onSuccess, onFailure, isVisible, NFCState }: Props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isReadyToSign, setReadyToSign] = useState(false);
  const [scanSignedTransactionVisible, setScanSignedTransactionVisible] = useState(false);
  const hitoNFCController = new HitoSDKController();
  const { KeyringController } = Engine.context as any;

  useEffect(() => {
    hitoNFCController.initNFC();
  }, []);


  const handleTransmitUnsigned = async () => {
    const address = toChecksumAddress(NFCState.sign.request?.address!);
    const rawTx =
      NFCState.sign.request?.rawTx!;
    await hitoNFCController.transmitUnsignedEVMTransaction(
      address,
      rawTx
    );
    await KeyringController.transmitUnsignedTransaction(NFCState.sign.request?.requestId!);
    setReadyToSign(true);
  };

  const handleSignedTxData = async (signedTransaction: string) => {
    KeyringController.submitSignedNFCTransaction(NFCState.sign.request?.requestId!, signedTransaction.substring(2));
    onSuccess();
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.7}
      backdropColor={colors.overlay.default}
      animationInTiming={600}
      animationOutTiming={600}
      hideModalContentWhileAnimating
      onModalShow={() => {
      }}
      onModalHide={() => {
      }}
      propagateSwipe
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.containerView}>
            <Text style={styles.modalTitle}>Confirm transaction</Text>
            <Text style={styles.modalSubtitle}>Please confirm that you see the same transaction on your hardware wallet</Text>
          </View>

          <View style={styles.transactionInfoView}>
            <View style={styles.flexStartContainer}>
              <Text style={styles.amountTitle}>Amount: </Text>
              <Text style={styles.amountCount}>0.000119 ETH</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.flexStartContainer}>
              <Text style={styles.amountTitle}>To: </Text>
              <Text style={styles.addressTitle}>0x435d...4dF1</Text>
            </View>
          </View>

          <View style={styles.containerView}>
            {
              isReadyToSign ? (
                <Button
                  variant={ButtonVariants.Primary}
                  style={styles.button}
                  label={'Sign transaction'}
                  size={ButtonSize.Auto}
                  onPress={() => setScanSignedTransactionVisible(true)}
                  width={ButtonWidthTypes.Auto}
                />
              ): (
                <Button
                  variant={ButtonVariants.Primary}
                  style={styles.button}
                  label={'Open NFC connection'}
                  size={ButtonSize.Auto}
                  onPress={handleTransmitUnsigned}
                  width={ButtonWidthTypes.Auto}
                />
              )
            }

            <Button
              variant={ButtonVariants.Secondary}
              style={styles.button}
              label={'Cancel'}
              size={ButtonSize.Auto}
              onPress={onCancel}
              width={ButtonWidthTypes.Auto}
            />
          </View>
        </View>
      </View>
      {/* need to add error alert */}

      <ScanSignedTransactionModal
        visible={scanSignedTransactionVisible}
        onSuccess={handleSignedTxData}
        onError={() => setScanSignedTransactionVisible(false)}
        onCancel={() => setScanSignedTransactionVisible(false)}
      />
    </Modal>
  );
};

export default ConfirmTransactionModal;
