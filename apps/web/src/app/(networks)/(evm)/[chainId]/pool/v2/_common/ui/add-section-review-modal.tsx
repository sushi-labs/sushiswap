import { Button, List } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { type Amount, Price, formatUSD } from 'sushi'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import { Rate } from './rate'

interface AddSectionReviewModal {
  chainId: EvmChainId
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
}

export const AddSectionReviewModal: FC<AddSectionReviewModal> = ({
  chainId,
  input0,
  input1,
}) => {
  const [value0, value1] = useTokenAmountDollarValues({
    chainId,
    amounts: [input0, input1],
  })

  const price = useMemo(() => {
    if (!input0 || !input1) return undefined
    return new Price({ baseAmount: input0, quoteAmount: input1 })
  }, [input0, input1])

  return (
    <div className="flex flex-col gap-4">
      <List>
        <List.Control>
          {input0 ? (
            <List.KeyValue
              flex
              title={`${input0.currency.symbol}`}
              className="!items-start"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Currency.Icon
                    currency={input0.currency}
                    width={18}
                    height={18}
                  />
                  {input0?.toSignificant(6)} {input0.currency.symbol}
                </div>
                <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                  {formatUSD(value0)}
                </span>
              </div>
            </List.KeyValue>
          ) : null}
          {input1 ? (
            <List.KeyValue
              flex
              title={`${input1.currency.symbol}`}
              className="!items-start"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Currency.Icon
                    currency={input1.currency}
                    width={18}
                    height={18}
                  />
                  {input1?.toSignificant(6)} {input1.currency.symbol}
                </div>
                <span className="text-xs font-normal text-gray-600 dark:text-slate-400">
                  {formatUSD(value1)}
                </span>
              </div>
            </List.KeyValue>
          ) : null}
          <List.KeyValue flex title="Rate">
            <Rate price={price}>
              {({ toggleInvert, content, usdPrice }) => (
                <Button
                  size="sm"
                  asChild
                  variant="link"
                  role="button"
                  className="!no-underline"
                  onClick={() => toggleInvert()}
                >
                  {content}{' '}
                  {usdPrice && (
                    <span className="font-normal text-gray-500 dark:text-slate-300">
                      (${usdPrice})
                    </span>
                  )}
                </Button>
              )}
            </Rate>
          </List.KeyValue>
        </List.Control>
      </List>
    </div>
  )
}
