import { SDKMessageEvent } from './../types/messaging';
import { Methods } from './methods';
import PostMessageCommunicator from './';
import { MessageFormatter } from './messageFormatter';

describe('PostMessageCommunicator', () => {
  test('Throws in case of an error response', async () => {
    const error = 'Problem processing the request';
    const messageHandler = (event: SDKMessageEvent) => {
      const requestId = event.data.id;
      const response = MessageFormatter.makeErrorResponse(requestId, error, '1.0.0');

      window.parent.postMessage(response, '*');
    };
    window.parent.addEventListener('message', messageHandler);

    const communicator = new PostMessageCommunicator();
    // @ts-expect-error mock isValidMessage because source check couldn't be passed otherwise, filter out requests
    communicator.isValidMessage = (msg) => typeof msg.data.success !== 'undefined';

    await expect(communicator.send(Methods.getSafeInfo, undefined)).rejects.toThrow(error);
    window.removeEventListener('message', messageHandler);
  });
});
