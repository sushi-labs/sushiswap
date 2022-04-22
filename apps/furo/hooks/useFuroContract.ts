import { Result } from '@ethersproject/abi'
import { BigNumber } from 'ethers'
import FuroExport from 'furo/exports/kovan.json'
import { FuroStream } from 'furo/typechain/FuroStream'
import { useCallback } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useContract, useContractRead, useSigner } from 'wagmi'

export function useFuroContract(): FuroStream | null {
  // const [{ data: network }] = useNetwork()
  // const [{ data: signer }] = useSigner()
  // const chainId = network?.chain?.id
  // TODO: fix chainId, signer?
  const [{ data: signer }] = useSigner()
  return useContract<FuroStream>({
    addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
    contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi,
    signerOrProvider: signer,
  })
}

export function useStreamBalance(streamId: string): BigNumber {
  const [balance, setBalance] = useState<BigNumber>()
  const [{ data, error, loading }] = useContractRead<FuroStream>(
    {
      addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
      contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi,
    },
    'streamBalanceOf',
    { args: [streamId], watch: true },
  )
  useMemo(() => {
    if (!error && !loading && data !== undefined && streamId) {
      setBalance(BigNumber.from(data.recipientBalance))
    }
  }, [error, loading, data, streamId])

  return balance
}
