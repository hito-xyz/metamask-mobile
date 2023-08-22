import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedQRScannerModal from '../../UI/QRHardware/AnimatedQRScanner';
import Icon from 'react-native-vector-icons/FontAwesome';
import BlockingActionModal from '../../UI/BlockingActionModal';
import { strings } from '../../../../locales/i18n';
import Alert, { AlertType } from '../../Base/Alert';
import { fontStyles } from '../../../styles/common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Device from '../../../util/device';
import { useTheme } from '../../../util/theme';
import HitoInstruction from './HitoInstruction';
import { ConfirmTransactionModal, ReadyToScanModal } from './modals';
import Button, { ButtonSize, ButtonVariants, ButtonWidthTypes } from '../../../component-library/components/Buttons/Button';

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
  });

const ConnectNFCAlert = ({ navigation }: IConnectHitoWalletViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [modalNFCVisible, setModalNFCVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  
  return (
    <Fragment>
      <View style={styles.container}>
        <ReadyToScanModal opened={modalNFCVisible} close={() => setModalNFCVisible(false)} />
        <ConfirmTransactionModal opened={modalConfirmVisible} close={() => setModalConfirmVisible(false)} />
        <View style={styles.header}>
          <Icon
            name='qrcode'
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

        <View style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant={ButtonVariants.Primary}
            label={'Open NFC connection'}
            size={ButtonSize.Md}
            onPress={() => setModalNFCVisible(true)}
            width={ButtonWidthTypes.Auto}
          />
        </View>
        <View style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    </Fragment>
  );
};

export default ConnectNFCAlert;