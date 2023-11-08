import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { usePool } from 'utils/usePool'
import { Pool } from 'utils/usePools'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { CardGroup, CardLabel } from '@sushiswap/ui'
import { CardCurrencyAmountItem } from '../../CardCurrencyAmountItem'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
}

const CONTRACT_ADDRESS =
  process.env['SWAP_CONTRACT'] || process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const PoolPositionDesktop: FC<PoolPositionProps> = ({
  row,
  isLoading,
}) => {
  const router = useParams()
  const { token0, token1 } = useTokensFromPools(row)
  const { account } = useWallet()
  const tokenAddress = decodeURIComponent(router?.id)
  const { data: pool } = usePool(tokenAddress)
  const { data: LPBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    enabled: true,
    refetchInterval: 2000,
  })

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.data?.balance_x?.value, pool?.data?.balance_y?.value]
  }, [pool])

  const { data: LPSupply } = useTotalSupply(tokenAddress)
  const totalSupply = LPSupply?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: LPSupply?.data?.decimals,
  })

  return (
    <CardGroup>
      <CardLabel>Unstaked</CardLabel>
      <CardCurrencyAmountItem
        currency={token0}
        isLoading={isLoading}
        amount={underlying0}
        fiatValue={'$0.00'}
      />
      <CardCurrencyAmountItem
        currency={token1}
        isLoading={isLoading}
        amount={underlying1}
        fiatValue={'$0.00'}
      />
    </CardGroup>
  )
}
