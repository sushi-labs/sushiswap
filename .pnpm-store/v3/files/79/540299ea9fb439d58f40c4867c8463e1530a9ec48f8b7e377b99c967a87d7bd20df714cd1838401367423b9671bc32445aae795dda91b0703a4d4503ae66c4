import SDK from '../sdk';
import { Methods } from '../communication/methods';
import { PostMessageOptions, SDKMessageEvent } from '../types';
import { MessageFormatter } from '../communication/messageFormatter';
import { PermissionsError } from '../types/permissions';

const date = Date.now();

const currentPermissions = [
  {
    parentCapability: 'requestAddressBook',
    invoker: 'http://test.eth',
    date,
  },
];

const messageHandler = (event: SDKMessageEvent) => {
  const requestId = event.data.id;
  const response = MessageFormatter.makeResponse(requestId, currentPermissions, '1.0.0');

  window.parent.postMessage(response, '*');
};

describe('Safe Apps SDK wallet methods', () => {
  const sdkInstance = new SDK();
  let postMessageSpy: jest.SpyInstance<void, [message: any, options?: PostMessageOptions]>;

  beforeEach(() => {
    postMessageSpy = jest.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SDK.wallet.getPermissions', () => {
    test('Should send a valid message to the interface', () => {
      sdkInstance.wallet.getPermissions();

      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.wallet_getPermissions, params: undefined }),
        '*',
      );
    });

    test('should resolve with the current permissions', async () => {
      // @ts-expect-error private method
      sdkInstance.communicator.isValidMessage = (msg) => typeof msg.data.success !== 'undefined';

      window.parent.addEventListener('message', messageHandler);

      const permissions = await sdkInstance.wallet.getPermissions();

      expect(permissions).toMatchObject(currentPermissions);
    });
  });

  describe('SDK.wallet.requestPermissions', () => {
    beforeEach(() => {
      // @ts-expect-error private method
      sdkInstance.communicator.isValidMessage = (msg) => typeof msg.data.success !== 'undefined';
    });

    test('Should send a valid message to the interface', () => {
      sdkInstance.wallet.requestPermissions([{ requestAddressBook: {} }]);

      expect(postMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ method: Methods.wallet_requestPermissions, params: [{ requestAddressBook: {} }] }),
        '*',
      );
    });

    test('should resolve the correct requestPermissions', async () => {
      window.parent.addEventListener('message', messageHandler);

      const permissions = await sdkInstance.wallet.requestPermissions([{ requestAddressBook: {} }]);

      expect(permissions).toMatchObject(currentPermissions);
    });

    test('should fail when the method is not restricted', async () => {
      window.parent.addEventListener('message', messageHandler);

      try {
        await sdkInstance.wallet.requestPermissions([{ getChainInfo: {} }]);
      } catch (error) {
        if (error instanceof PermissionsError) {
          expect(error.code).toEqual(4001);
        }
      }
    });
  });
});
