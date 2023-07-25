import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { TextField } from '@sushiswap/ui'
import { textFieldVariants, typographyVariants, WidgetDescription, WidgetFooter, WidgetTitle } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Widget, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useTotalSupply } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { FC, ReactNode, useMemo } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'

interface AddSectionStakeWidgetProps {
  title?: string
  chainId: number
  value: string
  setValue(value: string): void
  reserve0: Amount<Type> | null
  reserve1: Amount<Type> | null
  liquidityToken: Token
  children: ReactNode
  isFarm?: boolean
}

export const AddSectionStakeWidget: FC<AddSectionStakeWidgetProps> = ({
  title,
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
  isFarm,
}) => {
  const { balance } = usePoolPosition()
  const totalSupply = useTotalSupply(liquidityToken)

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
    <Widget id="stakeLiquidity" maxWidth="xl" className="bg-white dark:bg-slate-800">
      <div
        data-state={balance?.[FundSource.WALLET]?.greaterThan(ZERO) ? 'closed' : 'open'}
        className={classNames(
          'hover:data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none opacity-0 z-10 absolute inset-0'
        )}
      >
        <div className="absolute inset-0 paper bg-white/50 dark:bg-slate-800/50 flex items-center justify-center">
          <p className="text-sm">No liquidity tokens found{isFarm && '. Did you add liquidity first?'}</p>
        </div>
      </div>
      <WidgetHeader>
        <WidgetTitle>Stake Liquidity</WidgetTitle>
        <WidgetDescription>
          Stake your liquidity tokens to receive incentive rewards on top of your pool fee rewards
        </WidgetDescription>
      </WidgetHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className={textFieldVariants({ className: 'flex flex-col gap-2 !h-[unset]' })}>
            <TextField
              id="stake-input"
              variant="naked"
              type="number"
              onValueChange={setValue}
              value={value}
              placeholder="0"
              className="!text-2xl"
              unit="SLP"
            />
            <div className="flex w-full justify-between gap-2">
              <span className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
                {formatUSD(value0 + value1)}
              </span>
              <Button
                size="sm"
                variant="link"
                testId="stake-balance"
                onClick={() => setValue(balance?.[FundSource.WALLET]?.toExact() || '')}
              >
                Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
              </Button>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button
              size="xs"
              fullWidth
              variant={value === '25' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.[FundSource.WALLET]?.divide(4)?.toExact() || '')}
              testId="stake-25"
            >
              25%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={value === '50' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.[FundSource.WALLET]?.divide(2)?.toExact() || '')}
              testId="stake-50"
            >
              50%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={value === '75' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.[FundSource.WALLET]?.divide(4).multiply(3)?.toExact() || '')}
              testId="stake-75"
            >
              75%
            </Button>
            <Button
              size="xs"
              fullWidth
              variant={value === '100' ? 'default' : 'secondary'}
              onClick={() => setValue(balance?.[FundSource.WALLET]?.toExact() || '')}
              testId="stake-max"
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
