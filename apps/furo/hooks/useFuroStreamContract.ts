import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import BENTOBOX_ABI from 'abis/bentobox.json'
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
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      addressOrName: activeChain?.id ? STREAM_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true }
  )

  const {
    data: rebase,
    error: rebaseError,
    isLoading: rebaseLoading,
  } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'totals',
    { args: [token?.address], watch: true }
  )

  return useMemo(() => {
    if (balanceError || rebaseError || balanceLoading || rebaseLoading || !balance || !rebase || !streamId || !token)
      return undefined

    return Amount.fromShare(token, JSBI.BigInt(balance[1]), {
      base: JSBI.BigInt(rebase[0]),
      elastic: JSBI.BigInt(rebase[1]),
    })
  }, [balanceError, rebaseError, balanceLoading, rebaseLoading, balance, streamId, token, rebase])
}
