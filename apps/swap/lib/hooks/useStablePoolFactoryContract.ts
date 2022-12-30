import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import STABLE_POOL_FACTORY_ABI from 'abis/stable-pool-factory.json'
import { STABLE_POOL_FACTORY_ADDRESS } from 'config'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

const STABLE_POOL_FACTORY_ABI_INTERFACE = new Interface(STABLE_POOL_FACTORY_ABI)

export function useStableProductPoolFactoryContract(chainId: number | undefined) {
  const provider = useProvider({ chainId })
  return useMemo(() => {
    if (!chainId || !(chainId in STABLE_POOL_FACTORY_ADDRESS)) return
    return new Contract(STABLE_POOL_FACTORY_ADDRESS[chainId], STABLE_POOL_FACTORY_ABI_INTERFACE, provider)
  }, [chainId, provider])
}
