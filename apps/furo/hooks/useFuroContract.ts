import { BigNumber } from 'ethers'
import FuroExport from 'furo/exports/kovan.json'
import { FuroStream } from 'furo/typechain/FuroStream'
import { FuroVesting } from 'furo/typechain/FuroVesting'
import { useMemo } from 'react'
import { useState } from 'react'
import { useContract, useContractRead, useSigner } from 'wagmi'

export function useFuroStreamContract(): FuroStream | null {
  const { data: signer } = useSigner()
  return useContract<FuroStream>({
    addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
    contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi,
    signerOrProvider: signer,
  })
}

export function useFuroVestingContract(): FuroVesting | null {
  const { data: signer } = useSigner()
  return useContract<FuroVesting>({
    addressOrName: FuroExport[42].kovan.contracts.FuroVesting.address,
    contractInterface: FuroExport[42].kovan.contracts.FuroVesting.abi,
    signerOrProvider: signer,
  })
}

export function useStreamBalance(streamId: string): BigNumber {
  const [balance, setBalance] = useState<BigNumber>()
  const { data, error, isLoading } = useContractRead(
    {
      addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
      contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true },
  )
  console.log({ data, error, isLoading })
  useMemo(() => {
    if (!error && !isLoading && data !== undefined && streamId) {
      setBalance(BigNumber.from(data.recipientBalance))
    }
  }, [error, isLoading, data, streamId])

  return balance
}
