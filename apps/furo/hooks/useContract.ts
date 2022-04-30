import { AddressZero } from '@ethersproject/constants'
import { isAddress } from '@ethersproject/address'
import { BaseProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { ERC20_BYTES32_ABI } from '../abis/erc20'
import { erc20ABI, useAccount, useNetwork, useProvider } from 'wagmi'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  const provider = useProvider()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account.address : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, erc20ABI, withSignerIfPossible)
}

// account is optional
export function getContract(address: string, ABI: any, provider: BaseProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, provider)
}
