'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');
var rpcs = require('../../../dist/rpcs-d2cd65f1.cjs.dev.js');

function infuraProvider() {
  let {
    apiKey = rpcs.defaultInfuraApiKey,
    priority,
    stallTimeout,
    weight
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (chain) {
    if (!chain.rpcUrls.infura) return null;
    return {
      chain: { ...chain,
        rpcUrls: { ...chain.rpcUrls,
          default: "".concat(chain.rpcUrls.infura, "/").concat(apiKey)
        }
      },
      provider: () => {
        const provider = new ethers.providers.InfuraProvider(chain.id, apiKey);
        return Object.assign(provider, {
          priority,
          stallTimeout,
          weight
        });
      },
      webSocketProvider: () => new ethers.providers.InfuraWebSocketProvider(chain.id, apiKey)
    };
  };
}

exports.infuraProvider = infuraProvider;
