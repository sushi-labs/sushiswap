import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'
import { FiatInput } from '../../fiat/fiat-input'
import { FiatPurchaseButton } from '../../fiat/fiat-purchase-button'
import { FiatSwitchTokensButton } from '../../fiat/fiat-switch-tokens-button'
import { FiatToken1Input } from '../../fiat/fiat-token1-input'

export const FiatWidget: FC<{ animated: boolean }> = ({ animated }) => {
  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'animate-slide-secondary': animated,
      })}
    >
      <FiatInput />
      <FiatSwitchTokensButton />
      <FiatToken1Input />
      <FiatPurchaseButton />
    </div>
  )
}
