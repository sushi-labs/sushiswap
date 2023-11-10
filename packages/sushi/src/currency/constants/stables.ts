import { ChainId } from '../../chain/index.js'
import { Token } from '../Token.js'
import { BUSD, DAI, LUSD, USDC, USDT } from './tokens.js'

const THUNDERCORE_ANY_USDT = new Token({
  chainId: ChainId.THUNDERCORE,
  address: '0x0dcb0cb0120d355cde1ce56040be57add0185baa',
  decimals: 6,
  symbol: 'anyUSDT',
  name: 'Any Tether USD',
})

const THUNDERCORE_ANY_USDC = new Token({
  chainId: ChainId.THUNDERCORE,
  address: '0xdc42728b0ea910349ed3c6e1c9dc06b5fb591f98',
  decimals: 18,
  symbol: 'anyUSDC',
  name: 'Any USD Coin',
})

const THUNDERCORE_ANY_BUSD = new Token({
  chainId: ChainId.THUNDERCORE,
  address: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
  decimals: 18,
  symbol: 'anyBUSD',
  name: 'Any BUSD Token',
})

const BTTC_BSC_BRIDGE_USDC = new Token({
  chainId: ChainId.BTTC,
  address: '0xca424b845497f7204d9301bd13ff87c0e2e86fcf',
  decimals: 18,
  symbol: 'USDC (BSC)',
  name: 'USD Coin (BSC)',
})
const BTTC_ETHEREUM_BRIDGE_USDC = new Token({
  chainId: ChainId.BTTC,
  address: '0xae17940943ba9440540940db0f1877f101d39e8b',
  decimals: 6,
  symbol: 'USDC (Ethereum)',
  name: 'USD Coin (Ethereum)',
})
const BTTC_TRON_BRIDGE_USDC = new Token({
  chainId: ChainId.BTTC,
  address: '0x935faa2fcec6ab81265b301a30467bbc804b43d3',
  decimals: 6,
  symbol: 'USDC (Tron)',
  name: 'USD Coin (Tron)',
})
const BTTC_BSC_BRIDGE_USDT = new Token({
  chainId: ChainId.BTTC,
  address: '0x9b5f27f6ea9bbd753ce3793a07cba3c74644330d',
  decimals: 18,
  symbol: 'USDT (BSC)',
  name: 'Tether USD (BSC)',
})
const BTTC_ETHEREUM_BRIDGE_USDT = new Token({
  chainId: ChainId.BTTC,
  address: '0xe887512ab8bc60bcc9224e1c3b5be68e26048b8b',
  decimals: 6,
  symbol: 'USDT (Ethereum)',
  name: 'Tether USD (Ethereum)',
})
const BTTC_TRON_BRIDGE_USDT = new Token({
  chainId: ChainId.BTTC,
  address: '0xdb28719f7f938507dbfe4f0eae55668903d34a15',
  decimals: 6,
  symbol: 'USDT (Tron)',
  name: 'Tether USD (Tron)',
})

export const STABLES = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    DAI[ChainId.ETHEREUM],
    LUSD[ChainId.ETHEREUM],
  ],
  [ChainId.RINKEBY]: [USDC[ChainId.RINKEBY]],
  [ChainId.ROPSTEN]: [
    USDC[ChainId.ROPSTEN],
    USDT[ChainId.ROPSTEN],
    DAI[ChainId.ROPSTEN],
  ],
  [ChainId.KOVAN]: [
    USDC[ChainId.KOVAN],
    USDT[ChainId.KOVAN],
    DAI[ChainId.KOVAN],
  ],
  [ChainId.POLYGON]: [
    USDC[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    DAI[ChainId.POLYGON],
  ],
  [ChainId.POLYGON_TESTNET]: [USDC[ChainId.POLYGON_TESTNET]],
  [ChainId.FANTOM]: [
    USDC[ChainId.FANTOM],
    USDT[ChainId.FANTOM],
    DAI[ChainId.FANTOM],
  ],
  [ChainId.BSC]: [
    USDC[ChainId.BSC],
    USDT[ChainId.BSC],
    DAI[ChainId.BSC],
    BUSD[ChainId.BSC],
  ],
  [ChainId.HARMONY]: [
    USDC[ChainId.HARMONY],
    USDT[ChainId.HARMONY],
    DAI[ChainId.HARMONY],
  ],
  [ChainId.HECO]: [USDC[ChainId.HECO], USDT[ChainId.HECO], DAI[ChainId.HECO]],
  [ChainId.OKEX]: [USDC[ChainId.OKEX], USDT[ChainId.OKEX], DAI[ChainId.OKEX]],
  [ChainId.GNOSIS]: [
    USDC[ChainId.GNOSIS],
    USDT[ChainId.GNOSIS],
    DAI[ChainId.GNOSIS],
  ],
  [ChainId.ARBITRUM]: [
    USDC[ChainId.ARBITRUM],
    USDT[ChainId.ARBITRUM],
    DAI[ChainId.ARBITRUM],
  ],
  [ChainId.AVALANCHE]: [
    USDC[ChainId.AVALANCHE],
    USDT[ChainId.AVALANCHE],
    DAI[ChainId.AVALANCHE],
  ],
  [ChainId.MOONRIVER]: [
    USDC[ChainId.MOONRIVER],
    USDT[ChainId.MOONRIVER],
    DAI[ChainId.MOONRIVER],
  ],
  [ChainId.CELO]: [USDC[ChainId.CELO], USDT[ChainId.CELO], DAI[ChainId.CELO]],
  [ChainId.TELOS]: [USDC[ChainId.TELOS], USDT[ChainId.TELOS]],
  [ChainId.FUSE]: [USDC[ChainId.FUSE], USDT[ChainId.FUSE], DAI[ChainId.FUSE]],
  [ChainId.MOONBEAM]: [
    USDC[ChainId.MOONBEAM],
    USDT[ChainId.MOONBEAM],
    DAI[ChainId.MOONBEAM],
  ],
  [ChainId.OPTIMISM]: [
    USDC[ChainId.OPTIMISM],
    USDT[ChainId.OPTIMISM],
    DAI[ChainId.OPTIMISM],
  ],
  [ChainId.KAVA]: [USDC[ChainId.KAVA], USDT[ChainId.KAVA], DAI[ChainId.KAVA]],
  [ChainId.METIS]: [
    USDC[ChainId.METIS],
    USDT[ChainId.METIS],
    DAI[ChainId.METIS],
  ],
  [ChainId.ARBITRUM_NOVA]: [
    USDC[ChainId.ARBITRUM_NOVA],
    USDT[ChainId.ARBITRUM_NOVA],
    DAI[ChainId.ARBITRUM_NOVA],
  ],
  [ChainId.BOBA]: [USDC[ChainId.BOBA], USDT[ChainId.BOBA], DAI[ChainId.BOBA]],
  [ChainId.BOBA_AVAX]: [USDC[ChainId.BOBA_AVAX], USDT[ChainId.BOBA_AVAX]],
  [ChainId.BOBA_BNB]: [USDC[ChainId.BOBA_BNB], USDT[ChainId.BOBA_BNB]],
  [ChainId.BTTC]: [
    USDC[ChainId.BTTC],
    USDT[ChainId.BTTC],
    BTTC_BSC_BRIDGE_USDC,
    BTTC_ETHEREUM_BRIDGE_USDC,
    BTTC_TRON_BRIDGE_USDC,
    BTTC_BSC_BRIDGE_USDT,
    BTTC_ETHEREUM_BRIDGE_USDT,
    BTTC_TRON_BRIDGE_USDT,
  ],
  [ChainId.POLYGON_ZKEVM]: [
    USDC[ChainId.POLYGON_ZKEVM],
    USDT[ChainId.POLYGON_ZKEVM],
    DAI[ChainId.POLYGON_ZKEVM],
  ],
  [ChainId.THUNDERCORE]: [
    USDC[ChainId.THUNDERCORE],
    USDT[ChainId.THUNDERCORE],
    BUSD[ChainId.THUNDERCORE],
    THUNDERCORE_ANY_BUSD,
    THUNDERCORE_ANY_USDT,
    THUNDERCORE_ANY_USDC,
  ],
  [ChainId.SCROLL]: [
    USDC[ChainId.SCROLL],
    USDT[ChainId.SCROLL],
    DAI[ChainId.SCROLL],
  ],
  [ChainId.FILECOIN]: [USDC[ChainId.FILECOIN], DAI[ChainId.FILECOIN]],
  [ChainId.LINEA]: [USDC[ChainId.LINEA], DAI[ChainId.LINEA]],
} as const
