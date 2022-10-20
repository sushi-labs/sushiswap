import SDK from '../sdk';
import { SafeInfo } from '../types';
import { Methods } from '../communication/methods';
import { PostMessageOptions } from '../types';
import { PermissionsError } from '../types/permissions';
import { Wallet } from '../wallet';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Safe Apps SDK safe methods', () => {
  const sdkInstance = new SDK();
  let postMessageSpy: jest.SpyInstance<void, [message: any, options?: PostMessageOptions]>;

  beforeEach(() => {
    postMessageSpy = jest.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SDK.safe.getInfo', () => {
    test('Should send a valid message to the interface', () => {
      sdkInstance.safe.getInfo();

      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.getSafeInfo, params: undefined }),
        '*',
      );
    });
  });

  describe('SDK.safe.calculateMessageHash', () => {
    test('Should generate correct EIP-191 message hash', () => {
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
      // to test message/hash I signed a test message on rinkeby
      // https://dashboard.tenderly.co/tx/rinkeby/0x9308fb61d9f4282080334e3f35b357fc689e06808b8ad2817536813948e3720d
      const message = 'approve rugpull';
      const expectedHash = '0xe32c44147e358bc973757518210c3baec92de66115c513ea1146d61ad4fd93af';
      const hash = sdkInstance.safe.calculateMessageHash(message);

      expect(hash).toEqual(expectedHash);
    });
  });

  describe('SDK.safe.check1271Signature', () => {
    test('Should send a valid message to the interface', async () => {
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
      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000'; // ethers.utils.formatBytes32String('approve rugpull')
      // @ts-expect-error method is private but we are testing it
      sdkInstance.safe.check1271Signature(message);
      await sleep(200);
      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_call',
            params: [
              {
                to: '0x9C6FEA0B2eAc5b6D8bBB6C30401D42aA95398190',
                data: '0x1626ba7e617070726f76652072756770756c6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
              },
              'latest',
            ],
          },
        }),
        '*',
      );
    });

    test('Should return true if the message is signed and magic value is returned', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const rpcCallSpy = jest.spyOn(sdkInstance.safe.communicator, 'send');
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
      rpcCallSpy.mockImplementationOnce(() =>
        Promise.resolve({
          id: '1',
          success: true,
          data: '0x1626ba7e00000000000000000000000000000000000000000000000000000000',
        }),
      );

      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000'; // ethers.utils.formatBytes32String('approve rugpull')
      // @ts-expect-error method is private but we are testing it
      expect(await sdkInstance.safe.check1271Signature(message)).toEqual(true);
    });

    test('Should return false if the message isnt signed and underlying call reverts', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const rpcCallSpy = jest.spyOn(sdkInstance.safe.communicator, 'send');
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
      rpcCallSpy.mockImplementationOnce(() => Promise.reject(new Error('Hash not approved')));

      const message = '0x68616c6c6f000000000000000000000000000000000000000000000000000000'; // ethers.utils.formatBytes32String('hallo')
      // @ts-expect-error method is private but we are testing it
      expect(await sdkInstance.safe.check1271Signature(message)).toEqual(false);
    });
  });

  describe('SDK.safe.check1271SignatureBytes', () => {
    test('Should send a valid message to the interface', async () => {
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
      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000'; // ethers.utils.formatBytes32String('approve rugpull')
      // @ts-expect-error method is private but we are testing it
      sdkInstance.safe.check1271SignatureBytes(message);
      await sleep(200);
      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_call',
            params: [
              {
                to: '0x9C6FEA0B2eAc5b6D8bBB6C30401D42aA95398190',
                data: '0x20c13b0b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020617070726f76652072756770756c6c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
              },
              'latest',
            ],
          },
        }),
        '*',
      );
    });

    test('Should return true if the message is signed and magic value is returned', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const rpcCallSpy = jest.spyOn(sdkInstance.safe.communicator, 'send');
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
      rpcCallSpy.mockImplementationOnce(() =>
        Promise.resolve({
          id: '1',
          success: true,
          data: '0x20c13b0b00000000000000000000000000000000000000000000000000000000',
        }),
      );

      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000'; // ethers.utils.formatBytes32String('approve rugpull')
      // @ts-expect-error method is private but we are testing it
      expect(await sdkInstance.safe.check1271SignatureBytes(message)).toEqual(true);
    });

    test('Should return false if the message isnt signed and underlying call reverts', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const rpcCallSpy = jest.spyOn(sdkInstance.safe.communicator, 'send');
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
      rpcCallSpy.mockImplementationOnce(() => Promise.reject(new Error('Hash not approved')));

      const message = '0x68616c6c6f000000000000000000000000000000000000000000000000000000'; // ethers.utils.formatBytes32String('hallo')
      // @ts-expect-error method is private but we are testing it
      expect(await sdkInstance.safe.check1271SignatureBytes(message)).toEqual(false);
    });
  });

  describe('SDK.safe.isMessageSigned', () => {
    test('Should call SDK.safe.isMessageHashSigned with a hash of the message', () => {
      const isMessageHashSignedSpy = jest.spyOn(sdkInstance.safe, 'isMessageHashSigned');

      // ethers.utils.formatBytes32String('approve rugpull')
      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000';
      const expectedHash = '0xaae9257b8ff1c926ac3cdf36923661de4e81bf934e38958beeede3519aa18b08';

      sdkInstance.safe.isMessageSigned(message);
      expect(isMessageHashSignedSpy).toHaveBeenCalledWith(expectedHash, '0x');
    });
  });

  describe('SDK.safe.isMessageHashSigned', () => {
    test('Should send call messages to check the message the interface', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      safeInfoSpy.mockImplementation(
        (): Promise<SafeInfo> =>
          Promise.resolve({
            chainId: 4,
            safeAddress: '0x9C6FEA0B2eAc5b6D8bBB6C30401D42aA95398190',
            owners: [],
            threshold: 1,
            isReadOnly: false,
          }),
      );

      const message = '0x617070726f76652072756770756c6c0000000000000000000000000000000000'; // ethers.utils.formatBytes32String('approve rugpull')

      sdkInstance.safe.isMessageHashSigned(message);
      await sleep(200);
      // calling first check1271Signature method
      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_call',
            params: [
              {
                to: '0x9C6FEA0B2eAc5b6D8bBB6C30401D42aA95398190',
                data: '0x1626ba7e617070726f76652072756770756c6c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
              },
              'latest',
            ],
          },
        }),
        '*',
      );
    });

    test('Should return true if check1271Signature return true', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const check1271SignatureSpy = jest.spyOn(sdkInstance.safe, 'check1271Signature');
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
      // @ts-expect-error ts fails to infer the return type because of a private method
      check1271SignatureSpy.mockImplementationOnce(() => Promise.resolve(true));

      // ethers.utils.formatBytes32String('approve rugpull')
      const message = sdkInstance.safe.calculateMessageHash(
        '0x617070726f76652072756770756c6c0000000000000000000000000000000000',
      );
      const signed = await sdkInstance.safe.isMessageHashSigned(message);

      expect(signed).toEqual(true);
    });

    test('Should return true if check1271SignatureBytes return true', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const check1271SignatureSpy = jest.spyOn(sdkInstance.safe, 'check1271Signature');
      // @ts-expect-error method is private but we are testing it
      const check1271SignatureBytesSpy = jest.spyOn(sdkInstance.safe, 'check1271SignatureBytes');
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
      // @ts-expect-error ts fails to infer the return type because of a private method
      check1271SignatureSpy.mockImplementationOnce(() => Promise.resolve(false));
      // @ts-expect-error ts fails to infer the return type because of a private method
      check1271SignatureBytesSpy.mockImplementationOnce(() => Promise.resolve(true));

      // ethers.utils.formatBytes32String('approve rugpull')
      const message = sdkInstance.safe.calculateMessageHash(
        '0x617070726f76652072756770756c6c0000000000000000000000000000000000',
      );
      const signed = await sdkInstance.safe.isMessageHashSigned(message);

      expect(signed).toEqual(true);
    });

    test('Should return false if all of the underlying checks return false', async () => {
      const safeInfoSpy = jest.spyOn(sdkInstance.safe, 'getInfo');
      // @ts-expect-error method is private but we are testing it
      const check1271SignatureSpy = jest.spyOn(sdkInstance.safe, 'check1271Signature');
      // @ts-expect-error method is private but we are testing it
      const check1271SignatureBytesSpy = jest.spyOn(sdkInstance.safe, 'check1271SignatureBytes');
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
      // @ts-expect-error ts fails to infer the return type because of a private method
      check1271SignatureSpy.mockImplementationOnce(() => Promise.resolve(false));
      // @ts-expect-error ts fails to infer the return type because of a private method
      check1271SignatureBytesSpy.mockImplementationOnce(() => Promise.resolve(false));

      // ethers.utils.formatBytes32String('approve rugpull')
      const message = sdkInstance.safe.calculateMessageHash(
        '0x617070726f76652072756770756c6c0000000000000000000000000000000000',
      );
      const signed = await sdkInstance.safe.isMessageHashSigned(message);

      expect(signed).toEqual(false);
    });
  });

  describe('SDK.safe.getBalances', () => {
    test('Should send a valid message to the interface', () => {
      sdkInstance.safe.experimental_getBalances({ currency: 'eur' });

      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.getSafeBalances, params: { currency: 'eur' } }),
        '*',
      );
    });
  });

  describe('SDK.safe.getChainInfo', () => {
    test('Should send a valid message to the interface', () => {
      sdkInstance.safe.getChainInfo();

      expect(postMessageSpy).toHaveBeenCalledWith(expect.objectContaining({ method: Methods.getChainInfo }), '*');
    });
  });

  describe('SDK.safe.requestAddressBook', () => {
    const wrongPermissions = [
      {
        date: 1657713994059,
        invoker: 'https://test.eth',
        parentCapability: 'wrongPermission',
      },
    ];

    const correctPermissions = [
      {
        date: 1657713994059,
        invoker: 'https://test.eth',
        parentCapability: 'requestAddressBook',
      },
    ];

    test('Should call requestAddressBook when the permissions are ok', async () => {
      jest
        .spyOn(Wallet.prototype, 'getPermissions')
        .mockImplementationOnce(jest.fn().mockResolvedValue(correctPermissions));

      sdkInstance.safe.requestAddressBook();

      await sleep(200);

      expect(postMessageSpy).toHaveBeenCalledWith(expect.objectContaining({ method: Methods.requestAddressBook }), '*');
    });

    test('Should call requestPermissions when the current permissions are not ok', async () => {
      jest
        .spyOn(Wallet.prototype, 'getPermissions')
        .mockImplementationOnce(jest.fn().mockResolvedValue(wrongPermissions));

      const requestPermissionsSpy = jest.spyOn(Wallet.prototype, 'requestPermissions');

      sdkInstance.safe.requestAddressBook();

      await sleep(200);

      expect(requestPermissionsSpy).toHaveBeenCalledWith([{ requestAddressBook: {} }]);
    });

    test('Should throw PermissionError when the permissions are not ok', async () => {
      jest
        .spyOn(Wallet.prototype, 'getPermissions')
        .mockImplementationOnce(jest.fn().mockResolvedValue(wrongPermissions));

      jest
        .spyOn(Wallet.prototype, 'requestPermissions')
        .mockImplementationOnce(jest.fn().mockResolvedValue(wrongPermissions));

      try {
        await sdkInstance.safe.requestAddressBook();
      } catch (e) {
        expect(e).toBeInstanceOf(PermissionsError);
      }
    });
  });
});
