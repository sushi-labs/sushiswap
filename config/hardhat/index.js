require('dotenv/config')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-solhint')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@tenderly/hardhat-tenderly')
require('@typechain/hardhat')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
require('@matterlabs/hardhat-zksync-deploy')
require('@matterlabs/hardhat-zksync-solc')

const accounts = process.env.PRIVATE_KEY
  ? [
      process.env.PRIVATE_KEY,
      ...(process.env.FUNDER_PRIVATE_KEY
        ? [process.env.FUNDER_PRIVATE_KEY]
        : []),
    ]
  : {
      mnemonic:
        process.env.MNEMONIC ||
        'test test test test test test test test test test test junk',
      accountsBalance: '990000000000000000000',
    }

/**
 * @type {import('hardhat/config').HardhatUserConfig}
 */
module.exports.defaultConfig = {
  etherscan: {
    customChains: [
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz',
        },
      },
      {
        network: 'kava',
        chainId: 2222,
        urls: {
          apiURL: 'https://api.verify.mintscan.io/evm/api/0x8ae',
          browserURL: 'https://kavascan.com',
        },
      },
      {
        network: 'metis',
        chainId: 1088,
        urls: {
          apiURL: 'https://andromeda-explorer.metis.io/api',
          browserURL: 'https://andromeda-explorer.metis.io',
        },
      },
      {
        network: 'scroll',
        chainId: 534352,
        urls: {
          apiURL: 'https://api.scrollscan.com/api',
          browserURL: 'https://scrollscan.com/',
        },
      },
      {
        network: 'bttc',
        chainId: 199,
        urls: {
          apiURL: 'https://api.bttcscan.com/api',
          browserURL: 'https://bttcscan.com/',
        },
      },
      {
        network: 'cronos',
        chainId: 25,
        urls: {
          apiURL: 'https://api.cronoscan.com/api',
          browserURL: 'https://cronoscan.com/',
        },
      },
      {
        network: 'arbitrum-nova',
        chainId: 42170,
        urls: {
          apiURL: 'https://api-nova.arbiscan.io/api',
          browserURL: 'https://arbiscan.io/',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://api.lineascan.build',
        },
      },
      {
        network: 'celo',
        chainId: 42220,
        urls: {
          apiURL: 'https://api.celoscan.io/api',
          browserURL: 'https://celoscan.io',
        },
      },
      {
        network: 'haqq',
        chainId: 11235,
        urls: {
          apiURL: 'https://explorer.haqq.network/api',
          browserURL: 'https://explorer.haqq.network',
        },
      },
      {
        network: 'thundercore',
        chainId: 108,
        urls: {
          apiURL: 'https://explorer-mainnet.thundercore.com/api',
          browserURL: 'https://explorer-mainnet.thundercore.com',
        },
      },
      {
        network: 'zetachain',
        chainId: 7000,
        urls: {
          apiURL: 'https://zetachain.blockscout.com/api',
          browserURL: 'https://zetachain.blockscout.com',
        },
      },
      {
        network: 'fuse',
        chainId: 122,
        urls: {
          apiURL: 'https://explorer.fuse.io/api',
          browserURL: 'https://explorer.fuse.io',
        },
      },
      {
        network: 'polygonzkevm',
        chainId: 1101,
        urls: {
          apiURL: 'https://api-zkevm.polygonscan.com/api',
          browserURL: 'https://zkevm.polygonscan.com',
        },
      },
      {
        network: 'core',
        chainId: 1116,
        urls: {
          apiURL: 'https://openapi.coredao.org/api',
          browserURL: 'https://scan.coredao.org',
        },
      },
      {
        network: 'boba',
        chainId: 288,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan',
          browserURL: 'https://bobascan.com',
        },
      },
      {
        network: 'boba-bnb',
        chainId: 56288,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/mainnet/evm/56288/etherscan',
          browserURL: 'https://bobascan.com',
        },
      },
      {
        network: 'blast',
        chainId: 81457,
        urls: {
          apiURL: 'https://api.blastscan.io/api',
          browserURL: 'https://blastscan.io',
        },
      },
      {
        network: 'harmony',
        chainId: 1666600000,
        urls: {
          apiURL: 'https://explorer.harmony.one/api',
          browserURL: 'https://explorer.harmony.one',
        },
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build/',
        },
      },
      {
        network: 'metis',
        chainId: 1088,
        urls: {
          apiURL: 'https://rootstock.blockscout.com/api',
          browserURL: 'https://rootstock.blockscout.com',
        },
      },
      {
        network: 'rootstock',
        chainId: 30,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan',
          browserURL: 'https://explorer.metis.io',
        },
      },
      {
        network: 'skale-europa',
        chainId: 2046399126,
        urls: {
          apiURL: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com/api',
          browserURL: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
        },
      },
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz',
        },
      },
      {
        network: 'manta-pacific',
        chainId: 169,
        urls: {
          apiURL: 'https://pacific-explorer.manta.network/api',
          browserURL: 'https://pacific-explorer.manta.network',
        },
      },
      {
        network: 'mode',
        chainId: 34443,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan',
          browserURL: 'https://modescan.io',
        },
      },
      {
        network: 'taiko',
        chainId: 167000,
        urls: {
          apiURL: 'https://api.taikoscan.io/api',
          browserURL: 'https://taikoscan.io',
        },
      },
      {
        network: 'zklink-nova',
        chainId: 810180,
        urls: {
          apiURL: 'https://explorer.zklink.io/contract_verification',
          browserURL: 'https://explorer.zklink.io',
        },
      },
    ],
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      ropsten: process.env.ETHERSCAN_API_KEY || '',
      rinkeby: process.env.ETHERSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || '',
      kovan: process.env.ETHERSCAN_API_KEY || '',
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      // binance smart chain
      bsc: process.env.BSCSCAN_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
      // huobi eco chain
      heco: process.env.HECOINFO_API_KEY || '',
      hecoTestnet: process.env.HECOINFO_API_KEY || '',
      // fantom mainnet
      opera: process.env.FTMSCAN_API_KEY || '',
      ftmTestnet: process.env.FTMSCAN_API_KEY || '',
      // optimism
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || '',
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      // arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      arbitrumTestnet: process.env.ARBISCAN_API_KEY || '',
      // avalanche
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      // moonbeam
      moonbeam: process.env.MOONBEAM_MOONSCAN_API_KEY || '',
      moonriver: process.env.MOONRIVER_MOONSCAN_API_KEY || '',
      moonbaseAlpha: process.env.MOONBASE_MOONSCAN_API_KEY || '',
      // harmony
      harmony: process.env.HARMONY_API_KEY || '',
      harmonyTest: process.env.HARMONY_API_KEY || '',
      bttc: process.env.BTTC_API_KEY || '',
      gnosis: process.env.GNOSIS_API_KEY || '',
      scroll: process.env.SCROLL_API_KEY || '',
      cronos: process.env.CRONOS_API_KEY || '',
      'arbitrum-nova': process.env.ARBITRUM_NOVA_KEY || '',
      base: process.env.BASE_API_KEY || '',
      linea: process.env.LINEA_API_KEY || '',
      celo: process.env.CELO_API_KEY || '',
      polygonzkevm: process.env.POLYGONZKEVM_API_KEY || '',
      core: process.env.CORE_API_KEY || '',
      blast: process.env.BLAST_API_KEY || '',
      xdai: 'api-key',
      sokol: 'api-key',
      aurora: 'api-key',
      auroraTestnet: 'api-key',
      metis: 'api-key',
      haqq: 'api-key',
      kava: 'api-key',
      thundercore: 'api-key',
      zetachain: 'api-key',
      fuse: 'api-key',
      boba: 'api-key',
      'boba-bnb': 'api-key',
      rootstock: 'api-key',
      'skale-europa': 'api-key',
      mantle: 'api-key',
      'manta-pacific': 'api-key',
      mode: 'api-key',
      taiko: process.env.TAIKO_API_KEY || '',
      'zklink-nova': 'api-key',
    },
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    // alwaysGenerateOverloads: true;
    // discriminateTypes: boolean;
    // tsNocheck: boolean;
    // externalArtifacts?: string[];
  },
  zksolc: {
    version: '1.5.2',
    compilerSource: 'binary',
    settings: {},
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: false,
      tags: ['local'],
    },
    hardhat: {
      chainId: 31337,
      accounts,
      live: false,
      saveDeployments: false,
      tags: ['test', 'local'],
      // Solidity-coverage overrides gasPrice to 1 which is not compatible with EIP1559
      hardfork: process.env.CODE_COVERAGE ? 'berlin' : 'london',
      forking: {
        enabled: process.env.FORKING === 'true',
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
      },
    },
    'zksync-testnet': {
      url: 'https://zksync2-testnet.zksync.dev', // URL of the zkSync network RPC
      ethNetwork: 'goerli', // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
    'scroll-alpha-testnet': {
      url: 'https://alpha-rpc.scroll.io/l2',
      accounts,
      chainId: 534353,
      live: true,
      saveDeployments: true,
    },
    consensyszkevmgoerli: {
      url: 'https://consensys-zkevm-goerli-prealpha.infura.io/v3/53fca4c2b95a43cca82a11e8b573256b',
      accounts,
      chainId: 59140,
      live: true,
      saveDeployments: true,
    },
    basegoerli: {
      url: 'https://goerli.base.org',
      accounts,
      chainId: 84531,
      live: true,
      saveDeployments: true,
    },
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
      accounts,
      chainId: 1,
      live: true,
      saveDeployments: true,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    sepolia: {
      url: 'https://rpc.sepolia.org',
      accounts,
      chainId: 11155111,
      live: true,
      saveDeployments: true,
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
    },
    'fantom-testnet': {
      url: 'https://rpc.testnet.fantom.network',
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    polygon: {
      url: 'https://polygon.llamarpc.com',
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    gnosis: {
      url: 'https://rpc.ankr.com/gnosis',
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    'bsc-testnet': {
      url: 'https://data-seed-prebsc-2-s3.binance.org:8545',
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    heco: {
      url: 'https://http-mainnet.hecochain.com',
      accounts,
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    'heco-testnet': {
      url: 'https://http-testnet.hecochain.com',
      accounts,
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    harmony: {
      url: 'https://rpc.ankr.com/harmony',
      accounts,
      chainId: 1666600000,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    'harmony-testnet': {
      url: 'https://api.s0.b.hmny.io',
      accounts,
      chainId: 1666700000,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    okex: {
      url: 'https://exchainrpc.okex.org',
      accounts,
      chainId: 66,
      live: true,
      saveDeployments: true,
    },
    'okex-testnet': {
      url: 'https://exchaintestrpc.okex.org',
      accounts,
      chainId: 65,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts,
      chainId: 42161,
      live: true,
      saveDeployments: true,
      blockGasLimit: 700000,
    },
    celo: {
      url: 'https://forno.celo.org',
      accounts,
      chainId: 42220,
      live: true,
      saveDeployments: true,
    },
    palm: {
      url: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108109,
      live: true,
      saveDeployments: true,
    },
    'palm-testnet': {
      url: 'https://palm-testnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108099,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    moonriver: {
      url: 'https://rpc.moonriver.moonbeam.network',
      accounts,
      chainId: 1285,
      live: true,
      saveDeployments: true,
    },
    fuse: {
      url: 'https://rpc.fuse.io',
      accounts,
      chainId: 122,
      live: true,
      saveDeployments: true,
    },
    clover: {
      url: 'https://rpc-ivy.clover.finance',
      accounts,
      chainId: 1024,
      live: true,
      saveDeployments: true,
    },
    telos: {
      url: 'https://mainnet.telos.net/evm',
      accounts,
      chainId: 40,
      live: true,
      saveDeployments: true,
    },
    moonbeam: {
      url: 'https://rpc.api.moonbeam.network',
      accounts,
      chainId: 1284,
      live: true,
      saveDeployments: true,
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      accounts,
      chainId: 10,
      live: true,
      saveDeployments: true,
    },
    kava: {
      url: 'https://evm.kava.io',
      accounts,
      chainId: 2222,
      live: true,
      saveDeployments: true,
    },
    metis: {
      url: 'https://andromeda.metis.io/?owner=1088',
      accounts,
      chainId: 1088,
      live: true,
      saveDeployments: true,
    },
    'arbitrum-nova': {
      url: 'https://nova.arbitrum.io/rpc',
      accounts,
      chainId: 42170,
      live: true,
      saveDeployments: true,
    },
    boba: {
      url: 'https://mainnet.boba.network',
      accounts,
      chainId: 288,
      live: true,
      saveDeployments: true,
    },
    'boba-avax': {
      url: 'https://avax.boba.network',
      accounts,
      chainId: 43288,
      live: true,
      saveDeployments: true,
    },
    bttc: {
      url: 'https://rpc.bittorrentchain.io',
      accounts,
      chainId: 199,
      live: true,
      saveDeployments: true,
    },
    'boba-bnb': {
      url: 'https://bnb.boba.network',
      accounts,
      chainId: 56288,
      live: true,
      saveDeployments: true,
    },
    polygonzkevm: {
      url: 'https://zkevm-rpc.com',
      accounts,
      chainId: 1101,
      live: true,
      saveDeployments: true,
    },
    thundercore: {
      url: 'https://mainnet-rpc.thundertoken.net',
      accounts,
      chainId: 108,
      live: true,
      saveDeployments: true,
    },
    filecoin: {
      url: 'https://rpc.ankr.com/filecoin',
      accounts,
      chainId: 314,
      live: true,
      saveDeployments: true,
    },
    haqq: {
      url: 'https://rpc.eth.haqq.network',
      accounts,
      chainId: 11235,
      live: true,
      saveDeployments: true,
    },
    core: {
      url: 'https://rpc.coredao.org',
      accounts,
      chainId: 1116,
      live: true,
      saveDeployments: true,
    },
    linea: {
      url: 'https://rpc.linea.build',
      accounts,
      chainId: 59144,
      live: true,
      saveDeployments: true,
    },
    base: {
      url: 'https://developer-access-mainnet.base.org',
      accounts,
      chainId: 8453,
      live: true,
      saveDeployments: true,
    },
    scroll: {
      url: 'https://rpc.scroll.io/',
      accounts,
      chainId: 534352,
      live: true,
      saveDeployments: true,
    },
    zetachain: {
      url: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
      accounts,
      chainId: 7000,
      live: true,
      saveDeployments: true,
    },
    cronos: {
      url: 'https://cronos.blockpi.network/v1/rpc/public',
      accounts,
      chainId: 25,
      live: true,
      saveDeployments: true,
    },
    blast: {
      url: 'https://rpc.blast.io',
      accounts,
      chainId: 81457,
      live: true,
      saveDeployments: true,
    },
    rootstock: {
      url: 'https://mycrypto.rsk.co',
      accounts,
      chainId: 30,
      live: true,
      saveDeployments: true,
    },
    'skale-europa': {
      url: 'https://mainnet.skalenodes.com/v1/elated-tan-skat',
      accounts,
      chainId: 2046399126,
      live: true,
      saveDeployments: true,
    },
    mantle: {
      url: 'https://mantle.drpc.org',
      accounts,
      chainId: 5000,
      live: true,
      saveDeployments: true,
    },
    'manta-pacific': {
      url: 'https://manta-pacific.drpc.org',
      accounts,
      chainId: 169,
      live: true,
      saveDeployments: true,
    },
    mode: {
      url: 'https://mode.drpc.org',
      accounts,
      chainId: 34443,
      live: true,
      saveDeployments: true,
    },
    taiko: {
      url: 'https://rpc.taiko.tools',
      accounts,
      chainId: 167000,
      live: true,
      saveDeployments: true,
    },
    'zklink-nova': {
      url: 'https://rpc.zklink.io',
      accounts,
      chainId: 810180,
      live: true,
      saveDeployments: true,
      zksync: true,
    },
  },
  namedAccounts: {
    // e.g. ledger://0x18dd4e0Eb8699eA4fee238dE41ecF115e32272F8
    deployer: process.env.LEDGER || { default: 0 },
    funder: { default: 1 },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
    dev: {
      default: 4,
    },
    feeTo: {
      default: 5,
    },
  },
}
