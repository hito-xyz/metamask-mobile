import { colors } from '@metamask/design-tokens';
import { back } from '@react-navigation/compat/lib/typescript/src/NavigationActions';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button, { ButtonSize, ButtonVariants, ButtonWidthTypes } from '../../../../component-library/components/Buttons/Button';

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

const ConfirmTransactionModal = ({ opened, close }: { opened: boolean, close: () => void}) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={opened}
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
            <Button
              variant={ButtonVariants.Primary}
              style={modalStyles.button}
              label={'Open NFC connection'}
              size={ButtonSize.Auto}
              onPress={close}
              width={ButtonWidthTypes.Auto}
            />
            <Button
              variant={ButtonVariants.Secondary}
              style={modalStyles.button}
              label={'Cancel'}
              size={ButtonSize.Auto}
              onPress={close}
              width={ButtonWidthTypes.Auto}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmTransactionModal;