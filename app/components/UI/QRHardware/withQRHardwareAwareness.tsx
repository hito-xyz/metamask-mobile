import React, { useState, useEffect, useRef, ComponentClass } from 'react';
import Engine from '../../../core/Engine';
import { INFCState, IQRState } from './types';

const withQRHardwareAwareness = (
  Children: ComponentClass<{
    QRState?: IQRState;
    NFCState?: INFCState;
    isSigningQRObject?: boolean;
    isSyncingQRHardware?: boolean;
    isSigningNFCObject?: boolean;
  }>
) => {
  const QRHardwareAwareness = (props: any) => {
    const keyringState: any = useRef();
    const [nfcState, setNFCState] = useState<INFCState>(
      {
        sync: {
          reading: false
        },
        sign: {}
      }
    );

    const [QRState, SetQRState] = useState<IQRState>({
      sync: {
        reading: false
      },
      sign: {}
    });

    const [NFCState, SetNFCState] = useState<INFCState>(
      {
        sync: {
          reading: false
        },
        sign: {}
      }
    );

    const subscribeKeyringState = (value: any) => {
      SetQRState(value);
    };

    const subscribeNFCState = (value: INFCState) => {
      console.log(`State has changed: ${value.sign.request?.requestId}, ${value.sign.request?.address}, ${value.sign.request?.rawTx}`);
      SetNFCState(value);
    };


    useEffect(() => {
      const { KeyringController } = Engine.context as any;
      KeyringController.getQRKeyringState().then((store: any) => {
        keyringState.current = store;
        keyringState.current.subscribe(subscribeKeyringState);
      });
      return () => {
        if (keyringState.current) {
          keyringState.current.unsubscribe(subscribeKeyringState);
        }
      };
    }, []);

    useEffect(() => {
      const { KeyringController } = Engine.context as any;
      KeyringController.getNFCKeyringState().then((store: any) => {
        keyringState.current = store;
        keyringState.current.subscribe(subscribeNFCState);
      });
      return () => {
        if (keyringState.current) {
          keyringState.current.unsubscribe(subscribeNFCState);
        }
      };
    }, []);
    return (
      <Children
        {...props}
        isSigningQRObject={!!QRState.sign?.request}
        isSyncingQRHardware={QRState.sync.reading}
        isSigningNFCObject={NFCState.sign.request}
        NFCState={NFCState}
        QRState={QRState}
      />
    );
  };

  return QRHardwareAwareness;
};

export default withQRHardwareAwareness;
