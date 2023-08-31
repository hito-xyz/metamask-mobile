import React, { Fragment, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fontStyles } from '../../../styles/common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Device from '../../../util/device';
import { useTheme } from '../../../util/theme';
import { ConfirmTransactionModal, ScanHitoAccountModal } from './modals';
import Button, {
  ButtonSize,
  ButtonVariants,
  ButtonWidthTypes,
} from '../../../component-library/components/Buttons/Button';
import { HitoSDKController } from '@hito-wallet/hito-react-native-sdk/index';

interface IConnectHitoWalletViewProps {
  navigation: any;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      marginTop: Device.isIphoneX() ? 50 : 20,
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    navbarRightButton: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      height: 48,
      width: 48,
      flex: 1,
    },
    closeIcon: {
      fontSize: 28,
      color: colors.text.default,
    },
    qrcode: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    error: {
      ...fontStyles.normal,
      fontSize: 14,
      color: colors.red,
    },
    text: {
      color: colors.text.default,
      fontSize: 14,
      ...fontStyles.normal,
    },
    button: {
      marginTop: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const ConnectNFCAlert = ({ navigation }: IConnectHitoWalletViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const ETH_ADDRESS_TEST = '0xF91d6da14A3d18e22adD79f8BF0A8C4D852f8b84';
  const UNSIGNED_TRANSACTION_TEST =
    '0xee818d840b766ae082520894feed146aa5f20bc991a994a1ac2fe0bb75df2bb087038d7ea4c680008083aa36a78080';
  const hitoNFCController = new HitoSDKController();
  const [addressToTransmit, setAddressToTransmit] = useState(ETH_ADDRESS_TEST);
  const [unsignedTXToTransmit, setUnsignedTXToTransmit] = useState(
    UNSIGNED_TRANSACTION_TEST,
  );
  const [signedTXData, setTxData] = useState('');
  const [modalNFCVisible, setModalNFCVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  useEffect(() => {
    hitoNFCController.initNFC();
  });

  const handleTransmitUnsigned = async () => {
    await hitoNFCController.transmitUnsignedEVMTransaction(
      addressToTransmit,
      unsignedTXToTransmit,
    );
  };

  const handleScanSigned = async () => {
    try {
      const signedData = await hitoNFCController.scanSignedEVMTransaction();
      if (signedData) {
        setTxData(JSON.stringify(signedData));
      }
    } catch (error) {
      console.error('Error reading NFC:', error);
    }
  };
  return (
    <Fragment>
      <View style={styles.container}>
        <ScanHitoAccountModal
          opened={modalNFCVisible}
          close={() => setModalNFCVisible(false)}
        />
        {/* <ConfirmTransactionModal
          opened={modalConfirmVisible}
          close={() => setModalConfirmVisible(false)}
        /> */}
        <View style={styles.header}>
          <Icon
            name="qrcode"
            size={42}
            style={styles.qrcode}
            color={colors.text.default}
          />
          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.navbarRightButton}
          >
            <MaterialIcon name="close" size={15} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Open NFC connection'}
            size={ButtonSize.Md}
            onPress={() => setModalNFCVisible(true)}
            width={ButtonWidthTypes.Auto}
          />
        </View>
        <View style={styles.button}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Open Confirm'}
            size={ButtonSize.Md}
            onPress={() => setModalConfirmVisible(true)}
            width={ButtonWidthTypes.Auto}
            isDanger
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Transmit Transaction</Text>
        <Text style={styles.text}>Address</Text>
        <TextInput
          value={addressToTransmit}
          onChangeText={setAddressToTransmit}
          placeholder="Enter address"
          multiline
          numberOfLines={1}
          maxLength={42}
        />
        <Text style={styles.text}>Unsigned transaction</Text>
        <TextInput
          value={unsignedTXToTransmit}
          onChangeText={setUnsignedTXToTransmit}
          placeholder="Enter unsigned transaction"
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <View style={styles.button}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Transmit Unsigned Transaction'}
            size={ButtonSize.Md}
            onPress={handleTransmitUnsigned}
            width={ButtonWidthTypes.Auto}
          />
        </View>

        <Text style={styles.text}>Scan Transaction</Text>
        <Text style={styles.text}>
          {signedTXData ? `Transaction Data: ${signedTXData}` : ''}
        </Text>
        <View style={styles.button}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Scan Signed Transaction'}
            size={ButtonSize.Md}
            onPress={handleScanSigned}
            width={ButtonWidthTypes.Auto}
          />
        </View>
        <View style={styles.button}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Clear'}
            size={ButtonSize.Md}
            onPress={() => setTxData('')}
            width={ButtonWidthTypes.Auto}
            isDanger
          />
        </View>
      </View>
    </Fragment>
  );
};

export default ConnectNFCAlert;
