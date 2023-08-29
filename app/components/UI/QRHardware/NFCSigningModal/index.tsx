import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { IQRState } from '../types';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRSigningDetails from '../QRSigningDetails';
import { useTheme } from '../../../../util/theme';
import { useDispatch, useSelector } from 'react-redux';
import { getNormalizedTxState } from '../../../../util/transactions';
import { resetTransaction } from '../../../../actions/transaction';
import ActionView from '../../ActionView';
import { HitoSDKController } from '@hito-wallet/hito-react-native-sdk';
import Button, {
  ButtonSize,
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../../component-library/components/Buttons/Button';

interface INFCSigningModalProps {
  isVisible: boolean;
  props: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  onFailure?: (error: string) => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    contentWrapper: {
      justifyContent: 'flex-end',
      height: 600,
      backgroundColor: colors.background.default,
      paddingTop: 24,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
  });

const NFCSigningModal = ({
  isVisible,
  props,
  onSuccess,
  onCancel,
  onFailure,
}: INFCSigningModalProps) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const [signedTXData, setTxData] = useState('');
  const [isModalCompleteShow, setModalCompleteShow] = useState(false);
  const { from } = useSelector(getNormalizedTxState);
  const hitoNFCController = new HitoSDKController();
  
  const handleCancel = () => {
    onCancel?.();
    dispatch(resetTransaction());
  };
  const handleSuccess = () => {
    onSuccess?.();
    dispatch(resetTransaction());
  };

  const handleFailure = (error: string) => {
    onFailure?.(error);
    dispatch(resetTransaction());
  };

  useEffect(() => { 
    hitoNFCController.initNFC();
    handleScanSigned()
  }, []);

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
        setModalCompleteShow(true);
      }}
      onModalHide={() => {
        setModalCompleteShow(false);
      }}
      propagateSwipe
    >
      <View style={styles.contentWrapper}>
        <Fragment>
          <ScrollView >
            <View>
              <Text>
                Test pizda {props.transactionType}
              </Text>
              <Button
                variant={ButtonVariants.Secondary}
                label={'Cancel'}
                size={ButtonSize.Md}
                onPress={handleCancel}
                width={ButtonWidthTypes.Auto}
              />
              <Button
                variant={ButtonVariants.Primary}
                label={'Transmit Unsigned Transaction'}
                size={ButtonSize.Md}
                onPress={handleScanSigned}
                width={ButtonWidthTypes.Auto}
              />
            </View>
          </ScrollView>
       </Fragment>
      </View>
    </Modal>
  );
};

export default NFCSigningModal;
