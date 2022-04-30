import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { AddressMap } from '@sushiswap/core-sdk'
import { BigNumber } from 'ethers'
import { FuroStream } from 'furo/typechain/FuroStream'
import { useMemo, useState } from 'react'
import { useContract, useContractRead, useNetwork, useSigner } from 'wagmi'
import FUROSTREAM_ABI from '../abis/FuroStream.json'

export const STREAM_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0x2a214DF929fba60509Dc2a236376ac53453cf443',
  [ChainId.GÖRLI]: '0xDDc2C7dd0578b06F708aAf7Fd10765F7e1b98156',
}

export function useFuroStreamContract(): FuroStream | null {
  const { data: signer } = useSigner()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  console.log({ chainId })
  return useContract({
    addressOrName: STREAM_ADDRESS[chainId] ?? AddressZero,
    contractInterface: FUROSTREAM_ABI,
    signerOrProvider: signer,
  })
}

export function useStreamBalance(streamId: string): BigNumber {
  const [balance, setBalance] = useState<BigNumber>()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  const { data, error, isLoading } = useContractRead(
    {
      addressOrName: STREAM_ADDRESS[chainId] ?? AddressZero,
      contractInterface: FUROSTREAM_ABI,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true },
  )
  useMemo(() => {
    if (!error && !isLoading && data.recipientBalance !== undefined && streamId) {
      setBalance(BigNumber.from(data.recipientBalance))
    }
  }, [error, isLoading, data, streamId])

  return balance
}
