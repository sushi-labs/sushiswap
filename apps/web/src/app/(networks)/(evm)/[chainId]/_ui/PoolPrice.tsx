'use client'

import {
  type RawV2Pool,
  type RawV3Pool,
  hydrateV2Pool,
  hydrateV3Pool,
} from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardGroup,
  CardHeader,
  CardTitle,
  Currency,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { Amount } from 'sushi'
import { SushiSwapProtocol, unwrapEvmToken } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'

export const PoolPrice = ({
  pool: rawPool,
  showRate = false,
}: { pool: RawV2Pool | RawV3Pool; showRate?: boolean }) => {
  const pool = useMemo(
    () =>
      rawPool.protocol === SushiSwapProtocol.SUSHISWAP_V2
        ? hydrateV2Pool(rawPool)
        : hydrateV3Pool(rawPool),
    [rawPool],
  )
  const reserveToken0 = pool.token0
  const reserveToken1 = pool.token1

  const { token0, token1 } = useMemo(() => {
    return {
      token0: unwrapEvmToken(pool?.token0),
      token1: unwrapEvmToken(pool?.token1),
    }
  }, [pool])

  const { data: price0 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken0.address,
  })

  const { data: price1 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken1.address,
  })

  const reserve1To2 = useMemo(() => {
    if (!price0 || !price1) return '0.00'
    const a0 = Amount.tryFromHuman(reserveToken0, price0)
    const a1 = Amount.tryFromHuman(reserveToken1, price1)
    if (!a0 || !a1) return '0.00'

    const a1Human = Number(a1.toString())
    const ratio = a0.div(a1Human)

    return ratio.toSignificant(6)
  }, [price0, price1, reserveToken0, reserveToken1])

  const reserve2To1 = useMemo(() => {
    if (!price0 || !price1) return '0.00'
    const a0 = Amount.tryFromHuman(reserveToken0, price0)
    const a1 = Amount.tryFromHuman(reserveToken1, price1)
    if (!a0 || !a1) return '0.00'

    const a0Human = Number(a0.toString())
    const ratio = a1.div(a0Human)

    return ratio.toSignificant(6)
  }, [price0, price1, reserveToken0, reserveToken1])

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-4 w-full text-sm">
          {token0 ? (
            <div className="flex items-center flex-wrap gap-1 justify-between w-full">
              <div className="flex gap-2 items-center font-medium text-muted-foreground">
                <Currency.Icon currency={token0} width={18} height={18} />{' '}
                {token0.symbol}
              </div>
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${token0.symbol} = ${reserve1To2} ${token1.symbol}`
                  : null}
                <span
                  className={classNames(
                    'font-normal text-muted-foreground',
                    !showRate &&
                      '!text-slate-900 dark:!text-slate-50 !font-medium',
                  )}
                >
                  ${price0?.toFixed(2) ?? '0.00'}
                </span>
              </span>
            </div>
          ) : null}
          {token1 ? (
            <div className="flex items-center flex-wrap gap-1 justify-between w-full">
              <div className="flex gap-2 items-center font-medium text-muted-foreground">
                <Currency.Icon currency={token1} width={18} height={18} />{' '}
                {token1.symbol}
              </div>
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${token1.symbol} = ${reserve2To1} ${token0.symbol}`
                  : null}
                <span
                  className={classNames(
                    'font-normal text-muted-foreground',
                    !showRate &&
                      '!text-slate-900 dark:!text-slate-50 !font-medium',
                  )}
                >
                  ${price1?.toFixed(2) ?? '0.00'}
                </span>
              </span>
            </div>
          ) : null}
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
