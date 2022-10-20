'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');

function publicProvider() {
  let {
    priority,
    stallTimeout,
    weight
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (chain) {
    if (!chain.rpcUrls.default) return null;
    return {
      chain,
      provider: () => {
        const provider = new ethers.providers.StaticJsonRpcProvider(chain.rpcUrls.default, {
          chainId: chain.id,
          name: chain.network
        });
        return Object.assign(provider, {
          priority,
          stallTimeout,
          weight
        });
      }
    };
  };
}

exports.publicProvider = publicProvider;
