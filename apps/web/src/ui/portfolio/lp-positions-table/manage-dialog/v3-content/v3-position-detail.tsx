import { useMemo } from 'react'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { Amount } from 'sushi'
import { unwrapEvmToken } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { PriceRangeSparklineCLMM } from '../../price-range-sparkline-clmm'
import { Positions } from '../positions'
import { CurrentPrice } from './current-price'
import { Fees } from './fees'
import { MinMaxPrices } from './min-max-prices'
import { Rewards } from './rewards'

export const V3PositionDetail = ({ position }: { position: any }) => {
  const { address: account } = useAccount()
  const chainId = 1
  const tokenId = '1948'

  const { data: positionDetails, isLoading: _isPositionDetailsLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: chainId,
      tokenId: tokenId,
    })

  const { data: token0, isLoading: _token0Loading } = useTokenWithCache({
    chainId: chainId,
    address: positionDetails?.token0,
  })
  const { data: token1, isLoading: _token1Loading } = useTokenWithCache({
    chainId: chainId,
    address: positionDetails?.token1,
  })

  const [_token0, _token1] = useMemo(
    () => [
      token0 ? unwrapEvmToken(token0) : undefined,
      token1 ? unwrapEvmToken(token1) : undefined,
    ],
    [token0, token1],
  )

  const amounts = useMemo(() => {
    if (positionDetails?.fees && _token0 && _token1)
      return [
        new Amount(_token0, BigInt(positionDetails.fees[0])),
        new Amount(_token1, BigInt(positionDetails.fees[1])),
      ]

    return [undefined, undefined]
  }, [_token0, _token1, positionDetails])

  return (
    <div className="flex flex-col gap-3">
      {/* @dev the toggle in CurrentPrice should change the content in the sparkline and MinMaxPrices as well */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground dark:text-pink-200">
          Price Range
        </p>
        <PriceRangeSparklineCLMM strokeWidth={1.5} />
      </div>
      <CurrentPrice token0={position.token0} token1={position.token1} />
      <MinMaxPrices />
      <Positions position={position} />
      <Fees
        position={position}
        chainId={chainId}
        token0={token0}
        token1={token1}
        amounts={amounts}
        positionDetails={positionDetails}
        account={account}
      />
      <Rewards position={position} />
    </div>
  )
}
