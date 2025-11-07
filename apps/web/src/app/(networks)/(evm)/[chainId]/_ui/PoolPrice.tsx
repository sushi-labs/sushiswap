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
import { EvmToken, SushiSwapProtocol } from 'sushi/evm'
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

  const { data: price0 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken0.address,
  })

  const { data: price1 } = usePrice({
    chainId: pool.chainId,
    address: reserveToken1.address,
  })

  const reserve1To2 =
    price1 && price0
      ? (() => {
          const a0 = Amount.tryFromHuman(reserveToken0, price0)
          const a1 = Amount.tryFromHuman(reserveToken1, price1)
          if (!a0 || !a1) return '0.00'

          const a1Human = Number(a1.amount) / 10 ** reserveToken1.decimals
          const ratio = a0.div(a1Human)

          const ratioHuman = Number(ratio.amount) / 10 ** reserveToken0.decimals

          return ratioHuman.toFixed(2)
        })()
      : '0.00'

  const reserve2To1 =
    price0 && price1
      ? (() => {
          const a0 = Amount.tryFromHuman(reserveToken0, price0)
          const a1 = Amount.tryFromHuman(reserveToken1, price1)
          if (!a0 || !a1) return '0.00'

          const a0Human = Number(a0.amount) / 10 ** reserveToken0.decimals
          const ratio = a1.div(a0Human)

          const ratioHuman = Number(ratio.amount) / 10 ** reserveToken1.decimals

          return ratioHuman.toFixed(2)
        })()
      : '0.00'

  return (
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex flex-col gap-1">
        <CardTitle>Price</CardTitle>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-4 w-full text-sm">
          {reserveToken0 ? (
            <div className="flex items-center flex-wrap gap-1 justify-between w-full">
              <div className="flex gap-2 items-center font-medium text-muted-foreground">
                <Currency.Icon
                  currency={
                    new EvmToken({
                      ...reserveToken0,
                    })
                  }
                  width={18}
                  height={18}
                />{' '}
                {reserveToken0.symbol}
              </div>
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${reserveToken0.symbol} = ${reserve1To2} ${reserveToken1.symbol}`
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
          {reserveToken1 ? (
            <div className="flex items-center flex-wrap gap-1 justify-between w-full">
              <div className="flex gap-2 items-center font-medium text-muted-foreground">
                <Currency.Icon
                  currency={
                    new EvmToken({
                      ...reserveToken1,
                    })
                  }
                  width={18}
                  height={18}
                />{' '}
                {reserveToken1.symbol}
              </div>
              <span className="flex gap-1 font-medium">
                {showRate
                  ? `1 ${reserveToken1.symbol} = ${reserve2To1} ${reserveToken0.symbol}`
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
