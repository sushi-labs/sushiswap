import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Badge, BentoboxIcon, Button, classNames, IconButton, Popover, Typography } from '@sushiswap/ui'
import { FC, memo, useEffect } from 'react'

import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { DefaultButton } from './DefaultButton'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  onSignature(sig?: Signature): void
  watch?: boolean
  address?: string
}

export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({
    watch = true,
    address: masterContract,
    render,
    dispatch,
    index,
    disabled,
    onSignature,
    allApproved,
    ...props
  }) => {
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({ watch, masterContract, onSignature })

    // Set to undefined on unmount
    useEffect(() => {
      return () => {
        if (!dispatch || index === undefined) return
        dispatch({ type: 'remove', payload: { index } })
      }
    }, [])

    useEffect(() => {
      if (!dispatch || index === undefined) return

      dispatch({
        type: 'update',
        payload: {
          state: [
            approvalState,
            <Button
              {...props}
              type="button"
              key={1}
              className={classNames('whitespace-nowrap', props.className)}
              onClick={onApprove}
              disabled={disabled || approvalState === ApprovalState.PENDING}
            >
              Approve BentoBox
            </Button>,
            true,
          ],
          index,
        },
      })
    }, [approvalState, disabled, dispatch, index, onApprove, props, signature])

    if (allApproved || masterContract === AddressZero) return null
    if (render) return render({ approvalState, signature, onApprove })

    return (
      <DefaultButton as="div" {...props}>
        <Popover
          as="div"
          hover
          disableClickListener
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
                  'flex items-center justify-center bg-slate-700 rounded-full'
                )}
                onClick={onApprove}
              >
                <div className="bg-white bg-opacity-[0.24] rounded-full flex items-center justify-center w-6 h-6">
                  <BentoboxIcon width={14} height={14} />
                </div>
              </IconButton>
            </Badge>
          }
          panel={
            <div className="bg-slate-800 p-3 flex flex-col gap-3 max-w-[200px]">
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
                This is a one-time approval for Sushi to access your wallet using BentoBox.
              </Typography>
              <Typography variant="xs" weight={500} className="text-slate-400 flex flex-col gap-1">
                <span className="text-slate-200">Why should I approve this?</span>
                <span>
                  BentoBox is a token vault. You can minimize approval transactions, reduce gas costs and earn passive
                  income from yield strategies with BentoBox.
                </span>
              </Typography>
            </div>
          }
        />
      </DefaultButton>
    )
  }
)
