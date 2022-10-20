'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getProvider = require('../../../dist/getProvider-1b3eeda8.cjs.dev.js');
var ethers = require('ethers');
var utils = require('ethers/lib/utils');
require('zustand/middleware');
require('zustand/vanilla');
require('eventemitter3');
require('../../../dist/chains-ec1de502.cjs.dev.js');
require('../../../dist/rpcs-d2cd65f1.cjs.dev.js');

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

var _client = /*#__PURE__*/new WeakMap();

var _provider = /*#__PURE__*/new WeakMap();

var _isUserRejectedRequestError = /*#__PURE__*/new WeakSet();

class CoinbaseWalletConnector extends getProvider.Connector {
  constructor(_ref) {
    let {
      chains,
      options
    } = _ref;
    super({
      chains,
      options: {
        reloadOnDisconnect: false,
        ...options
      }
    });

    getProvider._classPrivateMethodInitSpec(this, _isUserRejectedRequestError);

    getProvider._defineProperty(this, "id", 'coinbaseWallet');

    getProvider._defineProperty(this, "name", 'Coinbase Wallet');

    getProvider._defineProperty(this, "ready", true);

    getProvider._classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });

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
      const provider = await this.getProvider();
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);
      this.emit('message', {
        type: 'connecting'
      });
      const accounts = await provider.enable();
      const account = utils.getAddress(accounts[0]); // Switch to chain if provided

      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      return {
        account,
        chain: {
          id,
          unsupported
        },
        provider: new ethers.providers.Web3Provider(provider)
      };
    } catch (error) {
      if (/(user closed modal|accounts received is empty)/i.test(error.message)) throw new getProvider.UserRejectedRequestError(error);
      throw error;
    }
  }

  async disconnect() {
    if (!getProvider._classPrivateFieldGet(this, _provider)) return;
    const provider = await this.getProvider();
    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
    provider.disconnect();
    provider.close();
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.request({
      method: 'eth_accounts'
    }); // return checksum address

    return utils.getAddress(accounts[0]);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = getProvider.normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    if (!getProvider._classPrivateFieldGet(this, _provider)) {
      var _walletExtension;

      let CoinbaseWalletSDK = (await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@coinbase/wallet-sdk')); })).default; // Workaround for Vite dev import errors
      // https://github.com/vitejs/vite/issues/7112

      if (typeof CoinbaseWalletSDK !== 'function' && // @ts-expect-error This import error is not visible to TypeScript
      typeof CoinbaseWalletSDK.default === 'function') CoinbaseWalletSDK = CoinbaseWalletSDK.default;

      getProvider._classPrivateFieldSet(this, _client, new CoinbaseWalletSDK(this.options));

      const walletExtensionChainId = (_walletExtension = getProvider._classPrivateFieldGet(this, _client).walletExtension) === null || _walletExtension === void 0 ? void 0 : _walletExtension.getChainId();
      const chain = this.chains.find(chain => this.options.chainId ? chain.id === this.options.chainId : chain.id === walletExtensionChainId) || this.chains[0];
      const chainId = this.options.chainId || (chain === null || chain === void 0 ? void 0 : chain.id);
      const jsonRpcUrl = this.options.jsonRpcUrl || (chain === null || chain === void 0 ? void 0 : chain.rpcUrls.default);

      getProvider._classPrivateFieldSet(this, _provider, getProvider._classPrivateFieldGet(this, _client).makeWeb3Provider(jsonRpcUrl, chainId));
    }

    return getProvider._classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
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

  async switchChain(chainId) {
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
      const chain = this.chains.find(x => x.id === chainId);
      if (!chain) throw new getProvider.ChainNotConfiguredError(); // Indicates chain is not added to provider

      if (error.code === 4902) {
        try {
          var _chain$rpcUrls$public;

          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: id,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [(_chain$rpcUrls$public = chain.rpcUrls.public) !== null && _chain$rpcUrls$public !== void 0 ? _chain$rpcUrls$public : chain.rpcUrls.default],
              blockExplorerUrls: this.getBlockExplorerUrls(chain)
            }]
          });
          return chain;
        } catch (addError) {
          if (getProvider._classPrivateMethodGet(this, _isUserRejectedRequestError, _isUserRejectedRequestError2).call(this, addError)) throw new getProvider.UserRejectedRequestError(addError);
          throw new getProvider.AddChainError();
        }
      }

      if (getProvider._classPrivateMethodGet(this, _isUserRejectedRequestError, _isUserRejectedRequestError2).call(this, error)) throw new getProvider.UserRejectedRequestError(error);
      throw new getProvider.SwitchChainError(error);
    }
  }

  async watchAsset(_ref2) {
    let {
      address,
      decimals = 18,
      image,
      symbol
    } = _ref2;
    const provider = await this.getProvider();
    return await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          decimals,
          image,
          symbol
        }
      }
    });
  }

}

function _isUserRejectedRequestError2(error) {
  return /(user rejected)/i.test(error.message);
}

exports.CoinbaseWalletConnector = CoinbaseWalletConnector;
