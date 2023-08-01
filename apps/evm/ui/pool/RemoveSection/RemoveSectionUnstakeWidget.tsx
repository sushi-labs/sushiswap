'use client'

import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import {
  TextField,
  textFieldVariants,
  typographyVariants,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Widget, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useTotalSupply } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { FC, ReactNode, useMemo } from 'react'

import { usePoolPositionStaked } from '../PoolPositionStakedProvider'

interface RemoveSectionUnstakeWidget {
  chainId: ChainId
  value: string
  setValue(value: string): void
  reserve0: Amount<Type> | null
  reserve1: Amount<Type> | null
  liquidityToken: Token
  children: ReactNode
}

export const RemoveSectionUnstakeWidget: FC<RemoveSectionUnstakeWidget> = ({
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
}) => {
  const totalSupply = useTotalSupply(liquidityToken)
  const { balance } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0,
    reserve1,
    totalSupply,
    balance: amount,
  })

  const [value0, value1] = useTokenAmountDollarValues({
    chainId,
    amounts: underlying,
  })

  return (
    <Widget id="stakeLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Unstake Liquidity</WidgetTitle>
        <WidgetDescription>
          Unstake your liquidity tokens first if you mean to remove your liquidity position
        </WidgetDescription>
      </WidgetHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className={textFieldVariants({ className: 'flex flex-col gap-2 !h-[unset]' })}>
            <TextField
              id="amount"
              placeholder="0.0"
              unit={balance?.currency.symbol}
              type="number"
              value={value}
              onValueChange={setValue}
              className="text-2xl"
              variant="naked"
            />
            <div className="flex w-full justify-between gap-2">
              <span className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
                {formatUSD(value0 + value1)}
              </span>
              <Button variant="link" size="sm" onClick={() => setValue(balance?.toExact() || '')}>
                Balance: {balance?.toSignificant(6)}
              </Button>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button
              fullWidth
              size="xs"
              variant={value === '50' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.divide(4)?.toExact() || '')}
              testId="unstake-25"
            >
              25%
            </Button>
            <Button
              fullWidth
              size="xs"
              variant={value === '50' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.divide(2)?.toExact() || '')}
              testId="unstake-50"
            >
              50%
            </Button>
            <Button
              fullWidth
              size="xs"
              variant={value === '75' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.divide(4).multiply(3)?.toExact() || '')}
              testId="unstake-75"
            >
              75%
            </Button>
            <Button
              fullWidth
              size="xs"
              variant={value === '100' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.toExact() || '')}
              testId="unstake-max"
            >
              MAX
            </Button>
          </div>
        </div>
      </div>
      <WidgetFooter>{children}</WidgetFooter>
    </Widget>
  )
}
