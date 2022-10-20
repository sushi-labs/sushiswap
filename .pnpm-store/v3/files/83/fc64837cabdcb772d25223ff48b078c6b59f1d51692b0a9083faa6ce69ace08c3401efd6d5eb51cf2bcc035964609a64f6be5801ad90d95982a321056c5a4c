'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getProvider = require('../../../dist/getProvider-ad4ce6a4.cjs.prod.js');
var ethers = require('ethers');
var utils = require('ethers/lib/utils');
require('zustand/middleware');
require('zustand/vanilla');
require('eventemitter3');
require('../../../dist/chains-789e0c2e.cjs.prod.js');
require('../../../dist/rpcs-edec227e.cjs.prod.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

/**
 * Wallets that support chain switching through WalletConnect
 * - imToken (token.im)
 * - MetaMask (metamask.io)
 * - Rainbow (rainbow.me)
 */

const switchChainAllowedRegex = /(imtoken|metamask|rainbow)/i;

var _provider = /*#__PURE__*/new WeakMap();

var _switchChain = /*#__PURE__*/new WeakSet();

class WalletConnectConnector extends getProvider.Connector {
  constructor(config) {
    super(config);

    getProvider._classPrivateMethodInitSpec(this, _switchChain);

    getProvider._defineProperty(this, "id", 'walletConnect');

    getProvider._defineProperty(this, "name", 'WalletConnect');

    getProvider._defineProperty(this, "ready", true);

    getProvider._classPrivateFieldInitSpec(this, _provider, {
      writable: true,
      value: void 0
    });

    getProvider._defineProperty(this, "onAccountsChanged", accounts => {
      if (accounts.length === 0) this.emit('disconnect');else this.emit('change', {
        account: utils.getAddress(accounts[0])
      });
    });

    getProvider._defineProperty(this, "onChainChanged", chainId => {
      const id = getProvider.normalizeChainId(chainId);
      const unsupported = this.isChainUnsupported(id);
      this.emit('change', {
        chain: {
          id,
          unsupported
        }
      });
    });

    getProvider._defineProperty(this, "onDisconnect", () => {
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
        const lastUsedChainId = getProvider.getClient().lastUsedChainId;
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
      const account = utils.getAddress(accounts[0]);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id); // Not all WalletConnect options support programmatic chain switching
      // Only enable for wallet options that do

      const walletName = (_provider$connector$p = (_provider$connector = provider.connector) === null || _provider$connector === void 0 ? void 0 : (_provider$connector$p2 = _provider$connector.peerMeta) === null || _provider$connector$p2 === void 0 ? void 0 : _provider$connector$p2.name) !== null && _provider$connector$p !== void 0 ? _provider$connector$p : '';
      if (switchChainAllowedRegex.test(walletName)) this.switchChain = getProvider._classPrivateMethodGet(this, _switchChain, _switchChain2);
      return {
        account,
        chain: {
          id,
          unsupported
        },
        provider: new ethers.providers.Web3Provider(provider)
      };
    } catch (error) {
      if (/user closed modal/i.test(error.message)) throw new getProvider.UserRejectedRequestError(error);
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

    return utils.getAddress(accounts[0]);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = getProvider.normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    let {
      chainId,
      create
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Force create new provider
    if (!getProvider._classPrivateFieldGet(this, _provider) || chainId || create) {
      var _this$options, _this$options2;

      const rpc = !((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.infuraId) ? this.chains.reduce((rpc, chain) => ({ ...rpc,
        [chain.id]: chain.rpcUrls.default
      }), {}) : {};
      const WalletConnectProvider = (await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@walletconnect/ethereum-provider')); })).default;

      getProvider._classPrivateFieldSet(this, _provider, new WalletConnectProvider({ ...this.options,
        chainId,
        rpc: { ...rpc,
          ...((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.rpc)
        }
      }));
    }

    return getProvider._classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const [provider, account] = await Promise.all([this.getProvider({
      chainId
    }), this.getAccount()]);
    return new ethers.providers.Web3Provider(provider).getSigner(account);
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
  const id = utils.hexValue(chainId);

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
    if (/user rejected request/i.test(message)) throw new getProvider.UserRejectedRequestError(error);
    throw new getProvider.SwitchChainError(error);
  }
}

exports.WalletConnectConnector = WalletConnectConnector;
