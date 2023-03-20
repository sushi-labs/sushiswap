import React, { FC, Fragment, useState } from 'react'
import { ApproveTokenController } from '../../components'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'
import { Amount, Type } from '@sushiswap/currency'
import { ApprovalState } from '../../../hooks'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { NotificationData } from '@sushiswap/ui/future/components/toast'

export interface ApproveERC20Props extends ButtonProps<'button'> {
  id: string
  amount: Amount<Type> | undefined
  contract: string | undefined
  onSuccess?: (data: NotificationData) => void
  enabled?: boolean
}

export const ApproveERC20: FC<ApproveERC20Props> = ({
  id,
  amount,
  contract,
  children,
  className,
  variant,
  fullWidth,
  as,
  size,
  onSuccess,
  enabled = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <ApproveTokenController amount={amount} contract={contract} onSuccess={onSuccess}>
      {({ approvalState, onApprove }) => {
        if (approvalState === ApprovalState.APPROVED || !enabled || !contract) {
          return <>{children}</>
        }

        return (
          <Button
            as={as}
            loading={[ApprovalState.LOADING, ApprovalState.PENDING].includes(approvalState)}
            testdata-id={id}
            variant={variant}
            size={size}
            className={className}
            fullWidth={fullWidth}
            onClick={onApprove}
          >
            Approve {amount?.currency.symbol}
            <Menu
              as="div"
              className="relative flex justify-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Menu.Button as="div" role="button" className="text-center text-xs text-blue cursor-pointer">
                <InformationCircleIcon width={18} height={18} className="text-white" />
              </Menu.Button>
              <Transition
                as={Fragment}
                show={showTooltip}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="z-10 absolute pb-2 w-[max-content] bottom-4">
                  <Menu.Items className="text-left w-[240px] text-gray-700  border-gray-300 dark:border-slate-700 dark:text-slate-200 flex flex-col gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-hover-card shadow-black/30 px-4 py-3 text-xs mt-0.5">
                    <span className="text-gray-500 dark:text-slate-400">Token Approval</span>
                    We need your approval to execute this transaction on your behalf. You will only have to approve the{' '}
                    {amount?.currency.symbol} contract once.
                    <a
                      target="_blank"
                      className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center hover:text-blue-700"
                      href="https://www.sushi.com/academy/articles/what-is-token-approval"
                      rel="noreferrer"
                    >
                      Learn more <ChevronRightIcon width={12} height={12} />
                    </a>
                  </Menu.Items>
                </div>
              </Transition>
            </Menu>
          </Button>
        )
      }}
    </ApproveTokenController>
  )
}
