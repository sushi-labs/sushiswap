import { Interface } from '@ethersproject/abi'
import { ChainId } from '@sushiswap/chain'
import BENTOBOX_ABI from 'abis/bentobox.json'
import { BENTOBOX_ADDRESS } from 'config'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

const BENTOBOX_INTERFACE = new Interface(BENTOBOX_ABI)

export function useBentoBoxContract(chainId: ChainId) {
  const provider = useProvider({ chainId })
  return useMemo(() => {
    if (!(chainId in BENTOBOX_ADDRESS)) return
    return new Contract(BENTOBOX_ADDRESS[chainId], BENTOBOX_INTERFACE, provider)
  }, [chainId, provider])
}
