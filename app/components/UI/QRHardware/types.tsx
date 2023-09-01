export interface IQRState {
  sync: {
    reading: boolean;
  };
  sign: {
    request?: {
      requestId: string;
      payload: {
        cbor: string;
        type: string;
      };
    };
  };
}

export interface INFCState {
  sync: {
    reading: boolean;
  };
  sign: {
    request?: {
      requestId: string;
      address: string;
      rawTx: string;
    };
  };
}
