import { providers } from 'ethers';
import { d as defaultAlchemyApiKey } from '../../../dist/rpcs-8d636858.esm.js';

function alchemyProvider() {
  let {
    apiKey = defaultAlchemyApiKey,
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
        const provider = new providers.AlchemyProvider(chain.id, apiKey);
        return Object.assign(provider, {
          priority,
          stallTimeout,
          weight
        });
      },
      webSocketProvider: () => new providers.AlchemyWebSocketProvider(chain.id, apiKey)
    };
  };
}

export { alchemyProvider };
