import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { EvmChainId } from 'sushi/evm'

export const STEER_PERIPHERY_ADDRESS: Record<SmartPoolChainId, `0x${string}`> =
  {
    [EvmChainId.ETHEREUM]: '0xcebf1a54a9ce703fc80967760b5a6cbdb4111099',
    [EvmChainId.BASE]: '0x16ba7102271dc83fff2f709691c2b601dad7668e',
    // [EvmChainId.POLYGON]: '0x29e1888f7dd0757f2873e494463ec389dab38d27',
    // [EvmChainId.BSC]: '0xe240b9a2936f6fb8860219bc059349e50f03492e',
    // [EvmChainId.OPTIMISM]: '0x7c464a0ab1f5ebf3e2dcccfec7ef41d02ed7a2f4',
    // [EvmChainId.ARBITRUM]: '0x806c2240793b3738000fcb62c66bf462764b903f',
    // [EvmChainId.THUNDERCORE]: '0xab36d30c1a1c683037bd7aac67f29b2e3ecc6576',
    // [EvmChainId.METIS]: '0x806c2240793b3738000fcb62c66bf462764b903f',
    // [EvmChainId.AVALANCHE]: '0x5d8249e3f5f702e1fd720167b40424fc2dadcd1e',
    // [EvmChainId.POLYGON_ZKEVM]: '0xca19bec25a41443f35eeae03411dce87d8c0edc4',
    // [EvmChainId.CELO]: '0xdca3251ebe8f85458e8d95813bcb816460e4bef1',
    // [EvmChainId.KAVA]: '0xf90107890b640387ec3b0474f0c61674aebcb510',
    // [EvmChainId.LINEA]: '0x0c5c5beb833fd382b04e039f151942dc3d9a60ce',
    // [EvmChainId.SCROLL]: '0xd90c8970708ffdfc403bdb56636621e3e9cce921',
    // [EvmChainId.FANTOM]: '0xcb77e4c30d92c8b959811e99213625c7b9490b96',
    // [EvmChainId.BLAST]: '0xdca3251ebe8f85458e8d95813bcb816460e4bef1',
    // [EvmChainId.ROOTSTOCK]: '0x37cff062d52dd6e9e39df619ccd30c037a36bb83',
    // [EvmChainId.FILECOIN]: '0xab36d30c1a1c683037bd7aac67f29b2e3ecc6576',
  }
