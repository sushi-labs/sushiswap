export default [
  {
    "name": "Ethereum Mainnet",
    "chain": "ETH",
    "icon": "ethereum",
    "rpc": [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
      "https://ethereum.publicnode.com"
    ],
    "features": [
      {
        "name": "EIP155"
      },
      {
        "name": "EIP1559"
      }
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://ethereum.org",
    "shortName": "eth",
    "chainId": 1,
    "networkId": 1,
    "slip44": 60,
    "ens": {
      "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
    },
    "explorers": [
      {
        "name": "etherscan",
        "url": "https://etherscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Ropsten",
    "title": "Ethereum Testnet Ropsten",
    "chain": "ETH",
    "rpc": [
      "https://ropsten.infura.io/v3/${INFURA_API_KEY}",
      "wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}"
    ],
    "faucets": [
      "http://fauceth.komputing.org?chain=3&address=${ADDRESS}",
      "https://faucet.ropsten.be?${ADDRESS}"
    ],
    "nativeCurrency": {
      "name": "Ropsten Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://github.com/ethereum/ropsten",
    "shortName": "rop",
    "chainId": 3,
    "networkId": 3,
    "ens": {
      "registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
    },
    "explorers": [
      {
        "name": "etherscan",
        "url": "https://ropsten.etherscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Rinkeby",
    "title": "Ethereum Testnet Rinkeby",
    "chain": "ETH",
    "rpc": [
      "https://rinkeby.infura.io/v3/${INFURA_API_KEY}",
      "wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}"
    ],
    "faucets": [
      "http://fauceth.komputing.org?chain=4&address=${ADDRESS}",
      "https://faucet.rinkeby.io"
    ],
    "nativeCurrency": {
      "name": "Rinkeby Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://www.rinkeby.io",
    "shortName": "rin",
    "chainId": 4,
    "networkId": 4,
    "ens": {
      "registry": "0xe7410170f87102df0055eb195163a03b7f2bff4a"
    },
    "explorers": [
      {
        "name": "etherscan-rinkeby",
        "url": "https://rinkeby.etherscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Goerli",
    "title": "Ethereum Testnet Goerli",
    "chain": "ETH",
    "rpc": [
      "https://goerli.infura.io/v3/${INFURA_API_KEY}",
      "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
      "https://rpc.goerli.mudit.blog/",
      "https://ethereum-goerli.publicnode.com"
    ],
    "faucets": [
      "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
      "https://goerli-faucet.slock.it?address=${ADDRESS}",
      "https://faucet.goerli.mudit.blog"
    ],
    "nativeCurrency": {
      "name": "Goerli Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://goerli.net/#about",
    "shortName": "gor",
    "chainId": 5,
    "networkId": 5,
    "ens": {
      "registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
    },
    "explorers": [
      {
        "name": "etherscan-goerli",
        "url": "https://goerli.etherscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "OP Mainnet",
    "chain": "ETH",
    "rpc": [
      "https://mainnet.optimism.io/"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://optimism.io",
    "shortName": "oeth",
    "chainId": 10,
    "networkId": 10,
    "explorers": [
      {
        "name": "etherscan",
        "url": "https://optimistic.etherscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Telos EVM Mainnet",
    "chain": "TLOS",
    "rpc": [
      "https://mainnet.telos.net/evm"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Telos",
      "symbol": "TLOS",
      "decimals": 18
    },
    "infoURL": "https://telos.net",
    "shortName": "TelosEVM",
    "chainId": 40,
    "networkId": 40,
    "explorers": [
      {
        "name": "teloscan",
        "url": "https://teloscan.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "LUKSO Mainnet",
    "chain": "LUKSO",
    "icon": "lukso",
    "rpc": [
      "https://rpc.mainnet.lukso.network",
      "wss://ws-rpc.mainnet.lukso.network"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "LUKSO",
      "symbol": "LYX",
      "decimals": 18
    },
    "explorers": [
      {
        "name": "Blockscout",
        "url": "https://explorer.execution.mainnet.lukso.network",
        "standard": "EIP3091"
      }
    ],
    "infoURL": "https://lukso.network",
    "shortName": "lukso",
    "chainId": 42,
    "networkId": 42,
    "features": [
      {
        "name": "EIP155"
      },
      {
        "name": "EIP1559"
      }
    ],
    "redFlags": [
      "reusedChainId"
    ]
  },
  {
    "name": "BNB Smart Chain Mainnet",
    "chain": "BSC",
    "rpc": [
      "https://bsc-dataseed1.bnbchain.org",
      "https://bsc-dataseed2.bnbchain.org",
      "https://bsc-dataseed3.bnbchain.org",
      "https://bsc-dataseed4.bnbchain.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "https://bsc.publicnode.com",
      "wss://bsc-ws-node.nariox.org"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "BNB",
      "decimals": 18
    },
    "infoURL": "https://www.bnbchain.org/en",
    "shortName": "bnb",
    "chainId": 56,
    "networkId": 56,
    "slip44": 714,
    "explorers": [
      {
        "name": "bscscan",
        "url": "https://bscscan.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "OKExChain Testnet",
    "chain": "okexchain",
    "rpc": [
      "https://exchaintestrpc.okex.org"
    ],
    "faucets": [
      "https://www.okex.com/drawdex"
    ],
    "nativeCurrency": {
      "name": "OKExChain Global Utility Token in testnet",
      "symbol": "OKT",
      "decimals": 18
    },
    "infoURL": "https://www.okex.com/okexchain",
    "shortName": "tokt",
    "chainId": 65,
    "networkId": 65,
    "explorers": [
      {
        "name": "OKLink",
        "url": "https://www.oklink.com/okexchain-test",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "OKXChain Mainnet",
    "chain": "okxchain",
    "rpc": [
      "https://exchainrpc.okex.org",
      "https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/?"
    ],
    "nativeCurrency": {
      "name": "OKXChain Global Utility Token",
      "symbol": "OKT",
      "decimals": 18
    },
    "infoURL": "https://www.okex.com/okc",
    "shortName": "okt",
    "chainId": 66,
    "networkId": 66,
    "explorers": [
      {
        "name": "OKLink",
        "url": "https://www.oklink.com/en/okc",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "BNB Smart Chain Testnet",
    "chain": "BSC",
    "rpc": [
      "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
      "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
      "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
      "https://data-seed-prebsc-1-s3.bnbchain.org:8545",
      "https://data-seed-prebsc-2-s3.bnbchain.org:8545",
      "https://bsc-testnet.publicnode.com"
    ],
    "faucets": [
      "https://testnet.bnbchain.org/faucet-smart"
    ],
    "nativeCurrency": {
      "name": "BNB Chain Native Token",
      "symbol": "tBNB",
      "decimals": 18
    },
    "infoURL": "https://www.bnbchain.org/en",
    "shortName": "bnbt",
    "chainId": 97,
    "networkId": 97,
    "explorers": [
      {
        "name": "bscscan-testnet",
        "url": "https://testnet.bscscan.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Gnosis",
    "chain": "GNO",
    "icon": "gnosis",
    "rpc": [
      "https://rpc.gnosischain.com",
      "https://rpc.gnosis.gateway.fm",
      "https://rpc.ankr.com/gnosis",
      "https://gnosischain-rpc.gateway.pokt.network",
      "https://gnosis-mainnet.public.blastapi.io",
      "https://gnosis.api.onfinality.io/public",
      "https://gnosis.blockpi.network/v1/rpc/public",
      "https://web3endpoints.com/gnosischain-mainnet",
      "wss://rpc.gnosischain.com/wss"
    ],
    "faucets": [
      "https://gnosisfaucet.com",
      "https://stakely.io/faucet/gnosis-chain-xdai",
      "https://faucet.prussia.dev/xdai"
    ],
    "nativeCurrency": {
      "name": "xDAI",
      "symbol": "XDAI",
      "decimals": 18
    },
    "infoURL": "https://docs.gnosischain.com",
    "shortName": "gno",
    "chainId": 100,
    "networkId": 100,
    "slip44": 700,
    "explorers": [
      {
        "name": "gnosisscan",
        "url": "https://gnosisscan.io",
        "standard": "EIP3091"
      },
      {
        "name": "blockscout",
        "url": "https://blockscout.com/xdai/mainnet",
        "icon": "blockscout",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "ThunderCore Mainnet",
    "chain": "TT",
    "rpc": [
      "https://mainnet-rpc.thundercore.com",
      "https://mainnet-rpc.thundertoken.net",
      "https://mainnet-rpc.thundercore.io"
    ],
    "faucets": [
      "https://faucet.thundercore.com"
    ],
    "nativeCurrency": {
      "name": "ThunderCore Token",
      "symbol": "TT",
      "decimals": 18
    },
    "infoURL": "https://thundercore.com",
    "shortName": "TT",
    "chainId": 108,
    "networkId": 108,
    "slip44": 1001,
    "explorers": [
      {
        "name": "thundercore-viewblock",
        "url": "https://viewblock.io/thundercore",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Fuse Mainnet",
    "chain": "FUSE",
    "rpc": [
      "https://rpc.fuse.io"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Fuse",
      "symbol": "FUSE",
      "decimals": 18
    },
    "infoURL": "https://fuse.io/",
    "shortName": "fuse",
    "chainId": 122,
    "networkId": 122
  },
  {
    "name": "Huobi ECO Chain Mainnet",
    "chain": "Heco",
    "rpc": [
      "https://http-mainnet.hecochain.com",
      "wss://ws-mainnet.hecochain.com"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "nativeCurrency": {
      "name": "Huobi ECO Chain Native Token",
      "symbol": "HT",
      "decimals": 18
    },
    "infoURL": "https://www.hecochain.com",
    "shortName": "heco",
    "chainId": 128,
    "networkId": 128,
    "slip44": 1010,
    "explorers": [
      {
        "name": "hecoinfo",
        "url": "https://hecoinfo.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Polygon Mainnet",
    "chain": "Polygon",
    "icon": "polygon",
    "rpc": [
      "https://polygon-rpc.com/",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
      "https://polygon-bor.publicnode.com"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "infoURL": "https://polygon.technology/",
    "shortName": "matic",
    "chainId": 137,
    "networkId": 137,
    "slip44": 966,
    "explorers": [
      {
        "name": "polygonscan",
        "url": "https://polygonscan.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "BitTorrent Chain Mainnet",
    "chain": "BTTC",
    "rpc": [
      "https://rpc.bittorrentchain.io/"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "BitTorrent",
      "symbol": "BTT",
      "decimals": 18
    },
    "infoURL": "https:/bt.io",
    "shortName": "BTT",
    "chainId": 199,
    "networkId": 199,
    "explorers": [
      {
        "name": "BitTorrent Chain Explorer",
        "url": "https://bttcscan.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Fantom Opera",
    "chain": "FTM",
    "rpc": [
      "https://rpc.ftm.tools",
      "https://fantom.publicnode.com"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    },
    "infoURL": "https://fantom.foundation",
    "shortName": "ftm",
    "chainId": 250,
    "networkId": 250,
    "icon": "fantom",
    "explorers": [
      {
        "name": "ftmscan",
        "url": "https://ftmscan.com",
        "icon": "ftmscan",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Huobi ECO Chain Testnet",
    "chain": "Heco",
    "rpc": [
      "https://http-testnet.hecochain.com",
      "wss://ws-testnet.hecochain.com"
    ],
    "faucets": [
      "https://scan-testnet.hecochain.com/faucet"
    ],
    "nativeCurrency": {
      "name": "Huobi ECO Chain Test Native Token",
      "symbol": "htt",
      "decimals": 18
    },
    "infoURL": "https://testnet.hecoinfo.com",
    "shortName": "hecot",
    "chainId": 256,
    "networkId": 256
  },
  {
    "name": "Boba Network",
    "chain": "ETH",
    "rpc": [
      "https://mainnet.boba.network",
      "https://replica.boba.network",
      "http://boba-ethereum.gateway.tenderly.co",
      "http://gateway.tenderly.co/public/boba-ethereum",
      "wss://boba-ethereum.gateway.tenderly.co/",
      "wss://gateway.tenderly.co/public/boba-ethereum"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://boba.network",
    "shortName": "Boba",
    "chainId": 288,
    "networkId": 288,
    "explorers": [
      {
        "name": "Bobascan",
        "url": "https://bobascan.com",
        "standard": "none"
      },
      {
        "name": "Blockscout",
        "url": "https://blockexplorer.boba.network",
        "standard": "none"
      }
    ],
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://gateway.boba.network"
        }
      ]
    }
  },
  {
    "name": "zkSync Era Mainnet",
    "chain": "ETH",
    "rpc": [
      "https://mainnet.era.zksync.io"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://zksync.io/",
    "shortName": "zksync",
    "chainId": 324,
    "networkId": 324,
    "icon": "zksync-era",
    "explorers": [
      {
        "name": "zkSync Era Block Explorer",
        "url": "https://explorer.zksync.io",
        "icon": "zksync-era",
        "standard": "EIP3091"
      }
    ],
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.zksync.io/"
        }
      ]
    }
  },
  {
    "name": "Metis Andromeda Mainnet",
    "chain": "ETH",
    "rpc": [
      "https://andromeda.metis.io/?owner=1088"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Metis",
      "symbol": "METIS",
      "decimals": 18
    },
    "infoURL": "https://www.metis.io",
    "shortName": "metis-andromeda",
    "chainId": 1088,
    "networkId": 1088,
    "explorers": [
      {
        "name": "blockscout",
        "url": "https://andromeda-explorer.metis.io",
        "standard": "EIP3091"
      }
    ],
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.metis.io"
        }
      ]
    }
  },
  {
    "name": "Polygon zkEVM",
    "title": "Polygon zkEVM",
    "chain": "Polygon",
    "rpc": [
      "https://zkevm-rpc.com"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://polygon.technology/polygon-zkevm",
    "shortName": "zkevm",
    "chainId": 1101,
    "networkId": 1101,
    "icon": "zkevm",
    "explorers": [
      {
        "name": "blockscout",
        "url": "https://zkevm.polygonscan.com",
        "icon": "zkevm",
        "standard": "EIP3091"
      }
    ],
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.zkevm-rpc.com"
        }
      ]
    }
  },
  {
    "name": "Core Blockchain Mainnet",
    "chain": "Core",
    "icon": "core",
    "rpc": [
      "https://rpc.coredao.org/",
      "https://rpc-core.icecreamswap.com"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Core Blockchain Native Token",
      "symbol": "CORE",
      "decimals": 18
    },
    "infoURL": "https://www.coredao.org",
    "shortName": "core",
    "chainId": 1116,
    "networkId": 1116,
    "explorers": [
      {
        "name": "Core Scan",
        "url": "https://scan.coredao.org",
        "icon": "core",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Moonbeam",
    "chain": "MOON",
    "rpc": [
      "https://rpc.api.moonbeam.network",
      "wss://wss.api.moonbeam.network"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Glimmer",
      "symbol": "GLMR",
      "decimals": 18
    },
    "infoURL": "https://moonbeam.network/networks/moonbeam/",
    "shortName": "mbeam",
    "chainId": 1284,
    "networkId": 1284,
    "explorers": [
      {
        "name": "moonscan",
        "url": "https://moonbeam.moonscan.io",
        "standard": "none"
      }
    ]
  },
  {
    "name": "Moonriver",
    "chain": "MOON",
    "rpc": [
      "https://rpc.api.moonriver.moonbeam.network",
      "wss://wss.api.moonriver.moonbeam.network"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Moonriver",
      "symbol": "MOVR",
      "decimals": 18
    },
    "infoURL": "https://moonbeam.network/networks/moonriver/",
    "shortName": "mriver",
    "chainId": 1285,
    "networkId": 1285,
    "explorers": [
      {
        "name": "moonscan",
        "url": "https://moonriver.moonscan.io",
        "standard": "none"
      }
    ]
  },
  {
    "name": "Kava EVM",
    "chain": "KAVA",
    "rpc": [
      "https://evm.kava.io",
      "https://evm2.kava.io",
      "wss://wevm.kava.io",
      "wss://wevm2.kava.io"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Kava",
      "symbol": "KAVA",
      "decimals": 18
    },
    "infoURL": "https://www.kava.io",
    "shortName": "kava",
    "chainId": 2222,
    "networkId": 2222,
    "icon": "kava",
    "explorers": [
      {
        "name": "Kava EVM Explorer",
        "url": "https://explorer.kava.io",
        "standard": "EIP3091",
        "icon": "kava"
      }
    ]
  },
  {
    "name": "Fantom Testnet",
    "chain": "FTM",
    "rpc": [
      "https://rpc.testnet.fantom.network",
      "https://fantom-testnet.publicnode.com"
    ],
    "faucets": [
      "https://faucet.fantom.network"
    ],
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    },
    "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
    "shortName": "tftm",
    "chainId": 4002,
    "networkId": 4002,
    "icon": "fantom",
    "explorers": [
      {
        "name": "ftmscan",
        "url": "https://testnet.ftmscan.com",
        "icon": "ftmscan",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Base",
    "chain": "ETH",
    "rpc": [
      "https://developer-access-mainnet.base.org/"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://base.org",
    "shortName": "base",
    "chainId": 8453,
    "networkId": 8453,
    "icon": "base",
    "explorers": [
      {
        "name": "basescan",
        "url": "https://basescan.org",
        "standard": "none"
      },
      {
        "name": "basescout",
        "url": "https://base.blockscout.com",
        "standard": "none"
      }
    ],
    "status": "active"
  },
  {
    "name": "Haqq Network",
    "chain": "Haqq",
    "rpc": [
      "https://rpc.eth.haqq.network"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Islamic Coin",
      "symbol": "ISLM",
      "decimals": 18
    },
    "infoURL": "https://islamiccoin.net",
    "shortName": "ISLM",
    "chainId": 11235,
    "networkId": 11235,
    "explorers": [
      {
        "name": "Mainnet HAQQ Explorer",
        "url": "https://explorer.haqq.network",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Arbitrum One",
    "chainId": 42161,
    "shortName": "arb1",
    "chain": "ETH",
    "networkId": 42161,
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "rpc": [
      "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
      "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
      "https://arb1.arbitrum.io/rpc"
    ],
    "faucets": [],
    "explorers": [
      {
        "name": "Arbiscan",
        "url": "https://arbiscan.io",
        "standard": "EIP3091"
      },
      {
        "name": "Arbitrum Explorer",
        "url": "https://explorer.arbitrum.io",
        "standard": "EIP3091"
      }
    ],
    "infoURL": "https://arbitrum.io",
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.arbitrum.io"
        }
      ]
    }
  },
  {
    "name": "Arbitrum Nova",
    "chainId": 42170,
    "shortName": "arb-nova",
    "chain": "ETH",
    "networkId": 42170,
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "rpc": [
      "https://nova.arbitrum.io/rpc"
    ],
    "faucets": [],
    "explorers": [
      {
        "name": "Arbitrum Nova Chain Explorer",
        "url": "https://nova-explorer.arbitrum.io",
        "icon": "blockscout",
        "standard": "EIP3091"
      }
    ],
    "infoURL": "https://arbitrum.io",
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.arbitrum.io"
        }
      ]
    }
  },
  {
    "name": "Celo Mainnet",
    "chainId": 42220,
    "shortName": "celo",
    "chain": "CELO",
    "networkId": 42220,
    "nativeCurrency": {
      "name": "CELO",
      "symbol": "CELO",
      "decimals": 18
    },
    "rpc": [
      "https://forno.celo.org",
      "wss://forno.celo.org/ws"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "infoURL": "https://docs.celo.org/",
    "explorers": [
      {
        "name": "Celoscan",
        "url": "https://celoscan.io",
        "standard": "EIP3091"
      },
      {
        "name": "blockscout",
        "url": "https://explorer.celo.org",
        "standard": "none"
      }
    ]
  },
  {
    "name": "Avalanche Fuji Testnet",
    "chain": "AVAX",
    "icon": "avax",
    "rpc": [
      "https://api.avax-test.network/ext/bc/C/rpc",
      "https://avalanche-fuji-c-chain.publicnode.com"
    ],
    "faucets": [
      "https://faucet.avax-test.network/"
    ],
    "nativeCurrency": {
      "name": "Avalanche",
      "symbol": "AVAX",
      "decimals": 18
    },
    "infoURL": "https://cchain.explorer.avax-test.network",
    "shortName": "Fuji",
    "chainId": 43113,
    "networkId": 1,
    "explorers": [
      {
        "name": "snowtrace",
        "url": "https://testnet.snowtrace.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Avalanche C-Chain",
    "chain": "AVAX",
    "icon": "avax",
    "rpc": [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain.publicnode.com"
    ],
    "features": [
      {
        "name": "EIP1559"
      }
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "nativeCurrency": {
      "name": "Avalanche",
      "symbol": "AVAX",
      "decimals": 18
    },
    "infoURL": "https://www.avax.network/",
    "shortName": "avax",
    "chainId": 43114,
    "networkId": 43114,
    "slip44": 9005,
    "explorers": [
      {
        "name": "snowtrace",
        "url": "https://snowtrace.io",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Boba Avax",
    "chain": "Boba Avax",
    "rpc": [
      "https://avax.boba.network",
      "wss://wss.avax.boba.network",
      "https://replica.avax.boba.network",
      "wss://replica-wss.avax.boba.network"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Boba Token",
      "symbol": "BOBA",
      "decimals": 18
    },
    "infoURL": "https://docs.boba.network/for-developers/network-avalanche",
    "shortName": "bobaavax",
    "chainId": 43288,
    "networkId": 43288,
    "explorers": [
      {
        "name": "Boba Avax Explorer",
        "url": "https://blockexplorer.avax.boba.network",
        "standard": "none"
      }
    ]
  },
  {
    "name": "Boba BNB Mainnet",
    "chain": "Boba BNB Mainnet",
    "rpc": [
      "https://bnb.boba.network",
      "http://boba-bnb.gateway.tenderly.co/",
      "http://gateway.tenderly.co/public/boba-bnb",
      "https://replica.bnb.boba.network",
      "wss://boba-bnb.gateway.tenderly.co/",
      "wss://gateway.tenderly.co/public/boba-bnb"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Boba Token",
      "symbol": "BOBA",
      "decimals": 18
    },
    "infoURL": "https://boba.network",
    "shortName": "BobaBnb",
    "chainId": 56288,
    "networkId": 56288,
    "explorers": [
      {
        "name": "Boba BNB block explorer",
        "url": "https://blockexplorer.bnb.boba.network",
        "standard": "none"
      }
    ],
    "parent": {
      "type": "L2",
      "chain": "eip155-5",
      "bridges": [
        {
          "url": "https://gateway.boba.network"
        }
      ]
    }
  },
  {
    "name": "Linea",
    "title": "Linea Mainnet",
    "chain": "ETH",
    "rpc": [
      "https://rpc.linea.build",
      "wss://rpc.linea.build",
      "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://linea-mainnet.infura.io/ws/v3/${INFURA_API_KEY}"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Linea Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "infoURL": "https://linea.build",
    "shortName": "linea",
    "chainId": 59144,
    "networkId": 59144,
    "icon": "linea",
    "parent": {
      "type": "L2",
      "chain": "eip155-1",
      "bridges": [
        {
          "url": "https://bridge.linea.build"
        }
      ]
    },
    "explorers": [
      {
        "name": "Etherscan",
        "url": "https://lineascan.build",
        "standard": "EIP3091",
        "icon": "linea"
      },
      {
        "name": "Blockscout",
        "url": "https://explorer.linea.build",
        "standard": "EIP3091",
        "icon": "linea"
      }
    ],
    "status": "active"
  },
  {
    "name": "Mumbai",
    "title": "Polygon Testnet Mumbai",
    "chain": "Polygon",
    "icon": "polygon",
    "rpc": [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
      "https://polygon-mumbai-bor.publicnode.com"
    ],
    "faucets": [
      "https://faucet.polygon.technology/"
    ],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "infoURL": "https://polygon.technology/",
    "shortName": "maticmum",
    "chainId": 80001,
    "networkId": 80001,
    "explorers": [
      {
        "name": "polygonscan",
        "url": "https://mumbai.polygonscan.com",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Harmony Mainnet Shard 0",
    "chain": "Harmony",
    "rpc": [
      "https://api.harmony.one",
      "https://api.s0.t.hmny.io"
    ],
    "faucets": [
      "https://free-online-app.com/faucet-for-eth-evm-chains/"
    ],
    "nativeCurrency": {
      "name": "ONE",
      "symbol": "ONE",
      "decimals": 18
    },
    "infoURL": "https://www.harmony.one/",
    "shortName": "hmy-s0",
    "chainId": 1666600000,
    "networkId": 1666600000,
    "explorers": [
      {
        "name": "Harmony Block Explorer",
        "url": "https://explorer.harmony.one",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Harmony Testnet Shard 0",
    "chain": "Harmony",
    "rpc": [
      "https://api.s0.b.hmny.io"
    ],
    "faucets": [
      "https://faucet.pops.one"
    ],
    "nativeCurrency": {
      "name": "ONE",
      "symbol": "ONE",
      "decimals": 18
    },
    "infoURL": "https://www.harmony.one/",
    "shortName": "hmy-b-s0",
    "chainId": 1666700000,
    "networkId": 1666700000,
    "explorers": [
      {
        "name": "Harmony Testnet Block Explorer",
        "url": "https://explorer.pops.one",
        "standard": "EIP3091"
      }
    ]
  },
  {
    "name": "Palm",
    "chain": "Palm",
    "icon": "palm",
    "rpc": [
      "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "PALM",
      "symbol": "PALM",
      "decimals": 18
    },
    "infoURL": "https://palm.io",
    "shortName": "palm",
    "chainId": 11297108109,
    "networkId": 11297108109,
    "explorers": [
      {
        "name": "Palm Explorer",
        "url": "https://explorer.palm.io",
        "standard": "EIP3091"
      }
    ]
  }
] as const