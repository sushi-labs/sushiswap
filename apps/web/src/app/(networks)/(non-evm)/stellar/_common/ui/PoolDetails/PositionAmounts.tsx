import type { UserPositionInfo } from '@sushiswap/stellar-contract-binding-position-manager'
import { useMemo } from 'react'
import { usePositionPrincipal } from '../../lib/hooks/position/use-position-principal'
import { formatTokenAmount } from '../../lib/utils/format'

interface PositionAmountsProps {
  position: UserPositionInfo
  token0Code: string
  token1Code: string
}

export const PositionAmounts: React.FC<PositionAmountsProps> = ({
  position,
  token0Code,
  token1Code,
}) => {
  const { data: principal, isLoading } = usePositionPrincipal(position.token_id)

  const amounts = useMemo(() => {
    if (isLoading || !principal) {
      return {
        token0: formatTokenAmount(position.tokens_owed0, 7), // Show fees only while loading
        token1: formatTokenAmount(position.tokens_owed1, 7),
        isPlaceholder: true,
      }
    }

    // Calculate total amounts (principal + fees)
    const totalAmount0 = principal.amount0 + position.tokens_owed0
    const totalAmount1 = principal.amount1 + position.tokens_owed1

    return {
      token0: formatTokenAmount(totalAmount0, 7),
      token1: formatTokenAmount(totalAmount1, 7),
      isPlaceholder: false,
    }
  }, [principal, position.tokens_owed0, position.tokens_owed1, isLoading])

  return (
    <div className="text-xs text-slate-500">
      {amounts.isPlaceholder ? (
        <>
          {token0Code}: {amounts.token0} (fees only)
          <br />
          {token1Code}: {amounts.token1} (fees only)
        </>
      ) : (
        <>
          {token0Code}: {amounts.token0} (principal + fees)
          <br />
          {token1Code}: {amounts.token1} (principal + fees)
        </>
      )}
    </div>
  )
}
