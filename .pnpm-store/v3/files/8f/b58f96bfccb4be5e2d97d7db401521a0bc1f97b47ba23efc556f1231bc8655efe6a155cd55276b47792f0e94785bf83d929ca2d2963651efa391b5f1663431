import SDK from '../index';
import { Methods } from '../communication';
import { PastLogsOptions, PostMessageOptions, TransactionConfig } from '../types';

describe('Safe Apps SDK Read RPC Requests', () => {
  const sdkInstance = new SDK({ allowedDomains: [/http:\/\/localhost:3000/] });
  let spy: jest.SpyInstance<void, [message: any, options?: PostMessageOptions]>;

  beforeEach(() => {
    spy = jest.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Methods requiring default block param', () => {
    describe('getBalance', () => {
      it('Should send a valid message to the interface', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getBalance([addr, 'pending']);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getBalance',
              params: [addr, 'pending'],
            },
          }),
          '*',
        );
      });

      it('Should add `latest` as a default block parameter when one is not passed', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getBalance([addr]);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getBalance',
              params: [addr, 'latest'],
            },
          }),
          '*',
        );
      });
    });

    describe('getCode', () => {
      it('Should send a valid message to the interface', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getCode([addr, 'pending']);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getCode',
              params: [addr, 'pending'],
            },
          }),
          '*',
        );
      });

      it('Should add `latest` as a default block parameter when one is not passed', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getCode([addr]);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getCode',
              params: [addr, 'latest'],
            },
          }),
          '*',
        );
      });
    });

    describe('getStorageAt', () => {
      it('Should send a valid message to the interface', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getStorageAt([addr, 0, 'earliest']);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getStorageAt',
              params: [addr, '0x0', 'earliest'],
            },
          }),
          '*',
        );
      });

      it('Should add `latest` as a default block parameter when one is not passed', () => {
        const addr = '0x0000000000000000000000000000000000000000';
        sdkInstance.eth.getStorageAt([addr, 0]);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_getStorageAt',
              params: [addr, '0x0', 'latest'],
            },
          }),
          '*',
        );
      });
    });

    describe('call', () => {
      it('Should send a valid message to the interface', () => {
        const config: TransactionConfig = {
          from: '0x0000000000000000000000000000000000000000',
          to: '0x0000000000000000000000000000000000000000',
        };
        sdkInstance.eth.call([config, 'pending']);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_call',
              params: [config, 'pending'],
            },
          }),
          '*',
        );
      });

      it('Should add `latest` as a default block parameter when one is not passed', () => {
        const config: TransactionConfig = {
          from: '0x0000000000000000000000000000000000000000',
          to: '0x0000000000000000000000000000000000000000',
        };
        sdkInstance.eth.call([config]);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            method: Methods.rpcCall,
            params: {
              call: 'eth_call',
              params: [config, 'latest'],
            },
          }),
          '*',
        );
      });
    });
  });

  describe('getPastLogs', () => {
    it('Should send a valid message to the interface', () => {
      const number = 11054275;
      const params: [PastLogsOptions] = [
        {
          fromBlock: number,
          toBlock: 'latest',
        },
      ];
      sdkInstance.eth.getPastLogs(params);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getLogs',
            params,
          },
        }),
        '*',
      );
    });
  });

  describe('getBlockByHash', () => {
    it('Should send a valid message to the interface', () => {
      const hash = '0x1955a9f306903669e295196752b11bc0dee33b48cabdf44b1103b7cea086cae7';
      sdkInstance.eth.getBlockByHash([hash]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getBlockByHash',
            params: [hash, false],
          },
        }),
        '*',
      );
    });

    it('Should respect passed full tx object boolean param', () => {
      const hash = '0x1955a9f306903669e295196752b11bc0dee33b48cabdf44b1103b7cea086cae7';
      sdkInstance.eth.getBlockByHash([hash, true]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getBlockByHash',
            params: [hash, true],
          },
        }),
        '*',
      );
    });
  });

  describe('getBlockByNumber', () => {
    it('Should send a valid message to the interface', () => {
      const number = 11054275;
      sdkInstance.eth.getBlockByNumber([number]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getBlockByNumber',
            params: ['0xa8acc3', false],
          },
        }),
        '*',
      );
    });

    it('Should respect passed full tx object boolean param', () => {
      const number = 11054275;
      sdkInstance.eth.getBlockByNumber([number, true]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getBlockByNumber',
            params: ['0xa8acc3', true],
          },
        }),
        '*',
      );
    });

    it('Should accept "latest" as an argument for block number', () => {
      sdkInstance.eth.getBlockByNumber(['latest', true]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getBlockByNumber',
            params: ['latest', true],
          },
        }),
        '*',
      );
    });
  });

  describe('getTransactionByHash', () => {
    it('Should send a valid message to the interface', () => {
      const hash = '0x0e6cd6237b4d3e5c3f348b78399f031b527e832bd30924951ba4921cdbf440d7';
      sdkInstance.eth.getTransactionByHash([hash]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getTransactionByHash',
            params: [hash],
          },
        }),
        '*',
      );
    });
  });

  describe('getTransactionReceipt', () => {
    it('Should send a valid message to the interface', () => {
      const hash = '0x0e6cd6237b4d3e5c3f348b78399f031b527e832bd30924951ba4921cdbf440d7';
      sdkInstance.eth.getTransactionReceipt([hash]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getTransactionReceipt',
            params: [hash],
          },
        }),
        '*',
      );
    });
  });

  describe('getTransactionCount', () => {
    it('Should send a valid message to the interface', () => {
      const addr = '0x0000000000000000000000000000000000000000';
      sdkInstance.eth.getTransactionCount([addr, 'pending']);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getTransactionCount',
            params: [addr, 'pending'],
          },
        }),
        '*',
      );
    });

    it('Should add `latest` as a default block parameter when one is not passed', () => {
      const addr = '0x0000000000000000000000000000000000000000';
      sdkInstance.eth.getTransactionCount([addr]);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_getTransactionCount',
            params: [addr, 'latest'],
          },
        }),
        '*',
      );
    });
  });

  describe('gasPrice', () => {
    it('Should send a valid message to the interface', () => {
      sdkInstance.eth.getGasPrice();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: Methods.rpcCall,
          params: {
            call: 'eth_gasPrice',
            params: [],
          },
        }),
        '*',
      );
    });
  });
});
