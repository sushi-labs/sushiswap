import { ChainId } from '@sushiswap/chain'
import { useAngleRewards } from '@sushiswap/react-query'
import { Address } from '@sushiswap/wagmi'
import { useHarvestAngleRewards } from '@sushiswap/wagmi/future/hooks'
import { FC, ReactElement, useMemo } from 'react'

interface ConcentratedLiquidityHarvestButton {
  account: Address | undefined
  enabled?: boolean
  chainId: ChainId
  children(params: ReturnType<typeof useHarvestAngleRewards>): ReactElement
}

export const ConcentratedLiquidityHarvestButton: FC<ConcentratedLiquidityHarvestButton> = ({
  account,
  chainId,
  enabled,
  children,
}) => {
  const { data: rewards } = useAngleRewards({
    chainId,
    account,
  })

  const args = useMemo(() => {
    if (!rewards || !account) return undefined

    const tokens: Address[] = Object.keys(rewards.transactionData)
      .filter((k) => rewards.transactionData[k].proof !== undefined)
      .map((el) => el as Address)
    const claims: bigint[] = tokens.map((t) => BigInt(rewards.transactionData[t].claim))
    const proofs: Address[][] = tokens.map((t) => rewards.transactionData[t].proof as Address[])

    return {
      users: tokens.map(() => account),
      tokens,
      claims,
      proofs,
    }
  }, [account, rewards])

  const data = useHarvestAngleRewards({
    account,
    chainId,
    enabled,
    args,
  })

  return <>{children(data)}</>
}
