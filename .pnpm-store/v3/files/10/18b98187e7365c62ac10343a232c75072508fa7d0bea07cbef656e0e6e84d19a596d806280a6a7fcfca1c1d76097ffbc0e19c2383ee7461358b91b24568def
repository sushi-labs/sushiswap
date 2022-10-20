'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('ethers');

function jsonRpcProvider(_ref) {
  let {
    priority,
    rpc,
    stallTimeout,
    static: static_ = true,
    weight
  } = _ref;
  return function (chain) {
    const rpcConfig = rpc(chain);
    if (!rpcConfig || rpcConfig.http === '') return null;
    return {
      chain: { ...chain,
        rpcUrls: { ...chain.rpcUrls,
          default: rpcConfig.http
        }
      },
      provider: () => {
        var _chain$ens;

        const RpcProvider = static_ ? ethers.providers.StaticJsonRpcProvider : ethers.providers.JsonRpcProvider;
        const provider = new RpcProvider(rpcConfig.http, {
          ensAddress: (_chain$ens = chain.ens) === null || _chain$ens === void 0 ? void 0 : _chain$ens.address,
          chainId: chain.id,
          name: chain.network
        });
        return Object.assign(provider, {
          priority,
          stallTimeout,
          weight
        });
      },
      ...(rpcConfig.webSocket && {
        webSocketProvider: () => new ethers.providers.WebSocketProvider(rpcConfig.webSocket, chain.id)
      })
    };
  };
}

exports.jsonRpcProvider = jsonRpcProvider;
