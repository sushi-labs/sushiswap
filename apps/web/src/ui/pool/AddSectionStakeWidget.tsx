import {
  Message,
  TextField,
  WidgetDescription,
  WidgetFooter,
  WidgetTitle,
  textFieldVariants,
  typographyVariants,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Widget, WidgetHeader } from '@sushiswap/ui'
import { FC, ReactNode, useMemo } from 'react'
import {
  useTokenAmountDollarValues,
  useUnderlyingTokenBalanceFromPool,
} from 'src/lib/hooks'
import { Amount, Token, Type, tryParseAmount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import type { ChainId } from 'sushi/chain'
import { usePoolPosition } from './PoolPositionProvider'

interface AddSectionStakeWidgetProps {
  title?: string
  chainId: ChainId
  value: string
  setValue(value: string): void
  reserve0: Amount<Type> | null
  reserve1: Amount<Type> | null
  liquidityToken: Token | undefined
  children: ReactNode
  isFarm?: boolean
  isIncentivized?: boolean
}

export const AddSectionStakeWidget: FC<AddSectionStakeWidgetProps> = ({
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
  isIncentivized,
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
    <Widget id="stakeLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Stake Liquidity</WidgetTitle>
        <WidgetDescription>
          Stake your liquidity tokens to receive incentive rewards on top of
          your pool fee rewards
        </WidgetDescription>
      </WidgetHeader>
      {!isIncentivized ? (
        <Message variant="warning" size="sm" className="mb-4">
          This pool does not have any ongoing incentives being distributed to
          staked LP tokens.
        </Message>
      ) : null}
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={textFieldVariants({
                className: 'flex flex-col gap-2 !h-[unset]',
              })}
            >
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
                <span
                  className={typographyVariants({
                    variant: 'muted',
                    className: 'text-sm',
                  })}
                >
                  {formatUSD(value0 + value1)}
                </span>
                <Button
                  size="sm"
                  variant="link"
                  testId="stake-balance"
                  onClick={() => setValue(balance?.toExact() || '')}
                >
                  Balance: {balance?.toSignificant(6)}
                </Button>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Button
                size="xs"
                fullWidth
                variant={value === '25' ? 'default' : 'secondary'}
                onClick={() => setValue(balance?.divide(4)?.toExact() || '')}
                testId="stake-25"
              >
                25%
              </Button>
              <Button
                size="xs"
                fullWidth
                variant={value === '50' ? 'default' : 'secondary'}
                onClick={() => setValue(balance?.divide(2)?.toExact() || '')}
                testId="stake-50"
              >
                50%
              </Button>
              <Button
                size="xs"
                fullWidth
                variant={value === '75' ? 'default' : 'secondary'}
                onClick={() =>
                  setValue(balance?.divide(4).multiply(3)?.toExact() || '')
                }
                testId="stake-75"
              >
                75%
              </Button>
              <Button
                size="xs"
                fullWidth
                variant={value === '100' ? 'default' : 'secondary'}
                onClick={() => setValue(balance?.toExact() || '')}
                testId="stake-max"
              >
                MAX
              </Button>
            </div>
          </div>
        </div>
        <WidgetFooter>{children}</WidgetFooter>
      </div>
    </Widget>
  )
}
