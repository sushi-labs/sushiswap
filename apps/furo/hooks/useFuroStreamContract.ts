import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useContract, useContractRead, useNetwork, useSigner } from 'wagmi'

import FUROSTREAM_ABI from '../abis/FuroStream.json'

export const STREAM_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0xa60f90530e9412fe1a19ff91f1491f1738953b7c',
  [ChainId.GÖRLI]: '0x3c4bc596c4946d812d0ea77940038576f228fac7',
}

export function useFuroStreamContract(): Contract | null {
  const { data: signer } = useSigner()
  const { activeChain } = useNetwork()
  return useContract({
    addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
    contractInterface: FUROSTREAM_ABI,
    signerOrProvider: signer,
  })
}

export function useStreamBalance(streamId?: string, token?: Token): Amount<Token> | undefined {
  const { activeChain } = useNetwork()
  const { data, error, isLoading } = useContractRead(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true }
  )

  return useMemo(() => {
    if (error || isLoading || !data || !streamId || !token) return undefined
    return Amount.fromRawAmount(token, JSBI.BigInt(data[1]))
  }, [data, error, isLoading, streamId, token])
}
