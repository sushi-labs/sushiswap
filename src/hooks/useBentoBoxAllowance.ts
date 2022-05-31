import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import { Fraction } from 'app/entities/bignumber'
import { useBentoBoxContract, useContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useState } from 'react'

const useAllowance = (tokenAddress: string) => {
  const { account } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract(true) // withSigner
  const tokenAddressChecksum = getAddress(tokenAddress)
  const tokenContract = useContract(tokenAddressChecksum ? tokenAddressChecksum : undefined, ERC20_ABI, true) // withSigner

  const [allowance, setAllowance] = useState('0')
  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await tokenContract?.allowance(account, bentoBoxContract?.address)
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
        setAllowance(formatted)
      } catch (error) {
        setAllowance('0')
        throw error
      }
    }
  }, [account, bentoBoxContract?.address, tokenContract])
  useEffect(() => {
    if (account && bentoBoxContract && tokenContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, bentoBoxContract, fetchAllowance, tokenContract])

  return allowance
}

export default useAllowance
