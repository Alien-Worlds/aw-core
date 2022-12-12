import 'reflect-metadata';

import { isEosRpcSource } from '../eos-rpc.utils';

describe('EosRpc source Unit tests', () => {
  it('"isEosRpcSource" should return true when given instance implements EosRpcSource interface', () => {
    const source = {
      getTableRows: () => {},
      getContractStats: () => {},
    }
    expect(isEosRpcSource(source)).toBeTruthy();
  });
  
  it('"isEosRpcSource" should return false when given instance does not implement EosRpcSource interface', () => {
    const source = {
      getTableRows: () => {},
      getFoo: () => {},
    }
    expect(isEosRpcSource(source)).toBeFalsy();
  });
});
