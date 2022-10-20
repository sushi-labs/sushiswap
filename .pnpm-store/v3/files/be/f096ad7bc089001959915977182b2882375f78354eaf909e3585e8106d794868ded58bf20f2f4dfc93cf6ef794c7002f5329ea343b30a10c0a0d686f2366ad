import { l as Connector, _ as _classPrivateMethodInitSpec, t as _defineProperty, u as _classPrivateFieldInitSpec, n as normalizeChainId, U as UserRejectedRequestError, v as _classPrivateFieldGet, w as _classPrivateFieldSet, m as ChainNotConfiguredError, x as _classPrivateMethodGet, A as AddChainError, q as SwitchChainError } from '../../../dist/getProvider-5b4b62c3.esm.js';
import { providers } from 'ethers';
import { getAddress, hexValue } from 'ethers/lib/utils';
import 'zustand/middleware';
import 'zustand/vanilla';
import 'eventemitter3';
import '../../../dist/chains-8c76af1b.esm.js';
import '../../../dist/rpcs-8d636858.esm.js';

var _client = /*#__PURE__*/new WeakMap();

var _provider = /*#__PURE__*/new WeakMap();

var _isUserRejectedRequestError = /*#__PURE__*/new WeakSet();

class CoinbaseWalletConnector extends Connector {
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

    _classPrivateMethodInitSpec(this, _isUserRejectedRequestError);

    _defineProperty(this, "id", 'coinbaseWallet');

    _defineProperty(this, "name", 'Coinbase Wallet');

    _defineProperty(this, "ready", true);

    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });

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
      const provider = await this.getProvider();
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);
      this.emit('message', {
        type: 'connecting'
      });
      const accounts = await provider.enable();
      const account = getAddress(accounts[0]); // Switch to chain if provided

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
        provider: new providers.Web3Provider(provider)
      };
    } catch (error) {
      if (/(user closed modal|accounts received is empty)/i.test(error.message)) throw new UserRejectedRequestError(error);
      throw error;
    }
  }

  async disconnect() {
    if (!_classPrivateFieldGet(this, _provider)) return;
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

    return getAddress(accounts[0]);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    if (!_classPrivateFieldGet(this, _provider)) {
      var _walletExtension;

      let CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default; // Workaround for Vite dev import errors
      // https://github.com/vitejs/vite/issues/7112

      if (typeof CoinbaseWalletSDK !== 'function' && // @ts-expect-error This import error is not visible to TypeScript
      typeof CoinbaseWalletSDK.default === 'function') CoinbaseWalletSDK = CoinbaseWalletSDK.default;

      _classPrivateFieldSet(this, _client, new CoinbaseWalletSDK(this.options));

      const walletExtensionChainId = (_walletExtension = _classPrivateFieldGet(this, _client).walletExtension) === null || _walletExtension === void 0 ? void 0 : _walletExtension.getChainId();
      const chain = this.chains.find(chain => this.options.chainId ? chain.id === this.options.chainId : chain.id === walletExtensionChainId) || this.chains[0];
      const chainId = this.options.chainId || (chain === null || chain === void 0 ? void 0 : chain.id);
      const jsonRpcUrl = this.options.jsonRpcUrl || (chain === null || chain === void 0 ? void 0 : chain.rpcUrls.default);

      _classPrivateFieldSet(this, _provider, _classPrivateFieldGet(this, _client).makeWeb3Provider(jsonRpcUrl, chainId));
    }

    return _classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
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

  async switchChain(chainId) {
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
      const chain = this.chains.find(x => x.id === chainId);
      if (!chain) throw new ChainNotConfiguredError(); // Indicates chain is not added to provider

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
          if (_classPrivateMethodGet(this, _isUserRejectedRequestError, _isUserRejectedRequestError2).call(this, addError)) throw new UserRejectedRequestError(addError);
          throw new AddChainError();
        }
      }

      if (_classPrivateMethodGet(this, _isUserRejectedRequestError, _isUserRejectedRequestError2).call(this, error)) throw new UserRejectedRequestError(error);
      throw new SwitchChainError(error);
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

export { CoinbaseWalletConnector };
