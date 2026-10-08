import { SkeletonText } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { useCurrencyPrice } from 'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-currency-price'
import type { ValueTransferChainId } from 'src/lib/swap/value-transfer/types'
import { Amount, formatNumber, formatUSD } from 'sushi'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'

export function SourceNetworkFee({
  fee,
  currency,
  display = 'native',
}: {
  fee: LayerZeroSourceNetworkFee
  currency: CurrencyFor<ValueTransferChainId>
  display?: 'native' | 'usd'
}): ReactNode {
  const price = useCurrencyPrice({
    currency,
    enabled: fee.status === 'estimated',
  })

  switch (fee.status) {
    case 'estimated': {
      const amount = new Amount(currency, fee.amount)
      const amountUSD =
        !price.isError &&
        price.data !== undefined &&
        Number.isFinite(price.data) &&
        price.data > 0
          ? Number(amount.toString()) * price.data
          : undefined
      const usd =
        amountUSD !== undefined ? (
          formatUSD(amountUSD)
        ) : price.isLoading ? (
          <span aria-label="Loading gas price">
            <SkeletonText fontSize="sm" className="!w-[60px]" />
          </span>
        ) : (
          'N/A'
        )
      const nativeFee = `${formatNumber(amount.toString())} ${currency.symbol}`
      if (display === 'usd')
        return amountUSD !== undefined || price.isLoading ? usd : nativeFee
      return (
        <span>
          {nativeFee} <span className="text-muted-foreground">({usd})</span>
        </span>
      )
    }
    case 'loading':
      return (
        <span aria-label="Estimating source network gas">
          <SkeletonText fontSize="sm" className="!w-[80px]" />
        </span>
      )
    case 'connect-wallet':
    case 'approval-required':
    case 'unavailable': {
      const message = {
        'connect-wallet': 'Connect wallets to estimate',
        'approval-required': 'Available after token approval',
        unavailable: 'Estimate unavailable',
      }[fee.status]
      return display === 'usd' ? <span title={message}>N/A</span> : message
    }
  }
}
