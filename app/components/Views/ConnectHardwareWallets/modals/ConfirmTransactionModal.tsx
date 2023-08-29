import { colors } from '@metamask/design-tokens';
import { back } from '@react-navigation/compat/lib/typescript/src/NavigationActions';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button, { ButtonSize, ButtonVariants, ButtonWidthTypes } from '../../../../component-library/components/Buttons/Button';
import { HitoSDKController } from '@hito-wallet/hito-react-native-sdk';

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
    maxWidth: 300
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
    borderColor: '#c4c4c4',
    borderRadius: 8,
    padding: 16
  },
  amountTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  amountCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1097FB'
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
    backgroundColor: '#c4c4c4',
    margin: 8
  }
});

interface Props {
  isVisible: boolean;
  onCancel: () => void;
}
const ConfirmTransactionModal = ({ onCancel, isVisible }: Props) => {
  const [isChecked, setChecked] = useState(false); // eslint-disable-line
  const [signedTXData, setTxData] = useState('');
  const hitoNFCController = new HitoSDKController();

  useEffect(() => { 
    hitoNFCController.initNFC();
  }, []);

  const UNSIGNED_TRANSACTION_TEST =
    '0xee818d840b766ae082520894feed146aa5f20bc991a994a1ac2fe0bb75df2bb087038d7ea4c680008083aa36a78080';
  const addressToTransmit = '0xc5EF8B09b40C2129040Cd10399aE3d8126a0B6a5'
  
  const handleTransmitUnsigned = async () => {
    await hitoNFCController.transmitUnsignedEVMTransaction(
      addressToTransmit,
      UNSIGNED_TRANSACTION_TEST,
    );
    setChecked(true);
  };

  const handleScanSigned = async () => {
    try {
      const signedData = await hitoNFCController.scanSignedEVMTransaction();
      if (signedData) {
        setTxData(JSON.stringify(signedData));
        console.log('Signed data', signedData)
      }
    } catch (error) {
      console.error('Error reading NFC:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.containerView}>
            <Text style={modalStyles.modalTitle}>Confirm transaction</Text>
            <Text style={modalStyles.modalSubtitle}>Please confirm that you see the same transaction on your hardware wallet</Text>
          </View>

          <View style={modalStyles.transactionInfoView}>
            <View style={modalStyles.flexStartContainer}>
              <Text style={modalStyles.amountTitle}>Amount: </Text>
              <Text style={modalStyles.amountCount}>0.000119 ETH</Text>
            </View>
            <View style={modalStyles.divider}></View>
            <View style={modalStyles.flexStartContainer}>
              <Text style={modalStyles.amountTitle}>To: </Text>
              <Text style={modalStyles.addressTitle}>0x435d...4dF1</Text>
            </View>
          </View>

          <View style={modalStyles.containerView}>
            {
              isChecked ? (
                <Button
                  variant={ButtonVariants.Primary}
                  style={modalStyles.button}
                  label={'Sign transaction'}
                  size={ButtonSize.Auto}
                  onPress={handleScanSigned}
                  width={ButtonWidthTypes.Auto}
                />
              ): (
                <Button
                  variant={ButtonVariants.Primary}
                  style={modalStyles.button}
                  label={'Open NFC connection'}
                  size={ButtonSize.Auto}
                  onPress={handleTransmitUnsigned}
                  width={ButtonWidthTypes.Auto}
                />
              )
            }
          
            <Button
              variant={ButtonVariants.Secondary}
              style={modalStyles.button}
              label={'Cancel'}
              size={ButtonSize.Auto}
              onPress={onCancel}
              width={ButtonWidthTypes.Auto}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmTransactionModal;