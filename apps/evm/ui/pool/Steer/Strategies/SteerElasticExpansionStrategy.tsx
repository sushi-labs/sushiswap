'use client'

import { Token } from '@sushiswap/currency'
import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Separator,
  Stat,
  StatLabel,
  StatValue,
} from '@sushiswap/ui'
import { tickToPrice } from '@sushiswap/v3-sdk'
import format from 'date-fns/format'
import uk from 'date-fns/locale/uk'
import { useEffect, useMemo, useRef, useState } from 'react'

import { SteerStrategyConfig } from '../constants'
import { SteerStrategyComponent } from '.'

const getNextAdjustment = (lastAdjustment: number, frequency: number) => {
  let diff = (lastAdjustment + frequency) * 1000 - Date.now()
  if (diff < 0) {
    diff = 0
  }

  return format(diff, 'HH:mm:ss', { locale: uk })
}

// TODO: Move shared calculations into the server-rendered page component
export const SteerElasticExpansionStrategy: SteerStrategyComponent = ({ vault }) => {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    container.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const [nextAdjustment, setNextAdjustment] = useState(
    getNextAdjustment(vault.lastAdjustmentTimestamp, vault.adjustmentFrequency)
  )

  useEffect(() => {
    const countdownInterval = setInterval(
      () => setNextAdjustment(getNextAdjustment(vault.lastAdjustmentTimestamp, vault.adjustmentFrequency)),
      1000
    )

    return () => {
      clearInterval(countdownInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNextAdjustment])

  const [token0p, token1p] = useMemo(() => {
    const [reserve0, reserve1] = [Number(vault.reserve0), Number(vault.reserve1)]
    const totalReserve = reserve0 + reserve1

    if (totalReserve === 0) return [100, 0]

    let [token0p, token1p] = [reserve0 / totalReserve, reserve1 / totalReserve]

    token0p = token0p < 0.001 ? 0 : token0p
    token1p = token1p < 0.001 ? 0 : token1p

    return [token0p, token1p]
  }, [vault])

  const [token0, token1] = useMemo(() => {
    const token0 = new Token({
      address: vault.token0.address,
      chainId: vault.pool.chainId,
      decimals: vault.token0.decimals,
      symbol: vault.token0.symbol,
      name: vault.token0.name,
    })

    const token1 = new Token({
      address: vault.token1.address,
      chainId: vault.pool.chainId,
      decimals: vault.token1.decimals,
      symbol: vault.token1.symbol,
      name: vault.token1.name,
    })

    return [token0, token1]
  }, [vault])

  const [lowerPrice, upperPrice] = useMemo(() => {
    let lowerPrice = tickToPrice(token0, token1, vault.lowerTick).toSignificant(7)
    let upperPrice = tickToPrice(token0, token1, vault.upperTick).toSignificant(7)

    lowerPrice = lowerPrice.length > 9 ? formatNumber(lowerPrice) : lowerPrice
    upperPrice = upperPrice.length > 9 ? formatNumber(upperPrice) : upperPrice

    return [lowerPrice, upperPrice]
  }, [token0, token1, vault])

  return (
    <Container ref={container} maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
            <CardDescription>
              Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{SteerStrategyConfig[vault.strategy].name}</CardTitle>
            <CardDescription>{SteerStrategyConfig[vault.strategy].description}</CardDescription>
          </CardHeader>
          <Separator />
          <div className="grid grid-cols-2">
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Weekly APR</StatLabel>
              <StatValue size="sm">{formatPercent(vault.apr)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">TVL</StatLabel>
              <StatValue size="sm">{formatUSD(vault.reserveUSD)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">
                {token0.symbol}:{token1.symbol} Ratio (%)
              </StatLabel>
              <StatValue size="sm">
                {formatPercent(token0p)} : {formatPercent(token1p)}
              </StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Adjustment frequency</StatLabel>
              {/* TODO: Improve */}
              <StatValue size="sm">Every {Math.floor(vault.adjustmentFrequency / 3600)} Hours</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Next Adjustment</StatLabel>
              <StatValue size="sm">{nextAdjustment}s</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Liquidity pool fee</StatLabel>
              <StatValue size="sm">{formatPercent(vault.pool.swapFee)}</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Time frame</StatLabel>
              <StatValue size="sm">20 days</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Deviation</StatLabel>
              <StatValue size="sm">2</StatValue>
            </Stat>
            <Stat className="px-6 py-3">
              <StatLabel size="sm">Management fee</StatLabel>
              <StatValue size="sm">{formatPercent(vault.performanceFee)}</StatValue>
            </Stat>
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>Liquidity Distribution</CardTitle>
          </CardHeader>
          <div className="px-6">
            <div className="h-[200px] bg-secondary rounded-xl flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Liquidity distribution here</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <Stat className="p-6">
              <StatLabel size="sm">Minimum price</StatLabel>
              <StatValue size="sm">{lowerPrice} ETH/DAI</StatValue>
            </Stat>
            <Stat className="p-6">
              <StatLabel size="sm">Maximum price</StatLabel>
              <StatValue size="sm">{upperPrice} ETH/DAI</StatValue>
            </Stat>
          </div>
        </Card>
      </div>
    </Container>
  )
}
