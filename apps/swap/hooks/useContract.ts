import { ChainId } from '@sushiswap/chain'
import UniswapInterfaceMulticallArtifact from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import CONSTANT_PRODUCT_POOL_FACTORY_ABI from 'abis/constant-product-pool-factory.json'
import { CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS, MULTICALL_ADDRESS } from 'config'
import { Contract, utils } from 'ethers'
import { getProvider } from 'lib/provider'
import { useMemo } from 'react'
import { UniswapInterfaceMulticall } from 'typechain'

const MULTICALL_INTERFACE = new utils.Interface(UniswapInterfaceMulticallArtifact.abi)
const CONSTANT_PRODUCT_POOL_FACTORY_INTERFACE = new utils.Interface(CONSTANT_PRODUCT_POOL_FACTORY_ABI)

export function useContract(chainId: ChainId) {
  return useMemo(() => {
    return new Contract(
      MULTICALL_ADDRESS[chainId],
      MULTICALL_INTERFACE,
      getProvider(chainId)
    ) as UniswapInterfaceMulticall
  }, [chainId]) as UniswapInterfaceMulticall
}

export function useConstantProductPoolFactoryContract(chainId: ChainId) {
  return useMemo(() => {
    if (!(chainId in CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS)) return
    return new Contract(
      CONSTANT_PRODUCT_POOL_FACTORY_ADDRESS[chainId],
      CONSTANT_PRODUCT_POOL_FACTORY_INTERFACE,
      getProvider(chainId)
    )
  }, [chainId])
}
