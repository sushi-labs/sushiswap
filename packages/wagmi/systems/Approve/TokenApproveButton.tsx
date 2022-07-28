import { Transition } from '@headlessui/react'
import { Amount, Currency } from '@sushiswap/currency'
import { Badge, Button, classNames, Currency as CurrencyFromUi, IconButton, Popover, Typography } from '@sushiswap/ui'
import { FC, memo, useEffect } from 'react'

import { ApprovalState, useERC20ApproveCallback } from '../../hooks'
import { DefaultButton } from './DefaultButton'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

type RenderPropPayload = ApprovalButtonRenderProp

export interface TokenApproveButton extends ApproveButton<RenderPropPayload> {
  watch?: boolean
  amount?: Amount<Currency>
  address?: string
}

export const TokenApproveButton: FC<TokenApproveButton> = memo(
  ({
    watch = true,
    amount,
    address,
    render,
    dispatch,
    disabled,
    index,
    allApproved,
    hideIcon,
    initialized,
    ...props
  }) => {
    const [approvalState, onApprove] = useERC20ApproveCallback(watch, amount, address)

    // Set to undefined on unmount
    useEffect(() => {
      return () => {
        if (!dispatch || index === undefined) return
        dispatch({ type: 'remove', payload: { index } })
      }
    }, [])

    useEffect(() => {
      if (!dispatch || index === undefined || amount === undefined) return

      dispatch({
        type: 'update',
        payload: {
          state: [
            approvalState,
            !amount?.currency.isNative ? (
              <Button
                {...props}
                type="button"
                key={1}
                className={classNames('whitespace-nowrap', props.className)}
                onClick={onApprove}
                disabled={disabled || approvalState === ApprovalState.PENDING}
              >
                Approve {amount?.currency.symbol}
              </Button>
            ) : undefined,
            false,
          ],
          index,
        },
      })
    }, [
      amount,
      amount?.currency.isNative,
      amount?.currency.symbol,
      approvalState,
      disabled,
      dispatch,
      index,
      onApprove,
      props,
    ])

    if (render) return render({ approvalState, onApprove })
    if (hideIcon) return <></>

    return (
      <Transition
        unmount={false}
        show={
          !allApproved &&
          initialized &&
          amount &&
          !amount.currency.isNative &&
          ![ApprovalState.UNKNOWN].includes(approvalState)
        }
        enter="transform transition duration-[400ms] delay-[700ms] ease-out"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <DefaultButton as="div" {...props}>
          <Popover
            as="div"
            disableClickListener
            hover
            button={
              <Badge
                badgeContent={
                  <div
                    className={classNames(
                      approvalState === ApprovalState.PENDING
                        ? 'bg-yellow'
                        : approvalState === ApprovalState.APPROVED
                        ? 'bg-green'
                        : 'bg-red',
                      'w-2 h-2 rounded-full shadow-md'
                    )}
                  />
                }
              >
                <IconButton
                  as="div"
                  className={classNames(
                    disabled || approvalState === ApprovalState.PENDING ? 'pointer-events-none saturate-[0]' : '',
                    'flex items-center justify-center'
                  )}
                  onClick={onApprove}
                >
                  {amount && <CurrencyFromUi.Icon currency={amount?.currency} width="100%" height="100%" />}
                </IconButton>
              </Badge>
            }
            panel={
              <div className="flex flex-col gap-2 bg-slate-800 max-w-[200px] p-3">
                <Typography variant="xs" weight={500}>
                  Status:
                  <span
                    className={classNames(
                      'ml-1 capitalize',
                      approvalState === ApprovalState.PENDING
                        ? 'text-yellow'
                        : approvalState === ApprovalState.APPROVED
                        ? 'text-green'
                        : 'text-red'
                    )}
                  >
                    {approvalState.toLowerCase().replace('_', ' ')}
                  </span>
                </Typography>
                <Typography variant="xs" weight={500} className="text-slate-400">
                  We need your approval first to execute this transaction on your behalf; you will only have to approve
                  the {amount?.currency.symbol} contract once.
                </Typography>
              </div>
            }
          />
        </DefaultButton>
      </Transition>
    )
  }
)
