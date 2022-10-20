import { l as Connector, _ as _classPrivateMethodInitSpec, t as _defineProperty, u as _classPrivateFieldInitSpec, n as normalizeChainId, g as getClient, x as _classPrivateMethodGet, U as UserRejectedRequestError, v as _classPrivateFieldGet, w as _classPrivateFieldSet, q as SwitchChainError } from '../../../dist/getProvider-5b4b62c3.esm.js';
import { providers } from 'ethers';
import { getAddress, hexValue } from 'ethers/lib/utils';
import 'zustand/middleware';
import 'zustand/vanilla';
import 'eventemitter3';
import '../../../dist/chains-8c76af1b.esm.js';
import '../../../dist/rpcs-8d636858.esm.js';

/**
 * Wallets that support chain switching through WalletConnect
 * - imToken (token.im)
 * - MetaMask (metamask.io)
 * - Rainbow (rainbow.me)
 */

const switchChainAllowedRegex = /(imtoken|metamask|rainbow)/i;

var _provider = /*#__PURE__*/new WeakMap();

var _switchChain = /*#__PURE__*/new WeakSet();

class WalletConnectConnector extends Connector {
  constructor(config) {
    super(config);

    _classPrivateMethodInitSpec(this, _switchChain);

    _defineProperty(this, "id", 'walletConnect');

    _defineProperty(this, "name", 'WalletConnect');

    _defineProperty(this, "ready", true);

    _classPrivateFieldInitSpec(this, _provider, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "onAccountsChanged", accounts => {
      if (accounts.length === 0) this.emit('disconnect');else this.emit('change', {
        account: getAddress(accounts[0])
      });
    });

    _defineProperty(this, "onChainChanged", chainId => {
      const id = normalizeChainId(chainId);
      const unsupported = this.isChainUnsupported(id);
      this.emit('change', {
        chain: {
          id,
          unsupported
        }
      });
    });

    _defineProperty(this, "onDisconnect", () => {
      this.emit('disconnect');
    });
  }

  async connect() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    try {
      var _provider$connector$p, _provider$connector, _provider$connector$p2;

      let targetChainId = chainId;

      if (!targetChainId) {
        const lastUsedChainId = getClient().lastUsedChainId;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) targetChainId = lastUsedChainId;
      }

      const provider = await this.getProvider({
        chainId: targetChainId,
        create: true
      });
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect); // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available

      setTimeout(() => this.emit('message', {
        type: 'connecting'
      }), 0);
      const accounts = await provider.enable();
      const account = getAddress(accounts[0]);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id); // Not all WalletConnect options support programmatic chain switching
      // Only enable for wallet options that do

      const walletName = (_provider$connector$p = (_provider$connector = provider.connector) === null || _provider$connector === void 0 ? void 0 : (_provider$connector$p2 = _provider$connector.peerMeta) === null || _provider$connector$p2 === void 0 ? void 0 : _provider$connector$p2.name) !== null && _provider$connector$p !== void 0 ? _provider$connector$p : '';
      if (switchChainAllowedRegex.test(walletName)) this.switchChain = _classPrivateMethodGet(this, _switchChain, _switchChain2);
      return {
        account,
        chain: {
          id,
          unsupported
        },
        provider: new providers.Web3Provider(provider)
      };
    } catch (error) {
      if (/user closed modal/i.test(error.message)) throw new UserRejectedRequestError(error);
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    await provider.disconnect();
    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
    typeof localStorage !== 'undefined' && localStorage.removeItem('walletconnect');
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = provider.accounts; // return checksum address

    return getAddress(accounts[0]);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    let {
      chainId,
      create
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Force create new provider
    if (!_classPrivateFieldGet(this, _provider) || chainId || create) {
      var _this$options, _this$options2;

      const rpc = !((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.infuraId) ? this.chains.reduce((rpc, chain) => ({ ...rpc,
        [chain.id]: chain.rpcUrls.default
      }), {}) : {};
      const WalletConnectProvider = (await import('@walletconnect/ethereum-provider')).default;

      _classPrivateFieldSet(this, _provider, new WalletConnectProvider({ ...this.options,
        chainId,
        rpc: { ...rpc,
          ...((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.rpc)
        }
      }));
    }

    return _classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const [provider, account] = await Promise.all([this.getProvider({
      chainId
    }), this.getAccount()]);
    return new providers.Web3Provider(provider).getSigner(account);
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

}

async function _switchChain2(chainId) {
  const provider = await this.getProvider();
  const id = hexValue(chainId);

  try {
    var _this$chains$find;

    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: id
      }]
    });
    return (_this$chains$find = this.chains.find(x => x.id === chainId)) !== null && _this$chains$find !== void 0 ? _this$chains$find : {
      id: chainId,
      name: "Chain ".concat(id),
      network: "".concat(id),
      rpcUrls: {
        default: ''
      }
    };
  } catch (error) {
    const message = typeof error === 'string' ? error : error === null || error === void 0 ? void 0 : error.message;
    if (/user rejected request/i.test(message)) throw new UserRejectedRequestError(error);
    throw new SwitchChainError(error);
  }
}

export { WalletConnectConnector };
