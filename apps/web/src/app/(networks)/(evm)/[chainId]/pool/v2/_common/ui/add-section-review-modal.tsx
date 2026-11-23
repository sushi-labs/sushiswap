import { Button, Currency, List } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { ReviewAmountValue } from 'src/lib/components/review-amount-value'
import { ReviewDetailRow } from 'src/lib/components/review-detail-row'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { type Amount, Price } from 'sushi'
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
  const amounts = [input0, input1]
  const usdValues = useTokenAmountDollarValues({
    chainId,
    amounts,
  })

  const price = useMemo(() => {
    if (!input0 || !input1) return undefined
    return new Price({ baseAmount: input0, quoteAmount: input1 })
  }, [input0, input1])

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)] scroll">
      <List className="!pt-0">
        {(input0 || input1) && (
          <List.Control className="!rounded-2xl !bg-transparent !px-3 !py-2">
            {amounts.map((amount, index) =>
              amount ? (
                <ReviewDetailRow key={amount.currency.id} title="You add">
                  <ReviewAmountValue usdValue={usdValues[index]}>
                    <div className="flex items-center gap-2">
                      {amount.toSignificant(6)}{' '}
                      <Currency.Icon
                        currency={amount.currency}
                        width={18}
                        height={18}
                      />
                      {amount.currency.symbol}
                    </div>
                  </ReviewAmountValue>
                </ReviewDetailRow>
              ) : null,
            )}
          </List.Control>
        )}
        <List.Control className="border-transparent !bg-transparent !px-0">
          <ReviewDetailRow title="Rate">
            <Rate price={price}>
              {({ toggleInvert, content, usdPrice }) => (
                <ReviewAmountValue usdValue={usdPrice}>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    className="!no-underline"
                    onClick={toggleInvert}
                  >
                    {content}
                  </Button>
                </ReviewAmountValue>
              )}
            </Rate>
          </ReviewDetailRow>
        </List.Control>
      </List>
    </div>
  )
}
