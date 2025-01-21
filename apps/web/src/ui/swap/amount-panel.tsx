import { Currency } from '@sushiswap/ui'
import { FC } from 'react'
import { PricePanel } from 'src/lib/wagmi/components/web3-input/Currency/PricePanel'
import { Amount, Type } from 'sushi/currency'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'

interface AmountPanelProps {
  amount?: Amount<Type>
  label: string
}

export const AmountPanel: FC<AmountPanelProps> = ({ amount, label }) => {
  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: amount?.currency?.chainId,
    address: amount?.currency?.wrapped?.address,
  })

  return (
    <div className="flex flex-col gap-2 p-4 bg-white dark:!bg-secondary overflow-hidden rounded-xl pb-6">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-2 items-center">
        {amount?.currency ? (
          <Currency.Icon currency={amount.currency} width={48} height={48} />
        ) : null}
        <div className="flex justify-between w-full">
          <div className="flex flex-col font-medeium">
            <span className="text-2xl">{amount?.currency?.symbol}</span>
            <span className="text-muted-foreground">
              {amount?.currency?.name}
            </span>
          </div>
          <div className="flex flex-col items-end font-medium">
            {amount ? (
              <span className="text-2xl">{amount.toSignificant(6)}</span>
            ) : null}
            <PricePanel
              value={amount?.toSignificant(6) ?? ''}
              currency={amount?.currency}
              loading={isPriceLoading}
              price={price}
              className="!text-base"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
