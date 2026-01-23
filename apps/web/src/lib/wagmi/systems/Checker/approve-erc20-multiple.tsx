'use client'

import type { ButtonProps } from '@sushiswap/ui'
import type { Amount } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'

import { ApproveERC20 } from './approve-erc20'

interface ApproveERC20MultipleProps<TChainId extends EvmChainId | SvmChainId>
  extends ButtonProps {
  id: string
  amounts: {
    amount: Amount<CurrencyFor<TChainId>>
    contract: AddressFor<TChainId>
  }[]
  enabled?: boolean
  index?: number
}

/*
 * Recursive component for multiple ApproveERC20s
 */
function ApproveERC20Multiple<TChainId extends EvmChainId | SvmChainId>({
  fullWidth = true,
  size = 'xl',
  index,
  id,
  amounts,
  children,
  ...props
}: ApproveERC20MultipleProps<TChainId>) {
  if (amounts === undefined) return <>{children}</>
  const _index = typeof index === 'number' ? index : amounts.length - 1
  if (_index < 0) return <>{children}</>

  return (
    <ApproveERC20
      {...props}
      fullWidth={fullWidth}
      size={size}
      id={`${id}-${_index}`}
      amount={amounts[_index].amount}
      contract={amounts[_index].contract}
    >
      <ApproveERC20Multiple
        {...props}
        index={_index - 1}
        id={id}
        amounts={amounts}
      >
        {children}
      </ApproveERC20Multiple>
    </ApproveERC20>
  )
}

export { ApproveERC20Multiple, type ApproveERC20MultipleProps }
