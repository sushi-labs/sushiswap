import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { AddressMap, JSBI, Token } from '@sushiswap/core-sdk'
import { FuroStream } from 'furo/typechain/FuroStream'
import { useMemo } from 'react'
import { useContract, useContractRead, useNetwork, useSigner } from 'wagmi'
import FUROSTREAM_ABI from '../abis/FuroStream.json'
import { Amount } from '@sushiswap/currency'

export const STREAM_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0x2a214DF929fba60509Dc2a236376ac53453cf443',
  [ChainId.GÖRLI]: '0xDDc2C7dd0578b06F708aAf7Fd10765F7e1b98156',
}

export function useFuroStreamContract(): FuroStream | null {
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
