import SDK from './index';

describe('Safe apps SDK', () => {
  let sdkInstance: SDK;

  describe('initSdk', () => {
    test('Should initialize with opts', () => {
      sdkInstance = new SDK({ allowedDomains: [/http:\/\/localhost:3000/] });
      expect(sdkInstance.txs.send).not.toBeUndefined();
    });

    test('Should initialize without opts', () => {
      sdkInstance = new SDK();
      expect(sdkInstance.txs.send).not.toBeUndefined();
    });
  });
});
