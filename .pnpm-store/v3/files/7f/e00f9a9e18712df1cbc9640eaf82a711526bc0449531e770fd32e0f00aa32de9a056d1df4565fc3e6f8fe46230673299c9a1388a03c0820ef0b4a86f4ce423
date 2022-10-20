'use strict';

var middleware = require('zustand/middleware');
var create = require('zustand/vanilla');
var ethers = require('ethers');
var utils = require('ethers/lib/utils');
var EventEmitter = require('eventemitter3');
var chains = require('./chains-ec1de502.cjs.dev.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var create__default = /*#__PURE__*/_interopDefault(create);
var EventEmitter__default = /*#__PURE__*/_interopDefault(EventEmitter);

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 * @see https://eips.ethereum.org/EIPS/eip-1474
 */
class RpcError extends Error {
  constructor(
  /** Number error code */
  code,
  /** Human-readable string */
  message,
  /** Low-level error */
  internal,
  /** Other useful information about error */
  data) {
    if (!Number.isInteger(code)) throw new Error('"code" must be an integer.');
    if (!message || typeof message !== 'string') throw new Error('"message" must be a nonempty string.');
    super(message);

    _defineProperty(this, "code", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "internal", void 0);

    this.code = code;
    this.data = data;
    this.internal = internal;
  }

}
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */

class ProviderRpcError extends RpcError {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the 1000 <= 4999 range.
   */
  constructor(
  /**
   * Number error code
   * @see https://eips.ethereum.org/EIPS/eip-1193#error-standards
   */
  code,
  /** Human-readable string */
  message,
  /** Low-level error */
  internal,
  /** Other useful information about error */
  data) {
    if (!(Number.isInteger(code) && code >= 1000 && code <= 4999)) throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
    super(code, message, internal, data);
  }

}
class AddChainError extends Error {
  constructor() {
    super(...arguments);

    _defineProperty(this, "name", 'AddChainError');

    _defineProperty(this, "message", 'Error adding chain');
  }

}
class ChainDoesNotSupportMulticallError extends Error {
  constructor(_ref) {
    let {
      blockNumber,
      chain
    } = _ref;
    super("Chain \"".concat(chain.name, "\" does not support multicall").concat(blockNumber ? " on block ".concat(blockNumber) : '', "."));

    _defineProperty(this, "name", 'ChainDoesNotSupportMulticall');
  }

}
class ChainMismatchError extends Error {
  constructor(_ref2) {
    let {
      activeChain,
      targetChain
    } = _ref2;
    super("Chain mismatch: Expected \"".concat(targetChain, "\", received \"").concat(activeChain, "\"."));

    _defineProperty(this, "name", 'ChainMismatchError');
  }

}
class ChainNotConfiguredError extends Error {
  constructor() {
    super(...arguments);

    _defineProperty(this, "name", 'ChainNotConfigured');

    _defineProperty(this, "message", 'Chain not configured');
  }

}
class ConnectorAlreadyConnectedError extends Error {
  constructor() {
    super(...arguments);

    _defineProperty(this, "name", 'ConnectorAlreadyConnectedError');

    _defineProperty(this, "message", 'Connector already connected');
  }

}
class ConnectorNotFoundError extends Error {
  constructor() {
    super(...arguments);

    _defineProperty(this, "name", 'ConnectorNotFoundError');

    _defineProperty(this, "message", 'Connector not found');
  }

}
class ContractMethodDoesNotExistError extends Error {
  constructor(_ref3) {
    var _chain$blockExplorers;

    let {
      addressOrName,
      chainId,
      functionName
    } = _ref3;
    const {
      chains,
      network
    } = getProvider();
    const chain = chains === null || chains === void 0 ? void 0 : chains.find(_ref4 => {
      let {
        id
      } = _ref4;
      return id === (chainId || network.chainId);
    });
    const blockExplorer = chain === null || chain === void 0 ? void 0 : (_chain$blockExplorers = chain.blockExplorers) === null || _chain$blockExplorers === void 0 ? void 0 : _chain$blockExplorers.default;
    super(["Function \"".concat(functionName, "\" on contract \"").concat(addressOrName, "\" does not exist."), ...(blockExplorer ? ['', "".concat(blockExplorer === null || blockExplorer === void 0 ? void 0 : blockExplorer.name, ": ").concat(blockExplorer === null || blockExplorer === void 0 ? void 0 : blockExplorer.url, "/address/").concat(addressOrName, "#readContract")] : [])].join('\n'));

    _defineProperty(this, "name", 'ContractMethodDoesNotExistError');
  }

}
class ContractMethodNoResultError extends Error {
  constructor(_ref5) {
    let {
      addressOrName,
      args,
      chainId,
      functionName
    } = _ref5;
    super(['Contract read returned an empty response. This could be due to any of the following:', "- The contract does not have the function \"".concat(functionName, "\","), '- The parameters passed to the contract function may be invalid, or', '- The address is not a contract.', '', "Config:", JSON.stringify({
      addressOrName,
      contractInterface: '...',
      functionName,
      chainId,
      args
    }, null, 2)].join('\n'));

    _defineProperty(this, "name", 'ContractMethodNoResultError');
  }

}
class ContractMethodRevertedError extends Error {
  constructor(_ref6) {
    let {
      addressOrName,
      args,
      chainId,
      functionName,
      errorMessage
    } = _ref6;
    super(['Contract method reverted with an error.', '', "Config:", JSON.stringify({
      addressOrName,
      contractInterface: '...',
      functionName,
      chainId,
      args
    }, null, 2), '', "Details: ".concat(errorMessage)].join('\n'));

    _defineProperty(this, "name", 'ContractMethodRevertedError');
  }

}
class ContractResultDecodeError extends Error {
  constructor(_ref7) {
    let {
      addressOrName,
      args,
      chainId,
      functionName,
      errorMessage
    } = _ref7;
    super(['Failed to decode contract function result.', '', "Config:", JSON.stringify({
      addressOrName,
      contractInterface: '...',
      functionName,
      chainId,
      args
    }, null, 2), '', "Details: ".concat(errorMessage)].join('\n'));

    _defineProperty(this, "name", 'ContractResultDecodeError');
  }

}
class ProviderChainsNotFound extends Error {
  constructor() {
    super(...arguments);

    _defineProperty(this, "name", 'ProviderChainsNotFound');

    _defineProperty(this, "message", ['No chains were found on the wagmi provider. Some functions that require a chain may not work.', '', 'It is recommended to add a list of chains to the provider in `createClient`.', '', 'Example:', '', '```', "import { getDefaultProvider } from 'ethers'", "import { chain, createClient } from 'wagmi'", '', 'createClient({', '  provider: Object.assign(getDefaultProvider(), { chains: [chain.mainnet] })', '})', '```'].join('\n'));
  }

}
class ResourceUnavailableError extends RpcError {
  constructor(error) {
    super(-32002, 'Resource unavailable', error);

    _defineProperty(this, "name", 'ResourceUnavailable');
  }

}
class SwitchChainError extends ProviderRpcError {
  constructor(error) {
    super(4902, 'Error switching chain', error);

    _defineProperty(this, "name", 'SwitchChainError');
  }

}
class SwitchChainNotSupportedError extends Error {
  constructor(_ref8) {
    let {
      connector
    } = _ref8;
    super("\"".concat(connector.name, "\" does not support programmatic chain switching."));

    _defineProperty(this, "name", 'SwitchChainNotSupportedError');
  }

}
class UserRejectedRequestError extends ProviderRpcError {
  constructor(error) {
    super(4001, 'User rejected request', error);

    _defineProperty(this, "name", 'UserRejectedRequestError');
  }

}

function getInjectedName(ethereum) {
  var _ethereum$providers, _getName;

  if (!ethereum) return 'Injected';

  const getName = provider => {
    if (provider.isBitKeep) return 'BitKeep';
    if (provider.isBraveWallet) return 'Brave Wallet';
    if (provider.isCoinbaseWallet) return 'Coinbase Wallet';
    if (provider.isExodus) return 'Exodus';
    if (provider.isFrame) return 'Frame';
    if (provider.isMathWallet) return 'MathWallet';
    if (provider.isOpera) return 'Opera';
    if (provider.isTally) return 'Tally';
    if (provider.isTokenPocket) return 'TokenPocket';
    if (provider.isTokenary) return 'Tokenary';
    if (provider.isTrust) return 'Trust Wallet';
    if (provider.isOneInchIOSWallet || provider.isOneInchAndroidWallet) return '1inch Wallet';
    if (provider.isMetaMask) return 'MetaMask';
  }; // Some injected providers detect multiple other providers and create a list at `ethers.providers`


  if ((_ethereum$providers = ethereum.providers) !== null && _ethereum$providers !== void 0 && _ethereum$providers.length) {
    var _names$;

    // Deduplicate names using Set
    // Coinbase Wallet puts multiple providers in `ethereum.providers`
    const nameSet = new Set();
    let unknownCount = 1;

    for (const provider of ethereum.providers) {
      let name = getName(provider);

      if (!name) {
        name = "Unknown Wallet #".concat(unknownCount);
        unknownCount += 1;
      }

      nameSet.add(name);
    }

    const names = [...nameSet];
    if (names.length) return names;
    return (_names$ = names[0]) !== null && _names$ !== void 0 ? _names$ : 'Injected';
  }

  return (_getName = getName(ethereum)) !== null && _getName !== void 0 ? _getName : 'Injected';
}

function normalizeChainId(chainId) {
  if (typeof chainId === 'string') return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10);
  if (typeof chainId === 'bigint') return Number(chainId);
  return chainId;
}

class Connector extends EventEmitter__default["default"] {
  /** Unique connector id */

  /** Connector name */

  /** Chains connector supports */

  /** Options to use with connector */

  /** Whether connector is usable */
  constructor(_ref) {
    let {
      chains: chains$1 = chains.defaultChains,
      options
    } = _ref;
    super();

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "chains", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "ready", void 0);

    this.chains = chains$1;
    this.options = options;
  }

  getBlockExplorerUrls(chain) {
    var _chain$blockExplorers;

    const {
      default: blockExplorer,
      ...blockExplorers
    } = (_chain$blockExplorers = chain.blockExplorers) !== null && _chain$blockExplorers !== void 0 ? _chain$blockExplorers : {};
    if (blockExplorer) return [blockExplorer.url, ...Object.values(blockExplorers).map(x => x.url)];
    return [];
  }

  isChainUnsupported(chainId) {
    return !this.chains.some(x => x.id === chainId);
  }

}

var _provider = /*#__PURE__*/new WeakMap();

var _switchingChains = /*#__PURE__*/new WeakMap();

class InjectedConnector extends Connector {
  constructor() {
    let {
      chains,
      options = {
        shimDisconnect: true
      }
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super({
      chains,
      options
    });

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "ready", typeof window != 'undefined' && !!window.ethereum);

    _classPrivateFieldInitSpec(this, _provider, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _switchingChains, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "shimDisconnectKey", 'injected.shimDisconnect');

    _defineProperty(this, "onAccountsChanged", accounts => {
      if (accounts.length === 0) this.emit('disconnect');else this.emit('change', {
        account: utils.getAddress(accounts[0])
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
      var _this$options, _this$options2, _getClient$storage;

      // We need this as MetaMask can emit the "disconnect" event
      // upon switching chains. This workaround ensures that the
      // user currently isn't in the process of switching chains.
      if ((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.shimChainChangedDisconnect && _classPrivateFieldGet(this, _switchingChains)) {
        _classPrivateFieldSet(this, _switchingChains, false);

        return;
      }

      this.emit('disconnect'); // Remove shim signalling wallet is disconnected

      if ((_this$options2 = this.options) !== null && _this$options2 !== void 0 && _this$options2.shimDisconnect) (_getClient$storage = getClient().storage) === null || _getClient$storage === void 0 ? void 0 : _getClient$storage.removeItem(this.shimDisconnectKey);
    });

    let name = 'Injected';
    const overrideName = options.name;
    if (typeof overrideName === 'string') name = overrideName;else if (typeof window !== 'undefined') {
      const detectedName = getInjectedName(window.ethereum);
      if (overrideName) name = overrideName(detectedName);else name = typeof detectedName === 'string' ? detectedName : detectedName[0];
    }
    this.id = 'injected';
    this.name = name;
  }

  async connect() {
    let {
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    try {
      var _this$options3, _getClient$storage2;

      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      this.emit('message', {
        type: 'connecting'
      });
      const account = await this.getAccount(); // Switch to chain if provided

      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      } // Add shim to storage signalling wallet is connected


      if ((_this$options3 = this.options) !== null && _this$options3 !== void 0 && _this$options3.shimDisconnect) (_getClient$storage2 = getClient().storage) === null || _getClient$storage2 === void 0 ? void 0 : _getClient$storage2.setItem(this.shimDisconnectKey, true);
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

  async disconnect() {
    var _this$options4, _getClient$storage3;

    const provider = await this.getProvider();
    if (!(provider !== null && provider !== void 0 && provider.removeListener)) return;
    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect); // Remove shim signalling wallet is disconnected

    if ((_this$options4 = this.options) !== null && _this$options4 !== void 0 && _this$options4.shimDisconnect) (_getClient$storage3 = getClient().storage) === null || _getClient$storage3 === void 0 ? void 0 : _getClient$storage3.removeItem(this.shimDisconnectKey);
  }

  async getAccount() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    }); // return checksum address

    return utils.getAddress(accounts[0]);
  }

  async getChainId() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    return await provider.request({
      method: 'eth_chainId'
    }).then(normalizeChainId);
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.ethereum) _classPrivateFieldSet(this, _provider, window.ethereum);
    return _classPrivateFieldGet(this, _provider);
  }

  async getSigner() {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
    return new ethers.providers.Web3Provider(provider).getSigner(account);
  }

  async isAuthorized() {
    try {
      var _this$options5, _getClient$storage4;

      if ((_this$options5 = this.options) !== null && _this$options5 !== void 0 && _this$options5.shimDisconnect && // If shim does not exist in storage, wallet is disconnected
      !((_getClient$storage4 = getClient().storage) !== null && _getClient$storage4 !== void 0 && _getClient$storage4.getItem(this.shimDisconnectKey))) return false;
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();
      const accounts = await provider.request({
        method: 'eth_accounts'
      });
      const account = accounts[0];
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId) {
    var _this$options6;

    if ((_this$options6 = this.options) !== null && _this$options6 !== void 0 && _this$options6.shimChainChangedDisconnect) _classPrivateFieldSet(this, _switchingChains, true);
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
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
      var _data, _data$originalError;

      const chain = this.chains.find(x => x.id === chainId);
      if (!chain) throw new ChainNotConfiguredError(); // Indicates chain is not added to provider

      if (error.code === 4902 || // Unwrapping for MetaMask Mobile
      // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
      (error === null || error === void 0 ? void 0 : (_data = error.data) === null || _data === void 0 ? void 0 : (_data$originalError = _data.originalError) === null || _data$originalError === void 0 ? void 0 : _data$originalError.code) === 4902) {
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
          if (this.isUserRejectedRequestError(addError)) throw new UserRejectedRequestError(error);
          throw new AddChainError();
        }
      }

      if (this.isUserRejectedRequestError(error)) throw new UserRejectedRequestError(error);
      throw new SwitchChainError(error);
    }
  }

  async watchAsset(_ref) {
    let {
      address,
      decimals = 18,
      image,
      symbol
    } = _ref;
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
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

  isUserRejectedRequestError(error) {
    return error.code === 4001;
  }

}

const noopStorage = {
  getItem: _key => '',
  setItem: (_key, _value) => null,
  removeItem: _key => null
};
function createStorage(_ref) {
  let {
    storage,
    key: prefix = 'wagmi'
  } = _ref;
  return { ...storage,
    getItem: function (key) {
      let defaultState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      const value = storage.getItem("".concat(prefix, ".").concat(key));

      try {
        return value ? JSON.parse(value) : defaultState;
      } catch (error) {
        console.warn(error);
        return defaultState;
      }
    },
    setItem: (key, value) => {
      if (value === null) {
        storage.removeItem("".concat(prefix, ".").concat(key));
      } else {
        try {
          storage.setItem("".concat(prefix, ".").concat(key), JSON.stringify(value));
        } catch (err) {
          console.error(err);
        }
      }
    },
    removeItem: key => storage.removeItem("".concat(prefix, ".").concat(key))
  };
}

const storeKey = 'store';

var _isAutoConnecting = /*#__PURE__*/new WeakMap();

var _lastUsedConnector = /*#__PURE__*/new WeakMap();

var _addEffects = /*#__PURE__*/new WeakSet();

class Client {
  constructor(_ref) {
    let {
      autoConnect = false,
      connectors = [new InjectedConnector()],
      provider: _provider,
      storage = createStorage({
        storage: typeof window !== 'undefined' ? window.localStorage : noopStorage
      }),
      logger = {
        warn: console.warn
      },
      webSocketProvider: _webSocketProvider
    } = _ref;

    _classPrivateMethodInitSpec(this, _addEffects);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "providers", new Map());

    _defineProperty(this, "storage", void 0);

    _defineProperty(this, "store", void 0);

    _defineProperty(this, "webSocketProviders", new Map());

    _classPrivateFieldInitSpec(this, _isAutoConnecting, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _lastUsedConnector, {
      writable: true,
      value: void 0
    });

    this.config = {
      autoConnect,
      connectors,
      logger,
      provider: _provider,
      storage,
      webSocketProvider: _webSocketProvider
    }; // Check status for autoConnect flag

    let status = 'disconnected';

    let _chainId;

    if (autoConnect) {
      try {
        var _JSON$parse, _JSON$parse$state, _data$chain;

        const rawState = storage.getItem(storeKey, '');
        const data = (_JSON$parse = JSON.parse(rawState || '{}')) === null || _JSON$parse === void 0 ? void 0 : (_JSON$parse$state = _JSON$parse.state) === null || _JSON$parse$state === void 0 ? void 0 : _JSON$parse$state.data; // If account exists in localStorage, set status to reconnecting

        status = data !== null && data !== void 0 && data.account ? 'reconnecting' : 'connecting';
        _chainId = data === null || data === void 0 ? void 0 : (_data$chain = data.chain) === null || _data$chain === void 0 ? void 0 : _data$chain.id; // eslint-disable-next-line no-empty
      } catch (_error) {}
    } // Create store


    this.store = create__default["default"](middleware.subscribeWithSelector(middleware.persist(() => ({
      connectors: typeof connectors === 'function' ? connectors() : connectors,
      provider: this.getProvider({
        chainId: _chainId
      }),
      status,
      webSocketProvider: this.getWebSocketProvider({
        chainId: _chainId
      })
    }), {
      name: storeKey,
      getStorage: () => storage,
      partialize: state => {
        var _state$data, _state$data2;

        return { ...(autoConnect && {
            data: {
              account: state === null || state === void 0 ? void 0 : (_state$data = state.data) === null || _state$data === void 0 ? void 0 : _state$data.account,
              chain: state === null || state === void 0 ? void 0 : (_state$data2 = state.data) === null || _state$data2 === void 0 ? void 0 : _state$data2.chain
            }
          }),
          chains: state === null || state === void 0 ? void 0 : state.chains
        };
      },
      version: 1
    })));
    this.storage = storage;

    _classPrivateFieldSet(this, _lastUsedConnector, storage === null || storage === void 0 ? void 0 : storage.getItem('wallet'));

    _classPrivateMethodGet(this, _addEffects, _addEffects2).call(this);

    if (autoConnect && typeof window !== 'undefined') setTimeout(async () => await this.autoConnect(), 0);
  }

  get chains() {
    return this.store.getState().chains;
  }

  get connectors() {
    return this.store.getState().connectors;
  }

  get connector() {
    return this.store.getState().connector;
  }

  get data() {
    return this.store.getState().data;
  }

  get error() {
    return this.store.getState().error;
  }

  get lastUsedChainId() {
    var _this$data, _this$data$chain;

    return (_this$data = this.data) === null || _this$data === void 0 ? void 0 : (_this$data$chain = _this$data.chain) === null || _this$data$chain === void 0 ? void 0 : _this$data$chain.id;
  }

  get provider() {
    return this.store.getState().provider;
  }

  get status() {
    return this.store.getState().status;
  }

  get subscribe() {
    return this.store.subscribe;
  }

  get webSocketProvider() {
    return this.store.getState().webSocketProvider;
  }

  setState(updater) {
    const newState = typeof updater === 'function' ? updater(this.store.getState()) : updater;
    this.store.setState(newState, true);
  }

  clearState() {
    this.setState(x => ({ ...x,
      connector: undefined,
      data: undefined,
      error: undefined,
      status: 'disconnected'
    }));
  }

  async destroy() {
    var _this$connector$disco, _this$connector;

    if (this.connector) await ((_this$connector$disco = (_this$connector = this.connector).disconnect) === null || _this$connector$disco === void 0 ? void 0 : _this$connector$disco.call(_this$connector));

    _classPrivateFieldSet(this, _isAutoConnecting, false);

    this.clearState();
    this.store.destroy();
  }

  async autoConnect() {
    if (_classPrivateFieldGet(this, _isAutoConnecting)) return;

    _classPrivateFieldSet(this, _isAutoConnecting, true);

    this.setState(x => {
      var _x$data;

      return { ...x,
        status: (_x$data = x.data) !== null && _x$data !== void 0 && _x$data.account ? 'reconnecting' : 'connecting'
      };
    }); // Try last used connector first

    const sorted = _classPrivateFieldGet(this, _lastUsedConnector) ? [...this.connectors].sort(x => x.id === _classPrivateFieldGet(this, _lastUsedConnector) ? -1 : 1) : this.connectors;
    let connected = false;

    for (const connector of sorted) {
      if (!connector.ready || !connector.isAuthorized) continue;
      const isAuthorized = await connector.isAuthorized();
      if (!isAuthorized) continue;
      const data = await connector.connect();
      this.setState(x => ({ ...x,
        connector,
        chains: connector === null || connector === void 0 ? void 0 : connector.chains,
        data,
        status: 'connected'
      }));
      connected = true;
      break;
    } // If connecting didn't succeed, set to disconnected


    if (!connected) this.setState(x => ({ ...x,
      data: undefined,
      status: 'disconnected'
    }));

    _classPrivateFieldSet(this, _isAutoConnecting, false);

    return this.data;
  }

  getProvider() {
    let {
      bust,
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let provider_ = this.providers.get(chainId !== null && chainId !== void 0 ? chainId : -1);
    if (provider_ && !bust) return provider_;
    const {
      provider
    } = this.config;
    provider_ = typeof provider === 'function' ? provider({
      chainId
    }) : provider;
    this.providers.set(chainId !== null && chainId !== void 0 ? chainId : -1, provider_);
    return provider_;
  }

  getWebSocketProvider() {
    let {
      bust,
      chainId
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let webSocketProvider_ = this.webSocketProviders.get(chainId !== null && chainId !== void 0 ? chainId : -1);
    if (webSocketProvider_ && !bust) return webSocketProvider_;
    const {
      webSocketProvider
    } = this.config;
    webSocketProvider_ = typeof webSocketProvider === 'function' ? webSocketProvider({
      chainId
    }) : webSocketProvider;
    if (webSocketProvider_) this.webSocketProviders.set(chainId !== null && chainId !== void 0 ? chainId : -1, webSocketProvider_);
    return webSocketProvider_;
  }

  setLastUsedConnector() {
    var _this$storage;

    let lastUsedConnector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (_this$storage = this.storage) === null || _this$storage === void 0 ? void 0 : _this$storage.setItem('wallet', lastUsedConnector);
  }

}

function _addEffects2() {
  const onChange = data => {
    this.setState(x => ({ ...x,
      data: { ...x.data,
        ...data
      }
    }));
  };

  const onDisconnect = () => {
    this.clearState();
  };

  const onError = error => {
    this.setState(x => ({ ...x,
      error
    }));
  };

  this.store.subscribe(_ref2 => {
    let {
      connector
    } = _ref2;
    return connector;
  }, (connector, prevConnector) => {
    var _prevConnector$off, _prevConnector$off2, _prevConnector$off3, _connector$on, _connector$on2, _connector$on3;

    prevConnector === null || prevConnector === void 0 ? void 0 : (_prevConnector$off = prevConnector.off) === null || _prevConnector$off === void 0 ? void 0 : _prevConnector$off.call(prevConnector, 'change', onChange);
    prevConnector === null || prevConnector === void 0 ? void 0 : (_prevConnector$off2 = prevConnector.off) === null || _prevConnector$off2 === void 0 ? void 0 : _prevConnector$off2.call(prevConnector, 'disconnect', onDisconnect);
    prevConnector === null || prevConnector === void 0 ? void 0 : (_prevConnector$off3 = prevConnector.off) === null || _prevConnector$off3 === void 0 ? void 0 : _prevConnector$off3.call(prevConnector, 'error', onError);
    if (!connector) return;
    (_connector$on = connector.on) === null || _connector$on === void 0 ? void 0 : _connector$on.call(connector, 'change', onChange);
    (_connector$on2 = connector.on) === null || _connector$on2 === void 0 ? void 0 : _connector$on2.call(connector, 'disconnect', onDisconnect);
    (_connector$on3 = connector.on) === null || _connector$on3 === void 0 ? void 0 : _connector$on3.call(connector, 'error', onError);
  });
  const {
    provider,
    webSocketProvider
  } = this.config;
  const subscribeProvider = typeof provider === 'function';
  const subscribeWebSocketProvider = typeof webSocketProvider === 'function';
  if (subscribeProvider || subscribeWebSocketProvider) this.store.subscribe(_ref3 => {
    var _data$chain2;

    let {
      data
    } = _ref3;
    return data === null || data === void 0 ? void 0 : (_data$chain2 = data.chain) === null || _data$chain2 === void 0 ? void 0 : _data$chain2.id;
  }, chainId => {
    this.setState(x => ({ ...x,
      provider: this.getProvider({
        bust: true,
        chainId
      }),
      webSocketProvider: this.getWebSocketProvider({
        bust: true,
        chainId
      })
    }));
  });
}

let client;
function createClient(config) {
  const client_ = new Client(config);
  client = client_;
  return client_;
}
function getClient() {
  if (!client) {
    throw new Error('No wagmi client found. Ensure you have set up a client: https://wagmi.sh/docs/client');
  }

  return client;
}

function getProvider() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const client = getClient();
  if (chainId) return client.getProvider({
    chainId
  }) || client.provider;
  return client.provider;
}

exports.AddChainError = AddChainError;
exports.ChainDoesNotSupportMulticallError = ChainDoesNotSupportMulticallError;
exports.ChainMismatchError = ChainMismatchError;
exports.ChainNotConfiguredError = ChainNotConfiguredError;
exports.Client = Client;
exports.Connector = Connector;
exports.ConnectorAlreadyConnectedError = ConnectorAlreadyConnectedError;
exports.ConnectorNotFoundError = ConnectorNotFoundError;
exports.ContractMethodDoesNotExistError = ContractMethodDoesNotExistError;
exports.ContractMethodNoResultError = ContractMethodNoResultError;
exports.ContractMethodRevertedError = ContractMethodRevertedError;
exports.ContractResultDecodeError = ContractResultDecodeError;
exports.InjectedConnector = InjectedConnector;
exports.ProviderChainsNotFound = ProviderChainsNotFound;
exports.ProviderRpcError = ProviderRpcError;
exports.ResourceUnavailableError = ResourceUnavailableError;
exports.RpcError = RpcError;
exports.SwitchChainError = SwitchChainError;
exports.SwitchChainNotSupportedError = SwitchChainNotSupportedError;
exports.UserRejectedRequestError = UserRejectedRequestError;
exports._classPrivateFieldGet = _classPrivateFieldGet;
exports._classPrivateFieldInitSpec = _classPrivateFieldInitSpec;
exports._classPrivateFieldSet = _classPrivateFieldSet;
exports._classPrivateMethodGet = _classPrivateMethodGet;
exports._classPrivateMethodInitSpec = _classPrivateMethodInitSpec;
exports._defineProperty = _defineProperty;
exports.createClient = createClient;
exports.createStorage = createStorage;
exports.getClient = getClient;
exports.getProvider = getProvider;
exports.noopStorage = noopStorage;
exports.normalizeChainId = normalizeChainId;
