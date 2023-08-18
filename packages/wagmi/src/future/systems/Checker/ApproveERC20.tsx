import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { Amount, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { Select, SelectContent, SelectItem, SelectPrimitive } from '@sushiswap/ui/components/select'
import React, { FC, useState } from 'react'
import { Address } from 'wagmi'

import { ApprovalState, useTokenApproval } from '../../hooks'

interface ApproveERC20Props extends ButtonProps {
  id: string
  amount: Amount<Type> | undefined
  contract: Address | undefined
  enabled?: boolean
}

const ApproveERC20: FC<ApproveERC20Props> = ({
  id,
  amount,
  contract,
  children,
  className,
  fullWidth = true,
  size = 'xl',
  enabled = true,
  ...props
}) => {
  const [max, setMax] = useState(false)
  const [state, { write }] = useTokenApproval({
    amount,
    spender: contract,
    enabled,
    approveMax: max,
  })

  if (state === ApprovalState.APPROVED || !enabled) {
    return <>{children}</>
  }

  const loading = [ApprovalState.UNKNOWN, ApprovalState.LOADING, ApprovalState.PENDING].includes(state)

  return (
    <Button
      disabled={state !== ApprovalState.NOT_APPROVED || !write}
      loading={loading}
      testId={id}
      className={classNames(className, 'group relative')}
      onClick={() => write?.()}
      fullWidth={fullWidth}
      size={size}
      {...props}
    >
      Approve {amount?.currency.symbol} {max ? 'Permanently' : ''}
      <Explainer>
        <div className="flex flex-col gap-3">
          We need your approval to execute this transaction on your behalf.
          <a
            target="_blank"
            className="flex items-center gap-1 text-blue dark:text-blue dark:font-semibold hover:text-blue-700"
            href="https://www.sushi.com/academy/articles/what-is-token-approval"
            rel="noreferrer"
          >
            Learn more <ChevronRightIcon width={12} height={12} />
          </a>
        </div>
      </Explainer>
      <div className={classNames(fullWidth ? 'absolute' : '', 'right-1 top-1 bottom-1')}>
        <Select value={`${max}`} onValueChange={(val) => setMax(val === 'true')}>
          <SelectPrimitive.Trigger>
            <IconButton size="lg" icon={ChevronDownIcon} name="Select" />
          </SelectPrimitive.Trigger>
          <SelectContent className="w-80">
            <SelectItem value="false">
              <div className="flex flex-col">
                <span className="font-semibold">Approve one-time only</span>
                <span className="text-sm">
                  You'll give your approval to spend {amount?.toSignificant(6)} {amount?.currency?.symbol} on your
                  behalf
                </span>
              </div>
            </SelectItem>
            <SelectItem value="true">
              <div className="flex flex-col">
                <span className="font-semibold">Approve unlimited amount</span>
                <span className="text-sm">
                  You won't need to approve again next time you want to spend {amount?.currency?.symbol}.
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Button>
  )
}

export { ApproveERC20, type ApproveERC20Props }
