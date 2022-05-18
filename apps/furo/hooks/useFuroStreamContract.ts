import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useContract, useContractRead, useNetwork, useSigner } from 'wagmi'

import FUROSTREAM_ABI from '../abis/FuroStream.json'

export const STREAM_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0xd178a02b5a31bc44c3e2cbf4bb252c7d03faf3fe',
  [ChainId.GÖRLI]: '0x8149ed0807afcb375009e6c8bd86da249fb56a08',
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
    { args: [streamId], watch: true },
  )

  return useMemo(() => {
    if (error || isLoading || !data || !streamId || !token) return undefined
    return Amount.fromRawAmount(token, JSBI.BigInt(data[1]))
  }, [data, error, isLoading, streamId, token])
}
