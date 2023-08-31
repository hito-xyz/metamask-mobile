import React, { useState, useEffect, useRef, ComponentClass } from 'react';
import Engine from '../../../core/Engine';
import { IQRState } from './types';

const withQRHardwareAwareness = (
  Children: ComponentClass<{
    QRState?: IQRState;
    isSigningQRObject?: boolean;
    isSyncingQRHardware?: boolean;
    nfcTransaction?: any
  }>,
) => {
  const QRHardwareAwareness = (props: any) => {
    const keyringState: any = useRef();
    const [nfcState, setNFCState] = useState<any>(null)

    const [QRState, SetQRState] = useState<IQRState>({
      sync: {
        reading: false,
      },
      sign: {},
    });

    const subscribeKeyringState = (value: any) => {
      SetQRState(value);
    };

    useEffect(() => {
      const { KeyringController } = Engine.context as any;
      KeyringController.getQRKeyringState().then((store: any) => {
        keyringState.current = store;
        keyringState.current.subscribe(subscribeKeyringState);
      });

      const { HitoSDKController } = Engine.context as any;

      

      return () => {
        if (keyringState.current) {
          keyringState.current.unsubscribe(subscribeKeyringState);
        }
      };
    }, []);

    return (
      <Children
        {...props}
        isSigningQRObject={!!QRState.sign?.request}
        isSyncingQRHardware={QRState.sync.reading}
        nfcTransaction={nfcState}
        QRState={QRState}
      />
    );
  };

  return QRHardwareAwareness;
};

export default withQRHardwareAwareness;
