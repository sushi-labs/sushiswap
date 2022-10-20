'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getProvider = require('../../../dist/getProvider-ad4ce6a4.cjs.prod.js');
var utils = require('ethers/lib/utils');
var ethers = require('ethers');
var EventEmitter = require('eventemitter3');
require('zustand/middleware');
require('zustand/vanilla');
require('../../../dist/chains-789e0c2e.cjs.prod.js');
require('../../../dist/rpcs-edec227e.cjs.prod.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefault(EventEmitter);

var _options = /*#__PURE__*/new WeakMap();

var _signer = /*#__PURE__*/new WeakMap();

class MockProvider extends ethers.providers.BaseProvider {
  constructor(options) {
    var _options$chainId;

    super({
      name: 'Network',
      chainId: (_options$chainId = options.chainId) !== null && _options$chainId !== void 0 ? _options$chainId : 1
    });

    getProvider._defineProperty(this, "events", new EventEmitter__default["default"]());

    getProvider._classPrivateFieldInitSpec(this, _options, {
      writable: true,
      value: void 0
    });

    getProvider._classPrivateFieldInitSpec(this, _signer, {
      writable: true,
      value: void 0
    });

    getProvider._classPrivateFieldSet(this, _options, options);
  }

  async enable() {
    var _classPrivateFieldGet2;

    if ((_classPrivateFieldGet2 = getProvider._classPrivateFieldGet(this, _options).flags) !== null && _classPrivateFieldGet2 !== void 0 && _classPrivateFieldGet2.failConnect) throw new getProvider.UserRejectedRequestError(new Error('Failed to connect'));
    if (!getProvider._classPrivateFieldGet(this, _signer)) getProvider._classPrivateFieldSet(this, _signer, getProvider._classPrivateFieldGet(this, _options).signer);
    const address = await getProvider._classPrivateFieldGet(this, _signer).getAddress();
    this.events.emit('accountsChanged', [address]);
    return [address];
  }

  async disconnect() {
    this.events.emit('disconnect');

    getProvider._classPrivateFieldSet(this, _signer, undefined);
  }

  async getAccounts() {
    var _classPrivateFieldGet3;

    const address = await ((_classPrivateFieldGet3 = getProvider._classPrivateFieldGet(this, _signer)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.getAddress());
    if (!address) return [];
    return [utils.getAddress(address)];
  }

  getSigner() {
    const signer = getProvider._classPrivateFieldGet(this, _signer);

    if (!signer) throw new Error('Signer not found');
    return signer;
  }

  async switchChain(chainId) {
    var _classPrivateFieldGet4;

    if ((_classPrivateFieldGet4 = getProvider._classPrivateFieldGet(this, _options).flags) !== null && _classPrivateFieldGet4 !== void 0 && _classPrivateFieldGet4.failSwitchChain) throw new getProvider.UserRejectedRequestError(new Error('Failed to switch chain'));
    getProvider._classPrivateFieldGet(this, _options).chainId = chainId;
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

class MockConnector extends getProvider.Connector {
  constructor(config) {
    super(config);

    getProvider._classPrivateMethodInitSpec(this, _switchChain);

    getProvider._defineProperty(this, "id", 'mock');

    getProvider._defineProperty(this, "name", 'Mock');

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
    const account = utils.getAddress(accounts[0]);
    const id = getProvider.normalizeChainId(provider._network.chainId);
    const unsupported = this.isChainUnsupported(id);
    const data = {
      account,
      chain: {
        id,
        unsupported
      },
      provider
    };
    if (!((_this$options$flags = this.options.flags) !== null && _this$options$flags !== void 0 && _this$options$flags.noSwitchChain)) this.switchChain = getProvider._classPrivateMethodGet(this, _switchChain, _switchChain2);
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

    return utils.getAddress(account);
  }

  async getChainId() {
    const provider = await this.getProvider();
    return getProvider.normalizeChainId(provider.network.chainId);
  }

  async getProvider() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!getProvider._classPrivateFieldGet(this, _provider) || chainId) getProvider._classPrivateFieldSet(this, _provider, new MockProvider({ ...this.options,
      chainId
    }));
    return getProvider._classPrivateFieldGet(this, _provider);
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

exports.MockConnector = MockConnector;
exports.MockProvider = MockProvider;
