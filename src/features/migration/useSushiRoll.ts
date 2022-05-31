import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useSushiRollContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { signERC2612Permit } from 'eth-permit'
import { useCallback } from 'react'

import LPToken from './LPToken'

const useSushiRoll = (dex: LPToken['dex']) => {
  const { chainId, library, account } = useActiveWeb3React()
  const sushiRoll = useSushiRollContract(dex)
  const ttl = 60 * 20

  let from = dex

  const migrate = useCallback(
    async (lpToken: LPToken, amount: BigNumber) => {
      if (sushiRoll) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const args = [lpToken.tokenA.address, lpToken.tokenB.address, amount, Zero, Zero, deadline]

        const gasLimit = await sushiRoll.estimateGas.migrate(...args)
        const tx = sushiRoll.migrate(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })

        gtag('event', `${from}->Sushiswap`, {
          event_category: 'Migrate',
          event_label: 'migrate',
          event_action: `${from}->Sushiswap`,
        })

        return tx
      }
    },
    [sushiRoll, ttl, from]
  )

  const migrateWithPermit = useCallback(
    async (lpToken: LPToken, amount: BigNumber) => {
      if (account && sushiRoll) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const permit = await signERC2612Permit(
          library,
          lpToken.address,
          account,
          sushiRoll.address,
          amount.toString(),
          deadline
        )
        const args = [
          lpToken.tokenA.address,
          lpToken.tokenB.address,
          amount,
          Zero,
          Zero,
          deadline,
          permit.v,
          permit.r,
          permit.s,
        ]

        const gasLimit = await sushiRoll.estimateGas.migrateWithPermit(...args)
        const tx = await sushiRoll.migrateWithPermit(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })

        gtag('event', `${from}->Sushiswap`, {
          event_category: 'Migrate',
          event_label: 'migrateWithPermit',
          event_action: `${from}->Sushiswap`,
        })

        return tx
      }
    },
    [account, library, sushiRoll, ttl, from]
  )

  return {
    migrate,
    migrateWithPermit,
  }
}

export default useSushiRoll
