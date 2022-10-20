'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getProvider = require('./getProvider-1b3eeda8.cjs.dev.js');
var ethers = require('ethers');
var ethers$1 = require('ethers/lib/ethers');
var utils = require('ethers/lib/utils');
var chains = require('./chains-ec1de502.cjs.dev.js');
var shallow = require('zustand/shallow');
var debounce = require('./debounce-46ac0312.cjs.dev.js');
var rpcs = require('./rpcs-d2cd65f1.cjs.dev.js');
require('zustand/middleware');
require('zustand/vanilla');
require('eventemitter3');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var shallow__default = /*#__PURE__*/_interopDefault(shallow);

function configureChains(defaultChains, providers) {
  let {
    minQuorum = 1,
    pollingInterval = 4000,
    targetQuorum = 1,
    stallTimeout
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!defaultChains.length) throw new Error('must have at least one chain');
  if (targetQuorum < minQuorum) throw new Error('quorum cannot be lower than minQuorum');
  let chains = [];
  const providers_ = {};
  const webSocketProviders_ = {};

  for (const chain of defaultChains) {
    let configExists = false;

    for (const provider of providers) {
      const apiConfig = provider(chain); // If no API configuration was found (ie. no RPC URL) for
      // this provider, then we skip and check the next one.

      if (!apiConfig) continue;
      configExists = true;

      if (!chains.some(_ref => {
        let {
          id
        } = _ref;
        return id === chain.id;
      })) {
        chains = [...chains, apiConfig.chain];
      }

      providers_[chain.id] = [...(providers_[chain.id] || []), apiConfig.provider];

      if (apiConfig.webSocketProvider) {
        webSocketProviders_[chain.id] = [...(webSocketProviders_[chain.id] || []), apiConfig.webSocketProvider];
      }
    } // If no API configuration was found across the providers
    // then we throw an error to the consumer.


    if (!configExists) {
      throw new Error(["Could not find valid provider configuration for chain \"".concat(chain.name, "\".\n"), "You may need to add `jsonRpcProvider` to `configureChains` with the chain's RPC URLs.", 'Read more: https://wagmi.sh/docs/providers/jsonRpc'].join('\n'));
    }
  }

  return {
    chains,
    provider: _ref2 => {
      var _defaultChains$;

      let {
        chainId
      } = _ref2;
      const activeChainId = chainId && chains.some(x => x.id === chainId) ? chainId : (_defaultChains$ = defaultChains[0]) === null || _defaultChains$ === void 0 ? void 0 : _defaultChains$.id;
      const chainProviders = providers_[activeChainId];
      if (!chainProviders || !chainProviders[0]) throw new Error("No providers configured for chain \"".concat(activeChainId, "\""));

      if (chainProviders.length === 1) {
        return Object.assign(chainProviders[0](), {
          chains,
          pollingInterval
        });
      }

      return Object.assign(fallbackProvider(targetQuorum, minQuorum, chainProviders, {
        stallTimeout
      }), {
        chains,
        pollingInterval
      });
    },
    webSocketProvider: _ref3 => {
      var _defaultChains$2, _chainWebSocketProvid;

      let {
        chainId
      } = _ref3;
      const activeChainId = chainId && chains.some(x => x.id === chainId) ? chainId : (_defaultChains$2 = defaultChains[0]) === null || _defaultChains$2 === void 0 ? void 0 : _defaultChains$2.id;
      const chainWebSocketProviders = webSocketProviders_[activeChainId];
      if (!chainWebSocketProviders) return undefined; // WebSockets do not work with `fallbackProvider`
      // Default to first available

      return Object.assign(((_chainWebSocketProvid = chainWebSocketProviders[0]) === null || _chainWebSocketProvid === void 0 ? void 0 : _chainWebSocketProvid.call(chainWebSocketProviders)) || {}, {
        chains
      });
    }
  };
}

function fallbackProvider(targetQuorum, minQuorum, providers_, _ref4) {
  let {
    stallTimeout
  } = _ref4;

  try {
    return new ethers.providers.FallbackProvider(providers_.map((chainProvider, index) => {
      var _provider$priority, _provider$stallTimeou;

      const provider = chainProvider();
      return {
        provider,
        priority: (_provider$priority = provider.priority) !== null && _provider$priority !== void 0 ? _provider$priority : index,
        stallTimeout: (_provider$stallTimeou = provider.stallTimeout) !== null && _provider$stallTimeou !== void 0 ? _provider$stallTimeou : stallTimeout,
        weight: provider.weight
      };
    }), targetQuorum);
  } catch (error) {
    var _error$message;

    if (error !== null && error !== void 0 && (_error$message = error.message) !== null && _error$message !== void 0 && _error$message.includes('quorum will always fail; larger than total weight')) {
      if (targetQuorum === minQuorum) throw error;
      return fallbackProvider(targetQuorum - 1, minQuorum, providers_, {
        stallTimeout
      });
    }

    throw error;
  }
}

/** Forked from https://github.com/epoberezkin/fast-deep-equal */
function deepEqual(a, b) {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) return false;
    let length;
    let i;

    if (Array.isArray(a) && Array.isArray(b)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;

      return true;
    }

    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key && !deepEqual(a[key], b[key])) return false;
    }

    return true;
  } // true if both NaN, false otherwise


  return a !== a && b !== b;
}

function logWarn(message) {
  var _getClient, _getClient$config$log, _getClient$config$log2;

  (_getClient = getProvider.getClient()) === null || _getClient === void 0 ? void 0 : (_getClient$config$log = _getClient.config.logger) === null || _getClient$config$log === void 0 ? void 0 : (_getClient$config$log2 = _getClient$config$log.warn) === null || _getClient$config$log2 === void 0 ? void 0 : _getClient$config$log2.call(_getClient$config$log, message);
}

function minimizeContractInterface(_ref) {
  let {
    contractInterface,
    functionName
  } = _ref;
  const abi = ethers$1.Contract.getInterface(contractInterface).format(utils.FormatTypes.full);
  const minimizedInterface = Array.isArray(abi) ? abi : [abi];
  return minimizedInterface.filter(i => i.includes(functionName));
}

function isPlainArray(value) {
  return Array.isArray(value) && Object.keys(value).length === value.length;
}

function parseContractResult(_ref) {
  let {
    contractInterface,
    data,
    functionName
  } = _ref;

  if (data && isPlainArray(data)) {
    var _fragment$outputs;

    const iface = ethers$1.Contract.getInterface(contractInterface);
    const fragment = iface.getFunction(functionName);
    const isTuple = (((_fragment$outputs = fragment.outputs) === null || _fragment$outputs === void 0 ? void 0 : _fragment$outputs.length) || 0) > 1;
    const data_ = isTuple ? data : [data];
    const encodedResult = iface.encodeFunctionResult(functionName, data_);
    const decodedResult = iface.decodeFunctionResult(functionName, encodedResult);
    return isTuple ? decodedResult : decodedResult[0];
  }

  return data;
}

// https://ethereum.org/en/developers/docs/standards/tokens/erc-20
const erc20ABI = ['event Approval(address indexed _owner, address indexed _spender, uint256 _value)', 'event Transfer(address indexed _from, address indexed _to, uint256 _value)', 'function allowance(address _owner, address _spender) public view returns (uint256 remaining)', 'function approve(address _spender, uint256 _value) public returns (bool success)', 'function balanceOf(address _owner) public view returns (uint256 balance)', 'function decimals() public view returns (uint8)', 'function name() public view returns (string)', 'function symbol() public view returns (string)', 'function totalSupply() public view returns (uint256)', 'function transfer(address _to, uint256 _value) public returns (bool success)', 'function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)'];
/**
 * [bytes32-flavored ERC-20](https://docs.makerdao.com/smart-contract-modules/mkr-module#4.-gotchas-potential-source-of-user-error)
 * for tokens (ie. Maker) that use bytes32 instead of string.
 */

const erc20ABI_bytes32 = [{
  type: 'event',
  name: 'Approval',
  inputs: [{
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: true,
    name: 'spender',
    type: 'address'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }]
}, {
  type: 'event',
  name: 'Transfer',
  inputs: [{
    indexed: true,
    name: 'from',
    type: 'address'
  }, {
    indexed: true,
    name: 'to',
    type: 'address'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }]
}, {
  type: 'function',
  name: 'allowance',
  stateMutability: 'view',
  inputs: [{
    name: 'owner',
    type: 'address'
  }, {
    name: 'spender',
    type: 'address'
  }],
  outputs: [{
    name: '',
    type: 'uint256'
  }]
}, {
  type: 'function',
  name: 'approve',
  stateMutability: 'nonpayable',
  inputs: [{
    name: 'spender',
    type: 'address'
  }, {
    name: 'amount',
    type: 'uint256'
  }],
  outputs: [{
    name: '',
    type: 'bool'
  }]
}, {
  type: 'function',
  name: 'balanceOf',
  stateMutability: 'view',
  inputs: [{
    name: 'account',
    type: 'address'
  }],
  outputs: [{
    name: '',
    type: 'uint256'
  }]
}, {
  type: 'function',
  name: 'decimals',
  stateMutability: 'view',
  inputs: [],
  outputs: [{
    name: '',
    type: 'uint8'
  }]
}, {
  type: 'function',
  name: 'name',
  stateMutability: 'view',
  inputs: [],
  outputs: [{
    name: '',
    type: 'bytes32'
  }]
}, {
  type: 'function',
  name: 'symbol',
  stateMutability: 'view',
  inputs: [],
  outputs: [{
    name: '',
    type: 'bytes32'
  }]
}, {
  type: 'function',
  name: 'totalSupply',
  stateMutability: 'view',
  inputs: [],
  outputs: [{
    name: '',
    type: 'uint256'
  }]
}, {
  type: 'function',
  name: 'transfer',
  stateMutability: 'nonpayable',
  inputs: [{
    name: 'recipient',
    type: 'address'
  }, {
    name: 'amount',
    type: 'uint256'
  }],
  outputs: [{
    name: '',
    type: 'bool'
  }]
}, {
  type: 'function',
  name: 'transferFrom',
  stateMutability: 'nonpayable',
  inputs: [{
    name: 'sender',
    type: 'address'
  }, {
    name: 'recipient',
    type: 'address'
  }, {
    name: 'amount',
    type: 'uint256'
  }],
  outputs: [{
    name: '',
    type: 'bool'
  }]
}]; // https://ethereum.org/en/developers/docs/standards/tokens/erc-721

const erc721ABI = ['event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId)', 'event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)', 'event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)', 'function approve(address _approved, uint256 _tokenId) external payable', 'function balanceOf(address _owner) external view returns (uint256)', 'function getApproved(uint256 _tokenId) external view returns (address)', 'function isApprovedForAll(address _owner, address _operator) external view returns (bool)', 'function name() view returns (string memory)', 'function ownerOf(uint256 _tokenId) external view returns (address)', 'function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable', 'function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable', 'function setApprovalForAll(address _operator, bool _approved) external', 'function symbol() view returns (string memory)', 'function tokenByIndex(uint256 _index) view returns (uint256)', 'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256 tokenId)', 'function tokenURI(uint256 _tokenId) view returns (string memory)', 'function totalSupply() view returns (uint256)', 'function transferFrom(address _from, address _to, uint256 _tokenId) external payable'];

const multicallInterface = [{
  inputs: [{
    components: [{
      internalType: 'address',
      name: 'target',
      type: 'address'
    }, {
      internalType: 'bool',
      name: 'allowFailure',
      type: 'bool'
    }, {
      internalType: 'bytes',
      name: 'callData',
      type: 'bytes'
    }],
    internalType: 'struct Multicall3.Call3[]',
    name: 'calls',
    type: 'tuple[]'
  }],
  name: 'aggregate3',
  outputs: [{
    components: [{
      internalType: 'bool',
      name: 'success',
      type: 'bool'
    }, {
      internalType: 'bytes',
      name: 'returnData',
      type: 'bytes'
    }],
    internalType: 'struct Multicall3.Result[]',
    name: 'returnData',
    type: 'tuple[]'
  }],
  stateMutability: 'view',
  type: 'function'
}];

// https://github.com/ethers-io/ethers.js/blob/master/packages/units/src.ts/index.ts#L10-L18
const units = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

async function connect(_ref) {
  let {
    chainId,
    connector
  } = _ref;
  const client = getProvider.getClient();
  const activeConnector = client.connector;
  if (connector.id === (activeConnector === null || activeConnector === void 0 ? void 0 : activeConnector.id)) throw new getProvider.ConnectorAlreadyConnectedError();

  try {
    client.setState(x => ({ ...x,
      status: 'connecting'
    }));
    const data = await connector.connect({
      chainId
    });
    client.setLastUsedConnector(connector.id);
    client.setState(x => ({ ...x,
      connector,
      chains: connector === null || connector === void 0 ? void 0 : connector.chains,
      data,
      status: 'connected'
    }));
    client.storage.setItem('connected', true);
    return { ...data,
      connector
    };
  } catch (err) {
    client.setState(x => {
      return { ...x,
        // Keep existing connector connected in case of error
        status: x.connector ? 'connected' : 'disconnected'
      };
    });
    throw err;
  }
}

async function disconnect() {
  const client = getProvider.getClient();
  if (client.connector) await client.connector.disconnect();
  client.clearState();
  client.storage.removeItem('connected');
}

function getContract(_ref) {
  let {
    addressOrName,
    contractInterface,
    signerOrProvider
  } = _ref;
  return new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
}

async function deprecatedWriteContract(_ref) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides,
    signerOrProvider
  } = _ref;
  const {
    connector
  } = getProvider.getClient();
  if (!connector) throw new getProvider.ConnectorNotFoundError();
  const params = [...(Array.isArray(args) ? args : args ? [args] : []), ...(overrides ? [overrides] : [])];

  try {
    var _chain;

    let chain;

    if (chainId) {
      const activeChainId = await connector.getChainId(); // Try to switch chain to provided `chainId`

      if (chainId !== activeChainId) {
        var _connector$chains$fin, _connector$chains$fin2, _connector$chains$fin3, _connector$chains$fin4;

        if (connector.switchChain) chain = await connector.switchChain(chainId);else throw new getProvider.ChainMismatchError({
          activeChain: (_connector$chains$fin = (_connector$chains$fin2 = connector.chains.find(x => x.id === activeChainId)) === null || _connector$chains$fin2 === void 0 ? void 0 : _connector$chains$fin2.name) !== null && _connector$chains$fin !== void 0 ? _connector$chains$fin : "Chain ".concat(activeChainId),
          targetChain: (_connector$chains$fin3 = (_connector$chains$fin4 = connector.chains.find(x => x.id === chainId)) === null || _connector$chains$fin4 === void 0 ? void 0 : _connector$chains$fin4.name) !== null && _connector$chains$fin3 !== void 0 ? _connector$chains$fin3 : "Chain ".concat(chainId)
        });
      }
    }

    const signer = await connector.getSigner({
      chainId: (_chain = chain) === null || _chain === void 0 ? void 0 : _chain.id
    });
    const contract = getContract({
      addressOrName,
      contractInterface,
      signerOrProvider
    });
    const contractWithSigner = contract.connect(signer);
    const contractFunction = contractWithSigner[functionName];
    if (!contractFunction) logWarn("\"".concat(functionName, "\" does not exist in interface for contract \"").concat(addressOrName, "\""));
    return await contractFunction(...params);
  } catch (error) {
    if (error.code === 4001) throw new getProvider.UserRejectedRequestError(error);
    throw error;
  }
}

async function fetchToken(_ref) {
  let {
    address,
    chainId,
    formatUnits: units = 'ether'
  } = _ref;

  async function fetchToken_(_ref2) {
    let {
      contractInterface
    } = _ref2;
    const erc20Config = {
      addressOrName: address,
      contractInterface,
      chainId
    };
    const [decimals, name, symbol, totalSupply] = await readContracts({
      allowFailure: false,
      contracts: [{ ...erc20Config,
        functionName: 'decimals'
      }, { ...erc20Config,
        functionName: 'name'
      }, { ...erc20Config,
        functionName: 'symbol'
      }, { ...erc20Config,
        functionName: 'totalSupply'
      }]
    });
    return {
      address,
      decimals,
      name,
      symbol,
      totalSupply: {
        formatted: utils.formatUnits(totalSupply, units),
        value: totalSupply
      }
    };
  }

  try {
    return await fetchToken_({
      contractInterface: erc20ABI
    });
  } catch (err) {
    // In the chance that there is an error upon decoding the contract result,
    // it could be likely that the contract data is represented as bytes32 instead
    // of a string.
    if (err instanceof getProvider.ContractResultDecodeError) {
      const {
        name,
        symbol,
        ...rest
      } = await fetchToken_({
        contractInterface: erc20ABI_bytes32
      });
      return {
        name: utils.parseBytes32String(name),
        symbol: utils.parseBytes32String(symbol),
        ...rest
      };
    }

    throw err;
  }
}

/**
 * @description Prepares the parameters required for a contract write transaction.
 *
 * Returns config to be passed through to `writeContract`.
 *
 * @example
 * import { prepareWriteContract, writeContract } from '@wagmi/core'
 *
 * const config = await prepareWriteContract({
 *  addressOrName: '0x...',
 *  contractInterface: wagmiAbi,
 *  functionName: 'mint',
 * })
 * const result = await writeContract(config)
 */
async function prepareWriteContract(_ref) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface: contractInterface_,
    functionName,
    overrides,
    signer: signer_
  } = _ref;
  const signer = signer_ !== null && signer_ !== void 0 ? signer_ : await fetchSigner();
  if (!signer) throw new getProvider.ConnectorNotFoundError();
  const contract = getContract({
    addressOrName,
    contractInterface: contractInterface_,
    signerOrProvider: signer
  });
  const populateTransactionFn = contract.populateTransaction[functionName];

  if (!populateTransactionFn) {
    throw new getProvider.ContractMethodDoesNotExistError({
      addressOrName,
      functionName
    });
  }

  const contractInterface = minimizeContractInterface({
    contractInterface: contract.interface,
    functionName
  });
  const params = [...(Array.isArray(args) ? args : args ? [args] : []), ...(overrides ? [overrides] : [])];
  const unsignedTransaction = await populateTransactionFn(...params);
  const gasLimit = unsignedTransaction.gasLimit || (await signer.estimateGas(unsignedTransaction));
  return {
    addressOrName,
    args,
    ...(chainId ? {
      chainId
    } : {}),
    contractInterface,
    functionName,
    overrides,
    request: { ...unsignedTransaction,
      gasLimit
    },
    mode: 'prepared'
  };
}

function getWebSocketProvider() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const client = getProvider.getClient();
  if (chainId) return client.getWebSocketProvider({
    chainId
  }) || client.webSocketProvider;
  return client.webSocketProvider;
}

function watchProvider(args, callback) {
  const client = getProvider.getClient();

  const handleChange = async () => callback(getProvider.getProvider(args));

  const unsubscribe = client.subscribe(_ref => {
    let {
      provider
    } = _ref;
    return provider;
  }, handleChange);
  return unsubscribe;
}

function watchWebSocketProvider(args, callback) {
  const client = getProvider.getClient();

  const handleChange = async () => callback(getWebSocketProvider(args));

  const unsubscribe = client.subscribe(_ref => {
    let {
      webSocketProvider
    } = _ref;
    return webSocketProvider;
  }, handleChange);
  return unsubscribe;
}

async function readContract(_ref) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  const contract = getContract({
    addressOrName,
    contractInterface,
    signerOrProvider: provider
  });
  const params = [...(Array.isArray(args) ? args : args ? [args] : []), ...(overrides ? [overrides] : [])];
  const contractFunction = contract[functionName];
  if (!contractFunction) logWarn("\"".concat(functionName, "\" is not in the interface for contract \"").concat(addressOrName, "\""));
  const response = await (contractFunction === null || contractFunction === void 0 ? void 0 : contractFunction(...params));
  return response;
}

async function multicall(_ref) {
  let {
    allowFailure = true,
    chainId,
    contracts,
    overrides
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  if (!provider.chains) throw new getProvider.ProviderChainsNotFound();
  const chain = provider.chains.find(chain => chain.id === chainId) || provider.chains[0];
  if (!chain) throw new getProvider.ProviderChainsNotFound();
  if (!(chain !== null && chain !== void 0 && chain.multicall)) throw new getProvider.ChainDoesNotSupportMulticallError({
    chain
  });
  if (typeof (overrides === null || overrides === void 0 ? void 0 : overrides.blockTag) === 'number' && (overrides === null || overrides === void 0 ? void 0 : overrides.blockTag) < chain.multicall.blockCreated) throw new getProvider.ChainDoesNotSupportMulticallError({
    blockNumber: overrides === null || overrides === void 0 ? void 0 : overrides.blockTag,
    chain
  });
  const multicallContract = getContract({
    addressOrName: chain.multicall.address,
    contractInterface: multicallInterface,
    signerOrProvider: provider
  });
  const calls = contracts.map(_ref2 => {
    let {
      addressOrName,
      contractInterface,
      functionName,
      ...config
    } = _ref2;
    const {
      args
    } = config || {};
    const contract = getContract({
      addressOrName,
      contractInterface
    });
    const params = Array.isArray(args) ? args : args ? [args] : [];

    try {
      const callData = contract.interface.encodeFunctionData(functionName, params);
      if (!contract[functionName]) logWarn("\"".concat(functionName, "\" is not in the interface for contract \"").concat(addressOrName, "\""));
      return {
        target: addressOrName,
        allowFailure,
        callData
      };
    } catch (err) {
      if (!allowFailure) throw err;
      return {
        target: addressOrName,
        allowFailure,
        callData: '0x'
      };
    }
  });
  const params = [...[calls], ...(overrides ? [overrides] : [])];
  const results = await multicallContract.aggregate3(...params);
  return results.map((_ref3, i) => {
    let {
      returnData,
      success
    } = _ref3;
    const {
      addressOrName,
      contractInterface,
      functionName,
      args
    } = contracts[i];
    const contract = getContract({
      addressOrName,
      contractInterface
    });

    if (!success) {
      let error;

      try {
        contract.interface.decodeFunctionResult(functionName, returnData);
      } catch (err) {
        error = new getProvider.ContractMethodRevertedError({
          addressOrName,
          args,
          chainId: chain.id,
          functionName,
          errorMessage: err.message
        });
        if (!allowFailure) throw error;
        logWarn(error.message);
      }

      return null;
    }

    if (returnData === '0x') {
      const error = new getProvider.ContractMethodNoResultError({
        addressOrName,
        args,
        chainId: chain.id,
        functionName
      });
      if (!allowFailure) throw error;
      logWarn(error.message);
      return null;
    }

    try {
      const result = contract.interface.decodeFunctionResult(functionName, returnData);
      return Array.isArray(result) && result.length === 1 ? result[0] : result;
    } catch (err) {
      const error = new getProvider.ContractResultDecodeError({
        addressOrName,
        args,
        chainId: chain.id,
        functionName,
        errorMessage: err.message
      });
      if (!allowFailure) throw error;
      logWarn(error.message);
      return null;
    }
  });
}

async function readContracts(_ref) {
  let {
    allowFailure = true,
    contracts,
    overrides
  } = _ref;

  try {
    const provider = getProvider.getProvider();
    const contractsByChainId = contracts.reduce((contracts, contract) => {
      var _contract$chainId;

      const chainId = (_contract$chainId = contract.chainId) !== null && _contract$chainId !== void 0 ? _contract$chainId : provider.network.chainId;
      return { ...contracts,
        [chainId]: [...(contracts[chainId] || []), contract]
      };
    }, {});

    const promises = () => Object.entries(contractsByChainId).map(_ref2 => {
      let [chainId, contracts] = _ref2;
      return multicall({
        allowFailure,
        chainId: parseInt(chainId),
        contracts,
        overrides
      });
    });

    if (allowFailure) {
      return (await Promise.allSettled(promises())).map(result => {
        if (result.status === 'fulfilled') return result.value;

        if (result.reason instanceof getProvider.ChainDoesNotSupportMulticallError) {
          logWarn(result.reason.message);
          throw result.reason;
        }

        return null;
      }).flat();
    }

    return (await Promise.all(promises())).flat();
  } catch (err) {
    if (err instanceof getProvider.ContractResultDecodeError) throw err;
    if (err instanceof getProvider.ContractMethodNoResultError) throw err;
    if (err instanceof getProvider.ContractMethodRevertedError) throw err;

    const promises = () => contracts.map(contract => readContract({ ...contract,
      overrides
    }));

    if (allowFailure) {
      return (await Promise.allSettled(promises())).map((result, i) => {
        if (result.status === 'fulfilled') return result.value;
        const {
          addressOrName,
          functionName,
          chainId,
          args
        } = contracts[i];
        const error = new getProvider.ContractMethodRevertedError({
          addressOrName,
          functionName,
          chainId: chainId !== null && chainId !== void 0 ? chainId : chains.mainnet.id,
          args,
          errorMessage: result.reason
        });
        logWarn(error.message);
        return null;
      });
    }

    return await Promise.all(promises());
  }
}

function watchContractEvent(
/** Contract configuration */
contractArgs,
/** Event name to listen to */
eventName, callback) {
  let {
    chainId,
    once
  } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let contract;

  const watchEvent = async () => {
    if (contract) {
      var _contract;

      (_contract = contract) === null || _contract === void 0 ? void 0 : _contract.off(eventName, callback);
    }

    contract = getContract({
      signerOrProvider: getWebSocketProvider({
        chainId
      }) || getProvider.getProvider({
        chainId
      }),
      ...contractArgs
    });
    if (once) contract.once(eventName, callback);else contract.on(eventName, callback);
  };

  watchEvent();
  const client = getProvider.getClient();
  const unsubscribe = client.subscribe(_ref => {
    let {
      provider,
      webSocketProvider
    } = _ref;
    return {
      provider,
      webSocketProvider
    };
  }, watchEvent, {
    equalityFn: shallow__default["default"]
  });
  return () => {
    var _contract2;

    (_contract2 = contract) === null || _contract2 === void 0 ? void 0 : _contract2.off(eventName, callback);
    unsubscribe();
  };
}

async function fetchBlockNumber() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const provider = getProvider.getProvider({
    chainId
  });
  const blockNumber = await provider.getBlockNumber();
  return blockNumber;
}

function watchBlockNumber(args, callback) {
  var _getWebSocketProvider;

  // We need to debounce the listener as we want to opt-out
  // of the behavior where ethers emits a "block" event for
  // every block that was missed in between the `pollingInterval`.
  // We are setting a wait time of 1 as emitting an event in
  // ethers takes ~0.1ms.
  const debouncedCallback = debounce.debounce(callback, 1);
  let previousProvider;

  const createListener = provider => {
    if (previousProvider) {
      var _previousProvider;

      (_previousProvider = previousProvider) === null || _previousProvider === void 0 ? void 0 : _previousProvider.off('block', debouncedCallback);
    }

    provider.on('block', debouncedCallback);
    previousProvider = provider;
  };

  const provider_ = (_getWebSocketProvider = getWebSocketProvider({
    chainId: args.chainId
  })) !== null && _getWebSocketProvider !== void 0 ? _getWebSocketProvider : getProvider.getProvider({
    chainId: args.chainId
  });
  if (args.listen) createListener(provider_);
  let active = true;
  const client = getProvider.getClient();
  const unsubscribe = client.subscribe(_ref => {
    let {
      provider,
      webSocketProvider
    } = _ref;
    return {
      provider,
      webSocketProvider
    };
  }, async _ref2 => {
    let {
      provider,
      webSocketProvider
    } = _ref2;
    const provider_ = webSocketProvider !== null && webSocketProvider !== void 0 ? webSocketProvider : provider;

    if (args.listen && !args.chainId && provider_) {
      createListener(provider_);
    }

    const blockNumber = await fetchBlockNumber({
      chainId: args.chainId
    });
    if (!active) return;
    callback(blockNumber);
  }, {
    equalityFn: shallow__default["default"]
  });
  return () => {
    var _previousProvider2;

    active = false;
    unsubscribe();
    provider_ === null || provider_ === void 0 ? void 0 : provider_.off('block', debouncedCallback);
    (_previousProvider2 = previousProvider) === null || _previousProvider2 === void 0 ? void 0 : _previousProvider2.off('block', debouncedCallback);
  };
}

function watchReadContract(config, callback) {
  const client = getProvider.getClient();

  const handleChange = async () => callback(await readContract(config));

  const unwatch = config.listenToBlock ? watchBlockNumber({
    listen: true
  }, handleChange) : undefined;
  const unsubscribe = client.subscribe(_ref => {
    let {
      provider
    } = _ref;
    return provider;
  }, handleChange);
  return () => {
    unsubscribe();
    unwatch === null || unwatch === void 0 ? void 0 : unwatch();
  };
}

function watchReadContracts(config, callback) {
  const client = getProvider.getClient();

  const handleChange = async () => callback(await readContracts(config));

  const unwatch = config.listenToBlock ? watchBlockNumber({
    listen: true
  }, handleChange) : undefined;
  const unsubscribe = client.subscribe(_ref => {
    let {
      provider
    } = _ref;
    return provider;
  }, handleChange);
  return () => {
    unsubscribe();
    unwatch === null || unwatch === void 0 ? void 0 : unwatch();
  };
}

async function deprecatedSendTransaction(_ref) {
  let {
    chainId,
    request
  } = _ref;
  const {
    connector
  } = getProvider.getClient();
  if (!connector) throw new getProvider.ConnectorNotFoundError();

  try {
    var _chain;

    let chain;

    if (chainId) {
      const activeChainId = await connector.getChainId(); // Try to switch chain to provided `chainId`

      if (chainId !== activeChainId) {
        var _connector$chains$fin, _connector$chains$fin2, _connector$chains$fin3, _connector$chains$fin4;

        if (connector.switchChain) chain = await connector.switchChain(chainId);else throw new getProvider.ChainMismatchError({
          activeChain: (_connector$chains$fin = (_connector$chains$fin2 = connector.chains.find(x => x.id === activeChainId)) === null || _connector$chains$fin2 === void 0 ? void 0 : _connector$chains$fin2.name) !== null && _connector$chains$fin !== void 0 ? _connector$chains$fin : "Chain ".concat(activeChainId),
          targetChain: (_connector$chains$fin3 = (_connector$chains$fin4 = connector.chains.find(x => x.id === chainId)) === null || _connector$chains$fin4 === void 0 ? void 0 : _connector$chains$fin4.name) !== null && _connector$chains$fin3 !== void 0 ? _connector$chains$fin3 : "Chain ".concat(chainId)
        });
      }
    }

    const signer = await connector.getSigner({
      chainId: (_chain = chain) === null || _chain === void 0 ? void 0 : _chain.id
    });
    return await signer.sendTransaction(request);
  } catch (error) {
    if (error.code === 4001) throw new getProvider.UserRejectedRequestError(error);
    throw error;
  }
}

/**
 * @description Fetches transaction for hash
 *
 * @example
 * import { fetchTransaction } from '@wagmi/core'
 *
 * const transaction = await fetchTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */
async function fetchTransaction(_ref) {
  let {
    chainId,
    hash
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  return await provider.getTransaction(hash);
}

async function fetchEnsAddress(_ref) {
  let {
    chainId,
    name
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  const address = await provider.resolveName(name);

  try {
    return address ? utils.getAddress(address) : null;
  } catch (_error) {
    return null;
  }
}

async function fetchEnsAvatar(_ref) {
  let {
    addressOrName,
    chainId
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  }); // TODO: Update with more advanced logic
  // https://github.com/ensdomains/ens-avatar

  const avatar = await provider.getAvatar(addressOrName);
  return avatar;
}

async function fetchEnsName(_ref) {
  let {
    address,
    chainId
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  return await provider.lookupAddress(address);
}

async function fetchEnsResolver(_ref) {
  let {
    chainId,
    name
  } = _ref;
  const provider = getProvider.getProvider({
    chainId
  });
  const resolver = await provider.getResolver(name);
  return resolver;
}

/**
 * @description Prepares the parameters required for sending a transaction.
 *
 * Returns config to be passed through to `sendTransaction`.
 *
 * @example
 * import { prepareSendTransaction, sendTransaction } from '@wagmi/core'
 *
 * const config = await prepareSendTransaction({
 *  request: {
 *    to: 'moxey.eth',
 *    value: parseEther('1'),
 *  }
 * })
 * const result = await sendTransaction(config)
 */
async function prepareSendTransaction(_ref) {
  let {
    chainId,
    request,
    signerOrProvider = getProvider.getProvider({
      chainId
    })
  } = _ref;
  const [to, gasLimit] = await Promise.all([utils.isAddress(request.to) ? Promise.resolve(request.to) : fetchEnsAddress({
    name: request.to
  }), request.gasLimit ? Promise.resolve(request.gasLimit) : signerOrProvider.estimateGas(request)]);
  if (!to) throw new Error('Could not resolve ENS name');
  return { ...(chainId ? {
      chainId
    } : {}),
    request: { ...request,
      gasLimit,
      to
    },
    mode: 'prepared'
  };
}

/**
 * @description Function to send a transaction.
 *
 * It is recommended to pair this with the `prepareSendTransaction` function to avoid
 * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { prepareSendTransaction, sendTransaction } from '@wagmi/core'
 *
 * const config = await prepareSendTransaction({
 *  to: 'moxey.eth',
 *  value: parseEther('1'),
 * })
 * const result = await sendTransaction(config)
 */
async function sendTransaction(_ref) {
  let {
    chainId,
    mode,
    request
  } = _ref;

  /********************************************************************/

  /** START: iOS App Link cautious code.                              */

  /** Do not perform any async operations in this block.              */

  /** Ref: wagmi.sh/docs/prepare-hooks/intro#ios-app-link-constraints */

  /********************************************************************/
  // `fetchSigner` isn't really "asynchronous" as we have already
  // initialized the provider upon user connection, so it will return
  // immediately.
  const signer = await fetchSigner();
  if (!signer) throw new getProvider.ConnectorNotFoundError();

  if (mode === 'prepared') {
    if (!request.gasLimit) throw new Error('`gasLimit` is required');
    if (!request.to) throw new Error('`to` is required');
  }

  const {
    chain: activeChain,
    chains
  } = getNetwork();
  const activeChainId = activeChain === null || activeChain === void 0 ? void 0 : activeChain.id;

  if (chainId && chainId !== (activeChain === null || activeChain === void 0 ? void 0 : activeChain.id)) {
    var _chains$find$name, _chains$find, _chains$find$name2, _chains$find2;

    throw new getProvider.ChainMismatchError({
      activeChain: (_chains$find$name = (_chains$find = chains.find(x => x.id === activeChainId)) === null || _chains$find === void 0 ? void 0 : _chains$find.name) !== null && _chains$find$name !== void 0 ? _chains$find$name : "Chain ".concat(activeChainId),
      targetChain: (_chains$find$name2 = (_chains$find2 = chains.find(x => x.id === chainId)) === null || _chains$find2 === void 0 ? void 0 : _chains$find2.name) !== null && _chains$find$name2 !== void 0 ? _chains$find$name2 : "Chain ".concat(chainId)
    });
  }

  try {
    var _connectUnchecked, _ref2;

    // Why don't we just use `signer.sendTransaction`?
    // The `signer.sendTransaction` method performs async
    // heavy operations (such as fetching block number)
    // which is not really needed for our case.
    // Having async heavy operations has side effects
    // when using it in a click handler (iOS deep linking issues,
    // delay to open wallet, etc).
    const uncheckedSigner = (_connectUnchecked = (_ref2 = signer).connectUnchecked) === null || _connectUnchecked === void 0 ? void 0 : _connectUnchecked.call(_ref2);
    const {
      hash,
      wait
    } = await (uncheckedSigner !== null && uncheckedSigner !== void 0 ? uncheckedSigner : signer).sendTransaction(request);
    /********************************************************************/

    /** END: iOS App Link cautious code.                                */

    /** Go nuts!                                                        */

    /********************************************************************/

    return {
      hash,
      wait
    };
  } catch (error) {
    if (error.code === 4001) throw new getProvider.UserRejectedRequestError(error);
    throw error;
  }
}

async function waitForTransaction(_ref) {
  let {
    chainId,
    confirmations,
    hash,
    timeout,
    wait: wait_
  } = _ref;
  let promise;

  if (hash) {
    const provider = getProvider.getProvider({
      chainId
    });
    promise = provider.waitForTransaction(hash, confirmations, timeout);
  } else if (wait_) promise = wait_(confirmations);else throw new Error('hash or wait is required');

  return await promise;
}

/**
 * @description Function to call a contract write method.
 *
 * It is recommended to pair this with the {@link prepareWriteContract} function
 * to avoid [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { prepareWriteContract, writeContract } from '@wagmi/core'
 *
 * const config = await prepareWriteContract({
 *   addressOrName: '0x...',
 *   contractInterface: wagmiAbi,
 *   functionName: 'mint',
 * })
 * const result = await writeContract(config)
 */
async function writeContract(_ref) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    mode,
    overrides,
    request: request_
  } = _ref;

  /********************************************************************/

  /** START: iOS App Link cautious code.                              */

  /** Do not perform any async operations in this block.              */

  /** Ref: wagmi.sh/docs/prepare-hooks/intro#ios-app-link-constraints */

  /********************************************************************/
  const signer = await fetchSigner();
  if (!signer) throw new getProvider.ConnectorNotFoundError();
  const {
    chain: activeChain,
    chains
  } = getNetwork();
  const activeChainId = activeChain === null || activeChain === void 0 ? void 0 : activeChain.id;

  if (chainId && chainId !== activeChainId) {
    var _chains$find$name, _chains$find, _chains$find$name2, _chains$find2;

    throw new getProvider.ChainMismatchError({
      activeChain: (_chains$find$name = (_chains$find = chains.find(x => x.id === activeChainId)) === null || _chains$find === void 0 ? void 0 : _chains$find.name) !== null && _chains$find$name !== void 0 ? _chains$find$name : "Chain ".concat(activeChainId),
      targetChain: (_chains$find$name2 = (_chains$find2 = chains.find(x => x.id === chainId)) === null || _chains$find2 === void 0 ? void 0 : _chains$find2.name) !== null && _chains$find$name2 !== void 0 ? _chains$find$name2 : "Chain ".concat(chainId)
    });
  }

  if (mode === 'prepared') {
    if (!request_) throw new Error('`request` is required');
  }

  const request = mode === 'recklesslyUnprepared' ? (await prepareWriteContract({
    addressOrName,
    args,
    contractInterface,
    functionName,
    overrides
  })).request : request_;
  const transaction = await sendTransaction({
    request,
    mode: 'prepared'
  });
  /********************************************************************/

  /** END: iOS App Link cautious code.                                */

  /** Go nuts!                                                        */

  /********************************************************************/

  return transaction;
}

async function fetchBalance(_ref) {
  var _client$chains, _chain$nativeCurrency, _chain$nativeCurrency2, _chain$nativeCurrency3, _chain$nativeCurrency4;

  let {
    addressOrName,
    chainId,
    formatUnits: unit,
    token
  } = _ref;
  const client = getProvider.getClient();
  const provider = getProvider.getProvider({
    chainId
  });

  if (token) {
    // Convert ENS name to address if required
    let resolvedAddress;
    if (utils.isAddress(addressOrName)) resolvedAddress = addressOrName;else {
      const address = await provider.resolveName(addressOrName); // Same error `provider.getBalance` throws for invalid ENS name

      if (!address) ethers$1.logger.throwError('ENS name not configured', utils.Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "resolveName(".concat(JSON.stringify(addressOrName), ")")
      });
      resolvedAddress = address;
    }

    const fetchContractBalance = async _ref2 => {
      let {
        contractInterface
      } = _ref2;
      const erc20Config = {
        addressOrName: token,
        contractInterface,
        chainId
      };
      const [value, decimals, symbol] = await readContracts({
        allowFailure: false,
        contracts: [{ ...erc20Config,
          functionName: 'balanceOf',
          args: resolvedAddress
        }, { ...erc20Config,
          functionName: 'decimals'
        }, { ...erc20Config,
          functionName: 'symbol'
        }]
      });
      return {
        decimals,
        formatted: utils.formatUnits(value !== null && value !== void 0 ? value : '0', unit !== null && unit !== void 0 ? unit : decimals),
        symbol,
        value
      };
    };

    try {
      return await fetchContractBalance({
        contractInterface: erc20ABI
      });
    } catch (err) {
      // In the chance that there is an error upon decoding the contract result,
      // it could be likely that the contract data is represented as bytes32 instead
      // of a string.
      if (err instanceof getProvider.ContractResultDecodeError) {
        const {
          symbol,
          ...rest
        } = await fetchContractBalance({
          contractInterface: erc20ABI_bytes32
        });
        return {
          symbol: utils.parseBytes32String(symbol),
          ...rest
        };
      }

      throw err;
    }
  }

  const chains = [...(client.provider.chains || []), ...((_client$chains = client.chains) !== null && _client$chains !== void 0 ? _client$chains : [])];
  const value = await provider.getBalance(addressOrName);
  const chain = chains.find(x => x.id === provider.network.chainId);
  return {
    decimals: (_chain$nativeCurrency = chain === null || chain === void 0 ? void 0 : (_chain$nativeCurrency2 = chain.nativeCurrency) === null || _chain$nativeCurrency2 === void 0 ? void 0 : _chain$nativeCurrency2.decimals) !== null && _chain$nativeCurrency !== void 0 ? _chain$nativeCurrency : 18,
    formatted: utils.formatUnits(value !== null && value !== void 0 ? value : '0', unit !== null && unit !== void 0 ? unit : 'ether'),
    symbol: (_chain$nativeCurrency3 = chain === null || chain === void 0 ? void 0 : (_chain$nativeCurrency4 = chain.nativeCurrency) === null || _chain$nativeCurrency4 === void 0 ? void 0 : _chain$nativeCurrency4.symbol) !== null && _chain$nativeCurrency3 !== void 0 ? _chain$nativeCurrency3 : 'ETH',
    value
  };
}

async function fetchSigner() {
  var _client$connector, _client$connector$get;

  const client = getProvider.getClient();
  const signer = (await ((_client$connector = client.connector) === null || _client$connector === void 0 ? void 0 : (_client$connector$get = _client$connector.getSigner) === null || _client$connector$get === void 0 ? void 0 : _client$connector$get.call(_client$connector))) || null;
  return signer;
}

function getAccount() {
  const {
    data,
    connector,
    status
  } = getProvider.getClient();

  switch (status) {
    case 'connected':
      return {
        address: data === null || data === void 0 ? void 0 : data.account,
        connector: connector,
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        status
      };

    case 'reconnecting':
      return {
        address: data === null || data === void 0 ? void 0 : data.account,
        connector,
        isConnected: !!(data !== null && data !== void 0 && data.account),
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: true,
        status
      };

    case 'connecting':
      return {
        address: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: true,
        isDisconnected: false,
        isReconnecting: false,
        status
      };

    case 'disconnected':
      return {
        address: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status
      };
  }
}

function getNetwork() {
  var _client$data, _client$data$chain, _client$chains, _find, _client$data2;

  const client = getProvider.getClient();
  const chainId = (_client$data = client.data) === null || _client$data === void 0 ? void 0 : (_client$data$chain = _client$data.chain) === null || _client$data$chain === void 0 ? void 0 : _client$data$chain.id;
  const activeChains = (_client$chains = client.chains) !== null && _client$chains !== void 0 ? _client$chains : [];
  const activeChain = (_find = [...(client.provider.chains || []), ...activeChains].find(x => x.id === chainId)) !== null && _find !== void 0 ? _find : {
    id: chainId,
    name: "Chain ".concat(chainId),
    network: "".concat(chainId),
    rpcUrls: {
      default: ''
    }
  };
  return {
    chain: chainId ? { ...activeChain,
      ...((_client$data2 = client.data) === null || _client$data2 === void 0 ? void 0 : _client$data2.chain),
      id: chainId
    } : undefined,
    chains: activeChains
  };
}

async function signMessage(args) {
  try {
    const signer = await fetchSigner();
    if (!signer) throw new getProvider.ConnectorNotFoundError();
    return await signer.signMessage(args.message);
  } catch (error) {
    if (error.code === 4001) throw new getProvider.UserRejectedRequestError(error);
    throw error;
  }
}

async function signTypedData(_ref) {
  let {
    domain,
    types,
    value
  } = _ref;
  const signer = await fetchSigner();
  if (!signer) throw new getProvider.ConnectorNotFoundError();
  const {
    chain: activeChain,
    chains
  } = getNetwork();
  const {
    chainId: chainId_
  } = domain;

  if (chainId_) {
    const chainId = getProvider.normalizeChainId(chainId_);
    const activeChainId = activeChain === null || activeChain === void 0 ? void 0 : activeChain.id;

    if (chainId !== (activeChain === null || activeChain === void 0 ? void 0 : activeChain.id)) {
      var _chains$find$name, _chains$find, _chains$find$name2, _chains$find2;

      throw new getProvider.ChainMismatchError({
        activeChain: (_chains$find$name = (_chains$find = chains.find(x => x.id === activeChainId)) === null || _chains$find === void 0 ? void 0 : _chains$find.name) !== null && _chains$find$name !== void 0 ? _chains$find$name : "Chain ".concat(activeChainId),
        targetChain: (_chains$find$name2 = (_chains$find2 = chains.find(x => x.id === chainId)) === null || _chains$find2 === void 0 ? void 0 : _chains$find2.name) !== null && _chains$find$name2 !== void 0 ? _chains$find$name2 : "Chain ".concat(chainId)
      });
    }
  } // Method name may be changed in the future, see https://docs.ethers.io/v5/api/signer/#Signer-signTypedData


  return await signer._signTypedData(domain, types, value);
}

async function switchNetwork(_ref) {
  let {
    chainId
  } = _ref;
  const {
    connector
  } = getProvider.getClient();
  if (!connector) throw new getProvider.ConnectorNotFoundError();
  if (!connector.switchChain) throw new getProvider.SwitchChainNotSupportedError({
    connector
  });
  return await connector.switchChain(chainId);
}

function watchAccount(callback) {
  let {
    selector = x => x
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const client = getProvider.getClient();

  const handleChange = () => callback(getAccount());

  const unsubscribe = client.subscribe(_ref => {
    let {
      data,
      connector,
      status
    } = _ref;
    return selector({
      address: data === null || data === void 0 ? void 0 : data.account,
      connector,
      status
    });
  }, handleChange, {
    equalityFn: shallow__default["default"]
  });
  return unsubscribe;
}

function watchNetwork(callback) {
  let {
    selector = x => x
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const client = getProvider.getClient();

  const handleChange = () => callback(getNetwork());

  const unsubscribe = client.subscribe(_ref => {
    var _data$chain;

    let {
      data,
      chains
    } = _ref;
    return selector({
      chainId: data === null || data === void 0 ? void 0 : (_data$chain = data.chain) === null || _data$chain === void 0 ? void 0 : _data$chain.id,
      chains
    });
  }, handleChange, {
    equalityFn: shallow__default["default"]
  });
  return unsubscribe;
}

function watchSigner(callback) {
  const client = getProvider.getClient();

  const handleChange = async () => callback(await fetchSigner());

  const unsubscribe = client.subscribe(_ref => {
    var _data$chain;

    let {
      data,
      connector
    } = _ref;
    return {
      account: data === null || data === void 0 ? void 0 : data.account,
      chainId: data === null || data === void 0 ? void 0 : (_data$chain = data.chain) === null || _data$chain === void 0 ? void 0 : _data$chain.id,
      connector
    };
  }, handleChange, {
    equalityFn: shallow__default["default"]
  });
  return unsubscribe;
}

async function fetchFeeData() {
  let {
    chainId,
    formatUnits: units = 'wei'
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const provider = getProvider.getProvider({
    chainId
  });
  const feeData = await provider.getFeeData();
  const formatted = {
    gasPrice: feeData.gasPrice ? utils.formatUnits(feeData.gasPrice, units) : null,
    maxFeePerGas: feeData.maxFeePerGas ? utils.formatUnits(feeData.maxFeePerGas, units) : null,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? utils.formatUnits(feeData.maxPriorityFeePerGas, units) : null
  };
  return { ...feeData,
    formatted
  };
}

exports.AddChainError = getProvider.AddChainError;
exports.ChainDoesNotSupportMulticallError = getProvider.ChainDoesNotSupportMulticallError;
exports.ChainMismatchError = getProvider.ChainMismatchError;
exports.ChainNotConfiguredError = getProvider.ChainNotConfiguredError;
exports.Client = getProvider.Client;
exports.Connector = getProvider.Connector;
exports.ConnectorAlreadyConnectedError = getProvider.ConnectorAlreadyConnectedError;
exports.ConnectorNotFoundError = getProvider.ConnectorNotFoundError;
exports.ContractMethodDoesNotExistError = getProvider.ContractMethodDoesNotExistError;
exports.ContractMethodNoResultError = getProvider.ContractMethodNoResultError;
exports.ContractMethodRevertedError = getProvider.ContractMethodRevertedError;
exports.ContractResultDecodeError = getProvider.ContractResultDecodeError;
exports.InjectedConnector = getProvider.InjectedConnector;
exports.ProviderChainsNotFound = getProvider.ProviderChainsNotFound;
exports.ProviderRpcError = getProvider.ProviderRpcError;
exports.ResourceUnavailableError = getProvider.ResourceUnavailableError;
exports.RpcError = getProvider.RpcError;
exports.SwitchChainError = getProvider.SwitchChainError;
exports.SwitchChainNotSupportedError = getProvider.SwitchChainNotSupportedError;
exports.UserRejectedRequestError = getProvider.UserRejectedRequestError;
exports.createClient = getProvider.createClient;
exports.createStorage = getProvider.createStorage;
exports.getProvider = getProvider.getProvider;
exports.noopStorage = getProvider.noopStorage;
exports.normalizeChainId = getProvider.normalizeChainId;
exports.allChains = chains.allChains;
exports.chain = chains.chain;
exports.chainId = chains.chainId;
exports.defaultChains = chains.defaultChains;
exports.defaultL2Chains = chains.defaultL2Chains;
exports.etherscanBlockExplorers = chains.etherscanBlockExplorers;
exports.alchemyRpcUrls = rpcs.alchemyRpcUrls;
exports.infuraRpcUrls = rpcs.infuraRpcUrls;
exports.publicRpcUrls = rpcs.publicRpcUrls;
exports.configureChains = configureChains;
exports.connect = connect;
exports.deepEqual = deepEqual;
exports.deprecatedSendTransaction = deprecatedSendTransaction;
exports.deprecatedWriteContract = deprecatedWriteContract;
exports.disconnect = disconnect;
exports.erc20ABI = erc20ABI;
exports.erc721ABI = erc721ABI;
exports.fetchBalance = fetchBalance;
exports.fetchBlockNumber = fetchBlockNumber;
exports.fetchEnsAddress = fetchEnsAddress;
exports.fetchEnsAvatar = fetchEnsAvatar;
exports.fetchEnsName = fetchEnsName;
exports.fetchEnsResolver = fetchEnsResolver;
exports.fetchFeeData = fetchFeeData;
exports.fetchSigner = fetchSigner;
exports.fetchToken = fetchToken;
exports.fetchTransaction = fetchTransaction;
exports.getAccount = getAccount;
exports.getContract = getContract;
exports.getNetwork = getNetwork;
exports.getWebSocketProvider = getWebSocketProvider;
exports.minimizeContractInterface = minimizeContractInterface;
exports.parseContractResult = parseContractResult;
exports.prepareSendTransaction = prepareSendTransaction;
exports.prepareWriteContract = prepareWriteContract;
exports.readContract = readContract;
exports.readContracts = readContracts;
exports.sendTransaction = sendTransaction;
exports.signMessage = signMessage;
exports.signTypedData = signTypedData;
exports.switchNetwork = switchNetwork;
exports.units = units;
exports.waitForTransaction = waitForTransaction;
exports.watchAccount = watchAccount;
exports.watchBlockNumber = watchBlockNumber;
exports.watchContractEvent = watchContractEvent;
exports.watchNetwork = watchNetwork;
exports.watchProvider = watchProvider;
exports.watchReadContract = watchReadContract;
exports.watchReadContracts = watchReadContracts;
exports.watchSigner = watchSigner;
exports.watchWebSocketProvider = watchWebSocketProvider;
exports.writeContract = writeContract;
