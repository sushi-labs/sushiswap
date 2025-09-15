import { Button, SkeletonBox } from '@sushiswap/ui'
import { useState } from 'react'
import { formatUSD } from 'sushi'
import { usePoolState } from '../../../../pool/pool-provider'

export const Rate = ({
  token0Price,
  token1Price,
  isLoading,
}: {
  token0Price: string | undefined
  token1Price: string | undefined
  isLoading: boolean
}) => {
  const [showToken0First, setShowToken0First] = useState<boolean>(false)
  const { token0, token1, rateOfToken0ToToken1, rateOfToken1ToToken0 } =
    usePoolState()

  const handleToggleRate = () => {
    setShowToken0First(!showToken0First)
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="xsm"
        variant="link"
        className="hover:!no-underline"
        onClick={handleToggleRate}
      >
        1 {showToken0First ? token0?.symbol : token1?.symbol} ={' '}
        {showToken0First ? rateOfToken0ToToken1 : rateOfToken1ToToken0}
        {showToken0First ? token1?.symbol : token0?.symbol}
      </Button>
      {isLoading ? (
        <SkeletonBox className="h-3 w-[35px] rounded-sm" />
      ) : (
        <div className="text-[12px] opacity-40">
          {showToken0First
            ? formatUSD(token0Price ?? '')
            : formatUSD(token1Price ?? '')}
        </div>
      )}
    </div>
  )
}
