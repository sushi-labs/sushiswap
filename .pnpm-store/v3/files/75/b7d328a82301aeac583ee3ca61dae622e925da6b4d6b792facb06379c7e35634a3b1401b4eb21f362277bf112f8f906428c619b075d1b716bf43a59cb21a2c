import SDK, { SafeInfo } from '../index';
import { Methods } from '../communication/methods';
import { PostMessageOptions } from '../types';

describe('Safe Apps SDK transaction methods', () => {
  const sdkInstance = new SDK();
  let spy: jest.SpyInstance<void, [message: any, options?: PostMessageOptions]>;

  beforeEach(() => {
    spy = jest.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SDK.txs.send', () => {
    test('Should throw an error when passing an empty array', async () => {
      await expect(sdkInstance.txs.send({ txs: [] })).rejects.toEqual(new Error('No transactions were passed'));
    });

    test('Should call window.parent.postMessage when passing array of TXs', () => {
      const txs = [{ to: 'address', value: '0', data: '0x' }];

      sdkInstance.txs.send({ txs });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.sendTransactions, params: { txs, params: undefined } }),
        '*',
      );
    });

    test('Should include passed params to a message body', () => {
      const txs = [{ to: 'address', value: '0', data: '0x' }];
      const params = { safeTxGas: 5000 };

      sdkInstance.txs.send({ txs, params });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.sendTransactions, params: { txs, params } }),
        '*',
      );
    });
  });

  describe('SDK.txs.getBySafeTxHash', () => {
    test('Should throw an error when passing invalid hash', async () => {
      await expect(sdkInstance.txs.getBySafeTxHash('')).rejects.toEqual(new Error('Invalid safeTxHash'));
    });

    test('Should include passed params to a message body', () => {
      const safeTxHash = 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a';

      sdkInstance.txs.getBySafeTxHash(safeTxHash);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.getTxBySafeTxHash, params: { safeTxHash } }),
        '*',
      );
    });
  });

  describe('SDK.txs.signMessage', () => {
    test('Should include params with non-hashed message to the message body', () => {
      const message = 'approve rugpull';

      sdkInstance.txs.signMessage(message);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.signMessage, params: { message } }),
        '*',
      );
    });

    test('Should include params with non-hashed message to the typed message body', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      safeInfoSpy.mockImplementationOnce(
        (): Promise<SafeInfo> =>
          Promise.resolve({
            chainId: 4,
            safeAddress: '0x9C6FEA0B2eAc5b6D8bBB6C30401D42aA95398190',
            owners: [],
            threshold: 1,
            isReadOnly: false,
          }),
      );

      const domain = {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      };

      const types = {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      };

      const message = {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      };

      const typedData = {
        types,
        domain,
        message,
      };

      sdkInstance.txs.signTypedMessage(typedData);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.signTypedMessage,
          params: { typedData },
        }),
        '*',
      );
    });

    test('Should throw error to the invalid JSON message', async () => {
      await expect(async () => {
        // @ts-expect-error we're testing invalid JSON
        await sdkInstance.txs.signTypedMessage('{{"test":"test1"}');
      }).rejects.toThrow();
    });

    test('Should throw error to the invalid typed message', async () => {
      await expect(async () => {
        // @ts-expect-error we're testing invalid typed message
        await sdkInstance.txs.signTypedMessage('{"test":"test1"}');
      }).rejects.toThrow();
    });
  });
});
