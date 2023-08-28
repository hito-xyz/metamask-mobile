import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Alert, { AlertType } from '../../Base/Alert';
import { fontStyles } from '../../../styles/common';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Device from '../../../util/device';
import { useTheme } from '../../../util/theme';
import HitoInstruction from './HitoInstruction';
import Engine from '../../../core/Engine';
import { QRCodeScannerModal } from './modals';

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

const ConnectHitoWalletView = ({ navigation }: IConnectHitoWalletViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [QRState, setQRState] = useState({
    sync: {
      reading: false,
    },
  });

  // const [accounts, setAccounts] = useState<
  //   { address: string; index: number; balance: string }[]
  // >([]);

  const KeyringController = useMemo(() => {
    const { KeyringController: keyring } = Engine.context as any;
    return keyring;
  }, []);

  const showScanner = useCallback(() => {
    setScannerVisible(true);
  }, []);

  const hideScanner = useCallback(() => {
    setScannerVisible(false);
  }, []);

  const resetError = useCallback(() => {
    setErrorMsg('');
  }, []);

  const subscribeKeyringState = useCallback((storeValue: any) => {
    setQRState(storeValue);
  }, []);

  const onConnectHardware = useCallback(async () => {
    resetError();
    await KeyringController.connectQRHardware(0);
    // const _accounts = await KeyringController.connectQRHardware(0);
    // setAccounts(_accounts);
    // console.log('accounts', _accounts);
  }, [KeyringController, resetError]);

  useEffect(() => {
    let memStore: any;
    KeyringController.getQRKeyringState().then((_memStore: any) => {
      memStore = _memStore;
      memStore.subscribe(subscribeKeyringState);
    });
    return () => {
      if (memStore) {
        memStore.unsubscribe(subscribeKeyringState);
      }
    };
  }, [KeyringController, subscribeKeyringState]);

  useEffect(() => {
    if (QRState.sync.reading) {
      showScanner();
    } else {
      hideScanner();
    }
  }, [QRState.sync, hideScanner, showScanner]);

  const onScanError = useCallback(
    async (error: string) => {
      hideScanner();
      setErrorMsg(error);
      const qrKeyring = await KeyringController.getOrAddQRKeyring();
      qrKeyring.cancelSync();
    },
    [hideScanner, KeyringController],
  );

  const onScanSuccess = useCallback(async (address: string) => {
      const {PreferencesController} = Engine.context as any;
      //TODO: - MAX FEDIN
      try {
        const accountAddress =
          await KeyringController.addNFCHardwareWalletAccount(address);

      } catch (err) {
        console.log('Error: Error adding NFC', err);
      }
      hideScanner();
      resetError();
    },
    [KeyringController, navigation, hideScanner, resetError],
  );

  const renderAlert = () =>
    errorMsg !== '' && (
      <Alert type={AlertType.Error} onPress={resetError}>
        <Text style={styles.error}>{errorMsg}</Text>
      </Alert>
    );

  return (
    <Fragment>
      <View style={styles.container}>
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

        <HitoInstruction
          onConnect={onConnectHardware}
          renderAlert={renderAlert}
          navigation={navigation}
        />

        <QRCodeScannerModal
          visible={scannerVisible}
          purpose={'sync'}
          onScanSuccess={onScanSuccess}
          onScanError={onScanError}
          hideModal={hideScanner}
        />
      </View>
    </Fragment>
  );
};

export default ConnectHitoWalletView;
