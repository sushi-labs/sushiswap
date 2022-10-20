'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');
var rpcs = require('../../../dist/rpcs-d2cd65f1.cjs.dev.js');

function alchemyProvider() {
  let {
    apiKey = rpcs.defaultAlchemyApiKey,
    priority,
    stallTimeout,
    weight
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (chain) {
    if (!chain.rpcUrls.alchemy) return null;
    return {
      chain: { ...chain,
        rpcUrls: { ...chain.rpcUrls,
          default: "".concat(chain.rpcUrls.alchemy, "/").concat(apiKey)
        }
      },
      provider: () => {
        const provider = new ethers.providers.AlchemyProvider(chain.id, apiKey);
        return Object.assign(provider, {
          priority,
          stallTimeout,
          weight
        });
      },
      webSocketProvider: () => new ethers.providers.AlchemyWebSocketProvider(chain.id, apiKey)
    };
  };
}

exports.alchemyProvider = alchemyProvider;
