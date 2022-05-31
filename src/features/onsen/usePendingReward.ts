import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/core-sdk'
import { Fraction } from 'app/entities/bignumber'
import { useCloneRewarderContract, useComplexRewarderContract } from 'app/hooks/useContract'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3/hooks/useActiveWeb3React'
import { useEffect, useMemo, useState } from 'react'

import { Chef } from './enum'

// @ts-ignore TYPE NEEDS FIXING
const usePending = (farm) => {
  const [balance, setBalance] = useState<string>('0')

  const { chainId, account, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()

  const cloneRewarder = useCloneRewarderContract(farm?.rewarder?.id)

  const complexRewarder = useComplexRewarderContract(farm?.rewarder?.id)

  const contract = useMemo(
    () => ({
      [ChainId.ETHEREUM]: cloneRewarder,
      [ChainId.MATIC]: complexRewarder,
      [ChainId.XDAI]: complexRewarder,
      [ChainId.HARMONY]: complexRewarder,
      [ChainId.ARBITRUM]: cloneRewarder,
      [ChainId.CELO]: complexRewarder,
      [ChainId.MOONRIVER]: complexRewarder,
      [ChainId.FUSE]: complexRewarder,
      [ChainId.FANTOM]: complexRewarder,
      [ChainId.MOONBEAM]: complexRewarder,
    }),
    [complexRewarder, cloneRewarder]
  )

  useEffect(() => {
    async function fetchPendingReward() {
      try {
        // @ts-ignore TYPE NEEDS FIXING
        const pending = await contract[chainId]?.pendingTokens(farm.id, account, '0')
        // console.log({ farm })
        // todo: do not assume [0] or that rewardToken has 18 decimals (only works w/ mastechefv2 currently)
        const formatted = farm.rewardToken
          ? Fraction.from(
              BigNumber.from(pending?.rewardAmounts[0]),
              BigNumber.from(10).pow(farm.rewardToken.decimals || 18)
            ).toString(farm.rewardToken.decimals || 18)
          : Fraction.from(BigNumber.from(pending?.rewardAmounts[0]), BigNumber.from(10).pow(18)).toString(18)
        setBalance(formatted)
      } catch (error) {
        console.error(error)
      }
    }
    // id = 0 is evaluated as false
    if (
      account &&
      cloneRewarder &&
      farm &&
      library &&
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF || farm.chef === Chef.OLD_FARMS)
    ) {
      fetchPendingReward()
    }
  }, [account, currentBlockNumber, cloneRewarder, complexRewarder, farm, library, contract, chainId])

  return balance
}

export default usePending
