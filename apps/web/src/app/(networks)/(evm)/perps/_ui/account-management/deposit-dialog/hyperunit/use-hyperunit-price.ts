import { useMemo } from 'react'
import { EvmChainId, EvmToken, WBTC, WETH9 } from 'sushi/evm'
import { SvmChainId, WSOL } from 'sushi/svm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

const ChainToToken = {
  bitcoin: WBTC[EvmChainId.ETHEREUM],
  ethereum: WETH9[EvmChainId.ETHEREUM],
  avalanche: new EvmToken({
    chainId: EvmChainId.AVALANCHE,
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    decimals: 18,
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
  }),
  solana: WSOL[SvmChainId.SOLANA],
  monad: new EvmToken({
    chainId: EvmChainId.MONAD,
    address: '0x3bd359c1119da7da1d913d1c4d2b7c461115433a',
    decimals: 18,
    symbol: 'WMONAD',
    name: 'Wrapped MONAD',
  }),
  base: WETH9[EvmChainId.ETHEREUM],
  plasma: new EvmToken({
    chainId: EvmChainId.PLASMA,
    address: '0x6100e367285b01f48d07953803a2d8dca5d19873',
    decimals: 18,
    symbol: 'WPLASMA',
    name: 'Wrapped PLASMA',
  }),
  zcash: new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address: '0x4A64515E5E1d1073e83f30cB97BEd20400b66E10',
    decimals: 18,
    symbol: 'ZEC',
    name: 'Zcash',
  }),
} as const

export function useHyperunitPrice(chainName: keyof typeof ChainToToken) {
  const token = useMemo(() => {
    return ChainToToken[chainName]
  }, [chainName])

  return usePrice(token)
}
