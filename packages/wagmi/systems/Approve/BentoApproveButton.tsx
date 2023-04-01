import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Transition } from '@headlessui/react'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Badge, BentoboxIcon, Button, classNames, IconButton, Tooltip, Typography } from '@sushiswap/ui'
import { FC, memo, useEffect } from 'react'
import { Address, useNetwork } from 'wagmi'

import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { DefaultButton } from './DefaultButton'
import { ApprovalButtonRenderProp, ApproveButton } from './types'

interface RenderPropPayload extends ApprovalButtonRenderProp {
  signature: Signature | undefined
}

export interface BentoApproveButton extends ApproveButton<RenderPropPayload> {
  onSignature(sig?: Signature): void
  watch?: boolean
  address?: Address
}

// eslint-disable-next-line react/display-name
export const BentoApproveButton: FC<BentoApproveButton> = memo(
  ({
    id,
    watch = true,
    address: masterContract,
    render,
    dispatch,
    index,
    disabled,
    onSignature,
    allApproved,
    initialized,
    hideIcon,
    enabled = true,
    ...props
  }) => {
    const { chain } = useNetwork()
    const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({
      chainId: chain?.id as BentoBoxV1ChainId,
      watch,
      masterContract,
      onSignature,
      enabled,
    })

    useEffect(() => {
      if (!enabled && dispatch && index !== undefined) {
        dispatch({
          type: 'update',
          payload: { state: [ApprovalState.APPROVED, undefined, true], index },
        })
      }
    }, [dispatch, enabled, index])

    // Set to undefined on unmount
    useEffect(() => {
      return () => {
        if (!dispatch || index === undefined) return
        dispatch({ type: 'remove', payload: { index } })
      }
    }, [dispatch, index])

    useEffect(() => {
      if (!dispatch || index === undefined || !enabled) return

      dispatch({
        type: 'update',
        payload: {
          state: [
            approvalState,
            <Button
              testdata-id={`${id}-button`}
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
    }, [id, approvalState, disabled, dispatch, enabled, index, onApprove, props, signature])

    if (render) return render({ approvalState, signature, onApprove })
    if (hideIcon) return <></>

    return (
      <Transition
        unmount={false}
        show={!allApproved && masterContract !== AddressZero && initialized}
        enter="transform transition duration-[400ms] delay-[500ms]"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <DefaultButton as="div" {...props}>
          <Tooltip
            mouseEnterDelay={0.3}
            button={
              <div>
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
                      'flex items-center justify-center bg-slate-700 rounded-full overflow-hidden hover:scale-[1.10] transition-all'
                    )}
                    onClick={onApprove}
                  >
                    <div className="bg-white bg-opacity-[0.24] flex items-center justify-center rounded-full w-6 h-6 min-w-6 min-h-6 ">
                      <BentoboxIcon width={14} height={14} />
                    </div>
                  </IconButton>
                </Badge>
              </div>
            }
            panel={
              <div className="flex flex-col gap-3 max-w-[200px]">
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
                  We need your approval first to access your wallet using BentoBox; you will only have to approve this
                  master contract once.
                </Typography>
                <Typography variant="xs" weight={500} className="flex flex-col gap-1 text-slate-400">
                  <span className="text-slate-200">Why should I approve this?</span>
                  <span>
                    BentoBox is a token vault that provides its users with passive income on their deposits from yield
                    strategies while reducing gas costs.
                  </span>
                </Typography>
              </div>
            }
          />
        </DefaultButton>
      </Transition>
    )
  }
)
