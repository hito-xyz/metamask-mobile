// Third party dependencies.
import React, { Fragment, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// External dependencies.
import SheetHeader from '../../../component-library/components/Sheet/SheetHeader';
import AccountAction from '../AccountAction/AccountAction';
import { IconName } from '../../../component-library/components/Icons/Icon';
import { strings } from '../../../../locales/i18n';
import AnalyticsV2 from '../../../util/analyticsV2';
import { MetaMetricsEvents } from '../../../core/Analytics';



interface IConnectHardwareWalletsDrawerProps {
    onBack: () => void;
}

const ConnectHardwareWalletsDrawer = ({ onBack }: IConnectHardwareWalletsDrawerProps) => {
    const { navigate } = useNavigation();

    const openConnectKeystoneWallet = useCallback(() => {
        navigate('ConnectQRHardwareFlow');
        onBack()
        AnalyticsV2.trackEvent(MetaMetricsEvents.CONNECT_HARDWARE_WALLET, {});
    }, [navigate]);


    const openConnectHitoWallet = useCallback(() => {
        navigate('ConnectHitoWalletFlow');
        onBack()
    }, [navigate]);
    
    return (
        <Fragment>
            <SheetHeader
                title={strings('account_actions.add_hardware_wallet')}
                onBack={onBack}
            />
            <View>
                <AccountAction
                    actionTitle={'Keystone Wallet'}
                    iconName={IconName.Keystone}
                    onPress={openConnectKeystoneWallet}
                />
                <AccountAction
                    actionTitle={'Hito Wallet'}
                    iconName={IconName.Hito}
                    onPress={openConnectHitoWallet}
                />
            </View>
        </Fragment>
    );
};

export default ConnectHardwareWalletsDrawer;