'use client'

import type { ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import type { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import type { Address } from 'viem'
import { TransferERC20 } from './TransferERC20'

interface TransferERC20MultipleProps extends ButtonProps {
  id: string
  amounts: { amount: Amount<EvmCurrency>; sendTo: Address }[]
  onSuccess?: () => void
  enabled?: boolean
}

const TransferERC20Multiple: FC<TransferERC20MultipleProps> = ({
  fullWidth = true,
  size = 'xl',
  index,
  id,
  amounts,
  onSuccess,
  children,
  ...props
}) => {
  if (amounts === undefined) return <>{children}</>
  return amounts.reduceRight<React.ReactNode>((acc, { amount, sendTo }) => {
    return (
      <TransferERC20
        key={`${amount.currency.symbol}-${sendTo}`}
        {...props}
        fullWidth={fullWidth}
        size={size}
        id={`${id}-${amount.currency.symbol}-${sendTo}`}
        amount={amount}
        onSuccess={onSuccess}
        sendTo={sendTo}
      >
        {acc}
      </TransferERC20>
    )
  }, children)
}

export { TransferERC20Multiple, type TransferERC20MultipleProps }
