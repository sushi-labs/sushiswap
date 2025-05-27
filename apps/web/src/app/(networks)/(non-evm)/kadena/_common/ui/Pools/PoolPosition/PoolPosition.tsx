import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { formatUSD } from 'sushi/format'
import { PAIR_DECIMALS } from '~kadena/_common/constants/pair-decimals'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import {
  formatUnitsForInput,
  parseUnits,
  toBigNumber,
} from '~tron/_common/lib/utils/formatters'
import { LiquidityItem } from '../PoolDetails/LiquidityItem'
import { useRemoveLiqDispatch } from '../Remove/pool-remove-provider'
import { usePoolState } from '../pool-provider'

export type TempToken = {
  tokenName: string
  tokenId?: string
  tokenSymbol: string
  tokenImage: string
  tokenDecimals?: number
  tokenAddress?: string
}

export const PoolPosition = ({
  token0,
  token1,
  isLoading,
}: {
  token0: TempToken | undefined
  token1: TempToken | undefined
  isLoading: boolean
}) => {
  const token0StakedInUsd = 0
  const token1StakedInUsd = 0
  const { reserve0, reserve1 } = usePoolState()
  const {
    setTotalSupplyLP,
    setAmountToken0PerLP,
    setAmountToken1PerLP,
    setLPBalance,
  } = useRemoveLiqDispatch()

  const totalSupply = '5.4'
  const [isLoadingTotalSupply, setIsLoadingTotalSupply] = useState(true)

  const lpBalance = '.09'
  const token0Price = '3.93'
  const token1Price = '2.7'

  const [isLoadingToken0Price, setIsLoadingToken0Price] = useState(true)
  const [isLoadingToken1Price, setIsLoadingToken1Price] = useState(true)
  const [isLoadingLPBalance, setIsLoadingLPBalance] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingToken0Price(false)
      setIsLoadingToken1Price(false)
      setIsLoadingTotalSupply(false)
      setIsLoadingLPBalance(false)
    }, 1800)
  }, [])

  useEffect(() => {
    if (lpBalance && !isLoadingLPBalance) {
      setLPBalance(lpBalance)
    }
  }, [isLoadingLPBalance, setLPBalance])

  useEffect(() => {
    if (totalSupply && !isLoadingTotalSupply) {
      setTotalSupplyLP(totalSupply)
    }
  }, [isLoadingTotalSupply, setTotalSupplyLP])

  const _amountToken0PerLP = useMemo(() => {
    if (!totalSupply || !reserve0) return ''
    const formattedReserve0 = formatUnitsForInput(
      reserve0,
      token0?.tokenDecimals ?? 0,
    )
    const formattedTotalSupply = formatUnitsForInput(totalSupply, PAIR_DECIMALS)
    const resBN = toBigNumber(formattedReserve0)
    const totalSupplyBN = toBigNumber(formattedTotalSupply)
    return String(resBN.div(totalSupplyBN))
  }, [reserve0, token0])

  useEffect(() => {
    if (_amountToken0PerLP) {
      setAmountToken0PerLP(_amountToken0PerLP)
    }
  }, [_amountToken0PerLP, setAmountToken0PerLP])

  const _amountToken1PerLP = useMemo(() => {
    if (!totalSupply || !reserve1) return ''
    const formattedReserve1 = formatUnitsForInput(
      reserve1,
      token1?.tokenDecimals ?? 0,
    )
    const formattedTotalSupply = formatUnitsForInput(totalSupply, PAIR_DECIMALS)
    const resBN = toBigNumber(formattedReserve1)
    const totalSupplyBN = toBigNumber(formattedTotalSupply)
    return String(resBN.div(totalSupplyBN))
  }, [reserve1, token1])

  useEffect(() => {
    if (_amountToken1PerLP) {
      setAmountToken1PerLP(_amountToken1PerLP)
    }
  }, [_amountToken1PerLP, setAmountToken1PerLP])

  const amountToken0 = useMemo(() => {
    if (!lpBalance || !_amountToken0PerLP) return '0'
    const formattedLP = formatUnitsForInput(lpBalance, PAIR_DECIMALS)
    const lpTokenAmountBeingRemovedBN = toBigNumber(formattedLP)
    const amountToken0PerLPBN = toBigNumber(_amountToken0PerLP)
    return String(lpTokenAmountBeingRemovedBN.times(amountToken0PerLPBN))
  }, [_amountToken0PerLP])

  const amountToken1 = useMemo(() => {
    if (!lpBalance || !_amountToken1PerLP) return '0'
    const formattedLP = formatUnitsForInput(lpBalance, PAIR_DECIMALS)
    const lpTokenAmountBeingRemovedBN = toBigNumber(formattedLP)
    const amountToken1PerLPBN = toBigNumber(_amountToken1PerLP)
    return String(lpTokenAmountBeingRemovedBN.times(amountToken1PerLPBN))
  }, [_amountToken1PerLP])

  const loading = isLoading || isLoadingToken0Price || isLoadingToken1Price

  const token0UnstakedInUsd = Number(token0Price) * Number(amountToken0)
  const token1UnstakedInUsd = Number(token1Price) * Number(amountToken1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Position</CardTitle>
        <CardDescription>
          <span className="text-sm text-right text-gray-900 dark:text-slate-50">
            {loading ? (
              <div className="w-28">
                <SkeletonText fontSize="sm" />
              </div>
            ) : (
              formatUSD(
                token0StakedInUsd +
                  token1StakedInUsd +
                  token0UnstakedInUsd +
                  token1UnstakedInUsd,
              )
            )}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <LiquidityItem
            isLoading={loading}
            token={token0}
            amount={String(
              parseUnits(amountToken0, token0?.tokenDecimals ?? 18),
            )}
            usdAmount={String(token0UnstakedInUsd)}
          />
          <LiquidityItem
            isLoading={loading}
            token={token1}
            amount={String(
              parseUnits(amountToken1, token1?.tokenDecimals ?? 18),
            )}
            usdAmount={String(token1UnstakedInUsd)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
