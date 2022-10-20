import { I as InjectedConnector, _ as _classPrivateMethodInitSpec, t as _defineProperty, x as _classPrivateMethodGet, u as _classPrivateFieldInitSpec, w as _classPrivateFieldSet, a as ConnectorNotFoundError, v as _classPrivateFieldGet, g as getClient, U as UserRejectedRequestError, R as ResourceUnavailableError } from '../../../dist/getProvider-5b4b62c3.esm.js';
import 'zustand/middleware';
import 'zustand/vanilla';
import 'ethers';
import 'ethers/lib/utils';
import 'eventemitter3';
import '../../../dist/chains-8c76af1b.esm.js';
import '../../../dist/rpcs-8d636858.esm.js';

var _provider = /*#__PURE__*/new WeakMap();

var _UNSTABLE_shimOnConnectSelectAccount = /*#__PURE__*/new WeakMap();

var _getReady = /*#__PURE__*/new WeakSet();

var _findProvider = /*#__PURE__*/new WeakSet();

class MetaMaskConnector extends InjectedConnector {
  constructor() {
    let {
      chains,
      options: options_
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const options = {
      name: 'MetaMask',
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      ...options_
    };
    super({
      chains,
      options
    });

    _classPrivateMethodInitSpec(this, _findProvider);

    _classPrivateMethodInitSpec(this, _getReady);

    _defineProperty(this, "id", 'metaMask');

    _defineProperty(this, "ready", typeof window != 'undefined' && !!_classPrivateMethodGet(this, _findProvider, _findProvider2).call(this, window.ethereum));

    _classPrivateFieldInitSpec(this, _provider, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _UNSTABLE_shimOnConnectSelectAccount, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _UNSTABLE_shimOnConnectSelectAccount, options.UNSTABLE_shimOnConnectSelectAccount);
  }

  async connect() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    try {
      var _this$options, _getClient$storage, _this$options2, _getClient$storage2;

      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      this.emit('message', {
        type: 'connecting'
      }); // Attempt to show wallet select prompt with `wallet_requestPermissions` when
      // `shimDisconnect` is active and account is in disconnected state (flag in storage)

      if (_classPrivateFieldGet(this, _UNSTABLE_shimOnConnectSelectAccount) && (_this$options = this.options) !== null && _this$options !== void 0 && _this$options.shimDisconnect && !((_getClient$storage = getClient().storage) !== null && _getClient$storage !== void 0 && _getClient$storage.getItem(this.shimDisconnectKey))) {
        const accounts = await provider.request({
          method: 'eth_accounts'
        }).catch(() => []);
        const isConnected = !!accounts[0];
        if (isConnected) await provider.request({
          method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
        });
      }

      const account = await this.getAccount(); // Switch to chain if provided

      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      if ((_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.shimDisconnect) (_getClient$storage2 = getClient().storage) === null || _getClient$storage2 === void 0 ? void 0 : _getClient$storage2.setItem(this.shimDisconnectKey, true);
      return {
        account,
        chain: {
          id,
          unsupported
        },
        provider
      };
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error);
      if (error.code === -32002) throw new ResourceUnavailableError(error);
      throw error;
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      _classPrivateFieldSet(this, _provider, _classPrivateMethodGet(this, _findProvider, _findProvider2).call(this, window.ethereum));
    }

    return _classPrivateFieldGet(this, _provider);
  }

}

function _getReady2(ethereum) {
  const isMetaMask = !!(ethereum !== null && ethereum !== void 0 && ethereum.isMetaMask);
  if (!isMetaMask) return; // Brave tries to make itself look like MetaMask
  // Could also try RPC `web3_clientVersion` if following is unreliable

  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) return;
  if (ethereum.isTokenPocket) return;
  if (ethereum.isTokenary) return;
  return ethereum;
}

function _findProvider2(ethereum) {
  if (ethereum !== null && ethereum !== void 0 && ethereum.providers) return ethereum.providers.find(_classPrivateMethodGet(this, _getReady, _getReady2));
  return _classPrivateMethodGet(this, _getReady, _getReady2).call(this, ethereum);
}

export { MetaMaskConnector };
