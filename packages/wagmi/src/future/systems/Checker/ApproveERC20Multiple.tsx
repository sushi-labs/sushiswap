import React, { FC } from 'react'
import { ButtonProps } from '@sushiswap/ui/future/components/button'
import { Amount, Type } from '@sushiswap/currency'
import { Address } from 'wagmi'
import dynamic from 'next/dynamic'
import { ApproveERC20 } from './ApproveERC20'

export interface ApproveERC20MultipleProps extends ButtonProps<'button'> {
  id: string
  amounts: { amount: Amount<Type>; contract: Address }[]
  enabled?: boolean
  index?: number
}

/*
 * Recursive component for multiple ApproveERC20s
 */
export const Component: FC<ApproveERC20MultipleProps> = ({ index, id, amounts, children, ...props }) => {
  if (amounts === undefined) return <>{children}</>
  const _index = typeof index === 'number' ? index : amounts.length - 1
  if (_index < 0) return <>{children}</>

  return (
    <ApproveERC20 {...props} id={`${id}-${_index}`} amount={amounts[_index].amount} contract={amounts[_index].contract}>
      <Component {...props} index={_index - 1} id={id} amounts={amounts}>
        {children}
      </Component>
    </ApproveERC20>
  )
}

export const ApproveERC20Multiple = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
