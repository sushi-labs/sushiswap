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
  const { data, error, isLoading, isError } = useContractRead(
    {
      addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
      contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true },
  )
  useMemo(() => {
    if (!isError && !isLoading && data) {
      const [, recipientBalance] = data
      setBalance(BigNumber.from(recipientBalance))
    }
  }, [isError, isLoading, data])

  return balance
}
