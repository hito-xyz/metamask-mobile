/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-require-imports: "off" */

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { strings } from '../../../../locales/i18n';
import {
  HITO_LEARN_MORE,
  HITO_SUPPORT,
  HITO_SUPPORT_VIDEO,
} from '../../../constants/urls';
import {
  fontStyles,
  colors as importedColors,
} from '../../../styles/common';
import { useTheme } from '../../../util/theme';
import StyledButton from '../../UI/StyledButton';

interface IConnectQRInstructionProps {
  navigation: any;
  onConnect: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    scrollWrapper: {
      width: '100%',
    },
    title: {
      width: '100%',
      marginTop: 40,
      fontSize: 24,
      marginBottom: 20,
      ...fontStyles.normal,
      color: colors.text.alternative,
    },
    textContainer: {
      width: '100%',
      marginTop: 20,
    },
    text: {
      fontSize: 14,
      marginBottom: 24,
      ...fontStyles.normal,
      color: colors.text.alternative,
    },
    link: {
      color: colors.primary.default,
      ...fontStyles.bold,
    },
    bottom: {
      alignItems: 'center',
      height: 80,
      justifyContent: 'space-between',
    },
    button: {
      padding: 5,
      paddingHorizontal: '30%',
    },
    buttonText: {
      color: importedColors.white,
      ...fontStyles.normal,
    },
    image: {
      width: 300,
      height: 120,
      marginTop: 40,
      marginBottom: 40,
    },
    keystone: {
      height: 48,
      fontSize: 24,
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'row',
    },
    linkMarginRight: {
      marginRight: 16,
    },
  });

const HitoInstruction = (props: IConnectQRInstructionProps) => {
    const { onConnect, navigation } = props;
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const navigateToVideo = () => {
      navigation.navigate('Webview', {
        screen: 'SimpleWebview',
        params: {
          url: HITO_SUPPORT_VIDEO,
          title: strings('connect_hito_wallet.description2'),
        },
      });
    };
    const navigateToLearnMore = () => {
      navigation.navigate('Webview', {
        screen: 'SimpleWebview',
        params: {
          url: HITO_LEARN_MORE,
          title: strings('connect_hito_wallet.keystone'),
        },
      });
    };
    const navigateToTutorial = () => {
      navigation.navigate('Webview', {
        screen: 'SimpleWebview',
        params: {
          url: HITO_SUPPORT,
          title: strings('connect_hito_wallet.description4'),
        },
      });
    };
    
    return (
        <View style={styles.wrapper}>
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollWrapper}
            >
                <Text style={styles.title}>{strings('connect_hito_wallet.title')}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Connect an airgapped hardware wallet that communicates through NFC chip.
                    </Text>
                    <Text style={[styles.text, styles.link]} onPress={navigateToVideo}>
                        {strings('connect_hito_wallet.description2')}
                    </Text>
                    <Text style={styles.text}>
                        {strings('connect_hito_wallet.description3')}
                    </Text>
                    <Text style={styles.keystone}>
                        {strings('connect_hito_wallet.keystone')}
                    </Text>
                    <View style={styles.buttonGroup}>
                        <Text
                            style={[styles.text, styles.link, styles.linkMarginRight]}
                            onPress={navigateToLearnMore}
                        >
                            {strings('connect_hito_wallet.learnMore')}
                        </Text>
                        <Text
                            style={[styles.text, styles.link]}
                            onPress={navigateToTutorial}
                        >
                            {strings('connect_hito_wallet.tutorial')}
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        {strings('connect_hito_wallet.description5')}
                    </Text>
                    <Text style={styles.text}>
                        {strings('connect_hito_wallet.description6')}
                    </Text>
                </View>
                <Text style={styles.text}>
                  Картинка для инструкции
                </Text>
            </ScrollView>
            <View style={styles.bottom}>
                <StyledButton
                    type={'confirm'}
                    onPress={onConnect}
                    style={styles.button}
                >
                    {strings('connect_qr_hardware.button_continue')}
                </StyledButton>
            </View>
        </View>
    );
};

export default HitoInstruction;
