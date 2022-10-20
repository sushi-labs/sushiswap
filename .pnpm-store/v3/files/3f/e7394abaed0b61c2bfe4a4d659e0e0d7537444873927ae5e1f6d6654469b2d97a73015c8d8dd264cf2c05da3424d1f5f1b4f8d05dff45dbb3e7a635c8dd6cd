import { t as _defineProperty, u as _classPrivateFieldInitSpec, w as _classPrivateFieldSet, v as _classPrivateFieldGet, U as UserRejectedRequestError, l as Connector, _ as _classPrivateMethodInitSpec, n as normalizeChainId, x as _classPrivateMethodGet } from '../../../dist/getProvider-5b4b62c3.esm.js';
import { getAddress } from 'ethers/lib/utils';
import { providers } from 'ethers';
import EventEmitter from 'eventemitter3';
import 'zustand/middleware';
import 'zustand/vanilla';
import '../../../dist/chains-8c76af1b.esm.js';
import '../../../dist/rpcs-8d636858.esm.js';

var _options = /*#__PURE__*/new WeakMap();

var _signer = /*#__PURE__*/new WeakMap();

class MockProvider extends providers.BaseProvider {
  constructor(options) {
    var _options$chainId;

    super({
      name: 'Network',
      chainId: (_options$chainId = options.chainId) !== null && _options$chainId !== void 0 ? _options$chainId : 1
    });

    _defineProperty(this, "events", new EventEmitter());

    _classPrivateFieldInitSpec(this, _options, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _signer, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _options, options);
  }

  async enable() {
    var _classPrivateFieldGet2;

    if ((_classPrivateFieldGet2 = _classPrivateFieldGet(this, _options).flags) !== null && _classPrivateFieldGet2 !== void 0 && _classPrivateFieldGet2.failConnect) throw new UserRejectedRequestError(new Error('Failed to connect'));
    if (!_classPrivateFieldGet(this, _signer)) _classPrivateFieldSet(this, _signer, _classPrivateFieldGet(this, _options).signer);
    const address = await _classPrivateFieldGet(this, _signer).getAddress();
    this.events.emit('accountsChanged', [address]);
    return [address];
  }

  async disconnect() {
    this.events.emit('disconnect');

    _classPrivateFieldSet(this, _signer, undefined);
  }

  async getAccounts() {
    var _classPrivateFieldGet3;

    const address = await ((_classPrivateFieldGet3 = _classPrivateFieldGet(this, _signer)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.getAddress());
    if (!address) return [];
    return [getAddress(address)];
  }

  getSigner() {
    const signer = _classPrivateFieldGet(this, _signer);

    if (!signer) throw new Error('Signer not found');
    return signer;
  }

  async switchChain(chainId) {
    var _classPrivateFieldGet4;

    if ((_classPrivateFieldGet4 = _classPrivateFieldGet(this, _options).flags) !== null && _classPrivateFieldGet4 !== void 0 && _classPrivateFieldGet4.failSwitchChain) throw new UserRejectedRequestError(new Error('Failed to switch chain'));
    _classPrivateFieldGet(this, _options).chainId = chainId;
    this.network.chainId = chainId;
    this.events.emit('chainChanged', chainId);
  }

  async watchAsset(_asset) {
    return true;
  }

  on(event, listener) {
    this.events.on(event, listener);
    return this;
  }

  once(event, listener) {
    this.events.once(event, listener);
    return this;
  }

  removeListener(event, listener) {
    this.events.removeListener(event, listener);
    return this;
  }

  off(event, listener) {
    this.events.off(event, listener);
    return this;
  }

  toJSON() {
    return '<MockProvider>';
  }

}

var _provider = /*#__PURE__*/new WeakMap();

var _switchChain = /*#__PURE__*/new WeakSet();

class MockConnector extends Connector {
  constructor(config) {
    super(config);

    _classPrivateMethodInitSpec(this, _switchChain);

    _defineProperty(this, "id", 'mock');

    _defineProperty(this, "name", 'Mock');

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
    var _this$options$flags;

    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const provider = await this.getProvider({
      chainId
    });
    provider.on('accountsChanged', this.onAccountsChanged);
    provider.on('chainChanged', this.onChainChanged);
    provider.on('disconnect', this.onDisconnect);
    this.emit('message', {
      type: 'connecting'
    });
    const accounts = await provider.enable();
    const account = getAddress(accounts[0]);
    const id = normalizeChainId(provider._network.chainId);
    const unsupported = this.isChainUnsupported(id);
    const data = {
      account,
      chain: {
        id,
        unsupported
      },
      provider
    };
    if (!((_this$options$flags = this.options.flags) !== null && _this$options$flags !== void 0 && _this$options$flags.noSwitchChain)) this.switchChain = _classPrivateMethodGet(this, _switchChain, _switchChain2);
    return new Promise(res => setTimeout(() => res(data), 100));
  }

  async disconnect() {
    const provider = await this.getProvider();
    await provider.disconnect();
    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.getAccounts();
    const account = accounts[0];
    if (!account) throw new Error('Failed to get account'); // return checksum address

    return getAddress(account);
  }

  async getChainId() {
    const provider = await this.getProvider();
    return normalizeChainId(provider.network.chainId);
  }

  async getProvider() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!_classPrivateFieldGet(this, _provider) || chainId) _classPrivateFieldSet(this, _provider, new MockProvider({ ...this.options,
      chainId
    }));
    return _classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    const provider = await this.getProvider();
    return provider.getSigner();
  }

  async isAuthorized() {
    try {
      var _this$options$flags$i, _this$options$flags2;

      const provider = await this.getProvider();
      const account = await provider.getAccounts();
      return (_this$options$flags$i = (_this$options$flags2 = this.options.flags) === null || _this$options$flags2 === void 0 ? void 0 : _this$options$flags2.isAuthorized) !== null && _this$options$flags$i !== void 0 ? _this$options$flags$i : !!account;
    } catch {
      return false;
    }
  }

  async watchAsset(asset) {
    const provider = await this.getProvider();
    return await provider.watchAsset(asset);
  }

  toJSON() {
    return '<MockConnector>';
  }

}

async function _switchChain2(chainId) {
  var _this$chains$find;

  const provider = await this.getProvider();
  await provider.switchChain(chainId);
  return (_this$chains$find = this.chains.find(x => x.id === chainId)) !== null && _this$chains$find !== void 0 ? _this$chains$find : {
    id: chainId,
    name: "Chain ".concat(chainId),
    network: "".concat(chainId),
    rpcUrls: {
      default: ''
    }
  };
}

export { MockConnector, MockProvider };
