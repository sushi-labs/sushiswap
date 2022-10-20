'use strict';

var rpcs = require('./rpcs-d2cd65f1.cjs.dev.js');

const etherscanBlockExplorers = {
  mainnet: {
    name: 'Etherscan',
    url: 'https://etherscan.io'
  },
  ropsten: {
    name: 'Etherscan',
    url: 'https://ropsten.etherscan.io'
  },
  rinkeby: {
    name: 'Etherscan',
    url: 'https://rinkeby.etherscan.io'
  },
  goerli: {
    name: 'Etherscan',
    url: 'https://goerli.etherscan.io'
  },
  kovan: {
    name: 'Etherscan',
    url: 'https://kovan.etherscan.io'
  },
  sepolia: {
    name: 'Etherscan',
    url: 'https://sepolia.etherscan.io'
  },
  optimism: {
    name: 'Etherscan',
    url: 'https://optimistic.etherscan.io'
  },
  optimismKovan: {
    name: 'Etherscan',
    url: 'https://kovan-optimistic.etherscan.io'
  },
  polygon: {
    name: 'PolygonScan',
    url: 'https://polygonscan.com'
  },
  polygonMumbai: {
    name: 'PolygonScan',
    url: 'https://mumbai.polygonscan.com'
  },
  arbitrum: {
    name: 'Arbiscan',
    url: 'https://arbiscan.io'
  },
  arbitrumRinkeby: {
    name: 'Arbiscan',
    url: 'https://testnet.arbiscan.io'
  }
};

const chainId = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  sepolia: 11155111,
  optimism: 10,
  optimismKovan: 69,
  optimismGoerli: 420,
  polygon: 137,
  polygonMumbai: 80001,
  arbitrum: 42161,
  arbitrumRinkeby: 421611,
  arbitrumGoerli: 421613,
  localhost: 1337,
  hardhat: 31337,
  foundry: 31337
};
const mainnet = {
  id: chainId.mainnet,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.mainnet,
    default: rpcs.publicRpcUrls.mainnet,
    infura: rpcs.infuraRpcUrls.mainnet,
    public: rpcs.publicRpcUrls.mainnet
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.mainnet,
    default: etherscanBlockExplorers.mainnet
  },
  ens: {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 14353601
  }
};
const ropsten = {
  id: chainId.ropsten,
  name: 'Ropsten',
  network: 'ropsten',
  nativeCurrency: {
    name: 'Ropsten Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.ropsten,
    default: rpcs.publicRpcUrls.ropsten,
    infura: rpcs.infuraRpcUrls.ropsten,
    public: rpcs.publicRpcUrls.ropsten
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.ropsten,
    default: etherscanBlockExplorers.ropsten
  },
  ens: {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 12063863
  },
  testnet: true
};
const rinkeby = {
  id: chainId.rinkeby,
  name: 'Rinkeby',
  network: 'rinkeby',
  nativeCurrency: {
    name: 'Rinkeby Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.rinkeby,
    default: rpcs.publicRpcUrls.rinkeby,
    infura: rpcs.infuraRpcUrls.rinkeby,
    public: rpcs.publicRpcUrls.rinkeby
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.rinkeby,
    default: etherscanBlockExplorers.rinkeby
  },
  ens: {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 10299530
  },
  testnet: true
};
const goerli = {
  id: chainId.goerli,
  name: 'Goerli',
  network: 'goerli',
  nativeCurrency: {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.goerli,
    default: rpcs.publicRpcUrls.goerli,
    infura: rpcs.infuraRpcUrls.goerli,
    public: rpcs.publicRpcUrls.goerli
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.goerli,
    default: etherscanBlockExplorers.goerli
  },
  ens: {
    address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 6507670
  },
  testnet: true
};
const kovan = {
  id: chainId.kovan,
  name: 'Kovan',
  network: 'kovan',
  nativeCurrency: {
    name: 'Kovan Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.kovan,
    default: rpcs.publicRpcUrls.kovan,
    infura: rpcs.infuraRpcUrls.kovan,
    public: rpcs.publicRpcUrls.kovan
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.kovan,
    default: etherscanBlockExplorers.kovan
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 30285908
  },
  testnet: true
};
const sepolia = {
  id: chainId.sepolia,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: rpcs.publicRpcUrls.sepolia,
    infura: rpcs.infuraRpcUrls.sepolia,
    public: rpcs.publicRpcUrls.sepolia
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.sepolia,
    default: etherscanBlockExplorers.sepolia
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 751532
  },
  testnet: true
};
const optimism = {
  id: chainId.optimism,
  name: 'Optimism',
  network: 'optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.optimism,
    default: rpcs.publicRpcUrls.optimism,
    infura: rpcs.infuraRpcUrls.optimism,
    public: rpcs.publicRpcUrls.optimism
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.optimism,
    default: etherscanBlockExplorers.optimism
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 4286263
  }
};
const optimismKovan = {
  id: chainId.optimismKovan,
  name: 'Optimism Kovan',
  network: 'optimism-kovan',
  nativeCurrency: {
    name: 'Kovan Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.optimismKovan,
    default: rpcs.publicRpcUrls.optimismKovan,
    infura: rpcs.infuraRpcUrls.optimismKovan,
    public: rpcs.publicRpcUrls.optimismKovan
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.optimismKovan,
    default: etherscanBlockExplorers.optimismKovan
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 1418387
  },
  testnet: true
};
const optimismGoerli = {
  id: chainId.optimismGoerli,
  name: 'Optimism Goerli',
  network: 'optimism-goerli',
  nativeCurrency: {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.optimismGoerli,
    default: rpcs.publicRpcUrls.optimismGoerli,
    infura: rpcs.infuraRpcUrls.optimismGoerli,
    public: rpcs.publicRpcUrls.optimismGoerli
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.com/optimism/goerli'
    }
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 49461
  },
  testnet: true
};
const polygon = {
  id: chainId.polygon,
  name: 'Polygon',
  network: 'matic',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.polygon,
    default: rpcs.publicRpcUrls.polygon,
    infura: rpcs.infuraRpcUrls.polygon,
    public: rpcs.publicRpcUrls.polygon
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.polygon,
    default: etherscanBlockExplorers.polygon
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 25770160
  }
};
const polygonMumbai = {
  id: chainId.polygonMumbai,
  name: 'Polygon Mumbai',
  network: 'maticmum',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.polygonMumbai,
    default: rpcs.publicRpcUrls.polygonMumbai,
    infura: rpcs.infuraRpcUrls.polygonMumbai,
    public: rpcs.publicRpcUrls.polygonMumbai
  },
  blockExplorers: {
    etherscan: etherscanBlockExplorers.polygonMumbai,
    default: etherscanBlockExplorers.polygonMumbai
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 25444704
  },
  testnet: true
};
const arbitrum = {
  id: chainId.arbitrum,
  name: 'Arbitrum One',
  network: 'arbitrum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.arbitrum,
    default: rpcs.publicRpcUrls.arbitrum,
    infura: rpcs.infuraRpcUrls.arbitrum,
    public: rpcs.publicRpcUrls.arbitrum
  },
  blockExplorers: {
    arbitrum: {
      name: 'Arbitrum Explorer',
      url: 'https://explorer.arbitrum.io'
    },
    etherscan: etherscanBlockExplorers.arbitrum,
    default: etherscanBlockExplorers.arbitrum
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 7654707
  }
};
const arbitrumRinkeby = {
  id: chainId.arbitrumRinkeby,
  name: 'Arbitrum Rinkeby',
  network: 'arbitrum-rinkeby',
  nativeCurrency: {
    name: 'Arbitrum Rinkeby Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.arbitrumRinkeby,
    default: rpcs.publicRpcUrls.arbitrumRinkeby,
    infura: rpcs.infuraRpcUrls.arbitrumRinkeby,
    public: rpcs.publicRpcUrls.arbitrumRinkeby
  },
  blockExplorers: {
    arbitrum: {
      name: 'Arbitrum Explorer',
      url: 'https://rinkeby-explorer.arbitrum.io'
    },
    etherscan: etherscanBlockExplorers.arbitrumRinkeby,
    default: etherscanBlockExplorers.arbitrumRinkeby
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 10228837
  },
  testnet: true
};
const arbitrumGoerli = {
  id: chainId.arbitrumGoerli,
  name: 'Arbitrum Goerli',
  network: 'arbitrum-goerli',
  nativeCurrency: {
    name: 'Arbitrum Goerli Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    alchemy: rpcs.alchemyRpcUrls.arbitrumGoerli,
    default: rpcs.publicRpcUrls.arbitrumGoerli,
    infura: rpcs.infuraRpcUrls.arbitrumGoerli,
    public: rpcs.publicRpcUrls.arbitrumGoerli
  },
  blockExplorers: {
    default: {
      name: 'Arbitrum Explorer',
      url: 'https://goerli-rollup-explorer.arbitrum.io'
    }
  },
  multicall: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
    blockCreated: 88114
  },
  testnet: true
};
const localhost = {
  id: chainId.localhost,
  name: 'Localhost',
  network: 'localhost',
  rpcUrls: {
    default: 'http://127.0.0.1:8545'
  }
};
const hardhat = {
  id: chainId.hardhat,
  name: 'Hardhat',
  network: 'hardhat',
  rpcUrls: {
    default: 'http://127.0.0.1:8545'
  }
};
const foundry = {
  id: chainId.foundry,
  name: 'Foundry',
  network: 'foundry',
  rpcUrls: {
    default: 'http://127.0.0.1:8545'
  }
};
/**
 * Common chains for convenience
 * Should not contain all possible chains
 */

const chain = {
  mainnet,
  ropsten,
  rinkeby,
  goerli,
  kovan,
  sepolia,
  optimism,
  optimismGoerli,
  optimismKovan,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
  arbitrumRinkeby,
  localhost,
  hardhat,
  foundry
};
const allChains = [mainnet, ropsten, rinkeby, goerli, kovan, sepolia, optimism, optimismKovan, optimismGoerli, polygon, polygonMumbai, arbitrum, arbitrumGoerli, arbitrumRinkeby, localhost, hardhat, foundry];
const defaultChains = [mainnet, ropsten, rinkeby, goerli, kovan];
const defaultL2Chains = [arbitrum, arbitrumRinkeby, arbitrumGoerli, optimism, optimismKovan, optimismGoerli];

exports.allChains = allChains;
exports.arbitrum = arbitrum;
exports.arbitrumGoerli = arbitrumGoerli;
exports.arbitrumRinkeby = arbitrumRinkeby;
exports.chain = chain;
exports.chainId = chainId;
exports.defaultChains = defaultChains;
exports.defaultL2Chains = defaultL2Chains;
exports.etherscanBlockExplorers = etherscanBlockExplorers;
exports.foundry = foundry;
exports.goerli = goerli;
exports.hardhat = hardhat;
exports.kovan = kovan;
exports.localhost = localhost;
exports.mainnet = mainnet;
exports.optimism = optimism;
exports.optimismGoerli = optimismGoerli;
exports.optimismKovan = optimismKovan;
exports.polygon = polygon;
exports.polygonMumbai = polygonMumbai;
exports.rinkeby = rinkeby;
exports.ropsten = ropsten;
exports.sepolia = sepolia;
