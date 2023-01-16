import { Signature } from '@ethersproject/bytes'
import { Badge, BentoboxIcon, Button, classNames, IconButton, Loader, Tooltip, Typography } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'

import { ApprovalState, useBentoBoxApproveCallback } from '../../hooks'
import { DefaultButton } from '../Approve/DefaultButton'
import { ApprovalTypeBentobox, ApproveButtonReturnType } from './types'

interface ApproveButtonBentoboxFnReturn extends ApproveButtonReturnType {
  approvalState: ApprovalState
  signature: Signature | undefined
}

export type ApproveBentoboxFn = (params: ApprovalTypeBentobox) => ApproveButtonBentoboxFnReturn

export const Bentobox: ApproveBentoboxFn = ({
  index,
  chainId,
  onSuccess,
  masterContract,
  enabled = true,
  onSignature,
  buttonProps: { id, className, variant, size, fullWidth = true },
}) => {
  const [_state, _setState] = useState<Signature>()
  const [approvalState, signature, onApprove] = useBentoBoxApproveCallback({
    chainId,
    masterContract,
    enabled: enabled && Boolean(!!masterContract && !!chainId),
    onSuccess,
  })

  useEffect(() => {
    if (signature) {
      onSignature(signature)
      _setState(signature)
    }
  }, [onSignature, signature])

  return useMemo(() => {
    return {
      approvalState: approvalState === ApprovalState.PENDING && _state ? ApprovalState.APPROVED : approvalState,
      signature,
      iconButton: (
        <DefaultButton key={index}>
          <Tooltip
            mouseEnterDelay={0.3}
            button={
              <div>
                <Badge
                  badgeContent={
                    approvalState === ApprovalState.LOADING ? (
                      <Loader size={8} />
                    ) : (
                      <div
                        className={classNames(
                          approvalState === ApprovalState.PENDING && signature
                            ? 'bg-green'
                            : approvalState === ApprovalState.PENDING
                            ? 'bg-yellow'
                            : approvalState === ApprovalState.APPROVED
                            ? 'bg-green'
                            : 'bg-red',
                          'w-2 h-2 rounded-full shadow-md'
                        )}
                      />
                    )
                  }
                >
                  <IconButton
                    as="div"
                    className={classNames(
                      approvalState === ApprovalState.PENDING ? 'pointer-events-none saturate-[0]' : '',
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
                      approvalState === ApprovalState.PENDING && signature
                        ? 'text-green'
                        : approvalState === ApprovalState.PENDING
                        ? 'text-yellow'
                        : approvalState === ApprovalState.APPROVED
                        ? 'text-green'
                        : 'text-red'
                    )}
                  >
                    {approvalState === ApprovalState.PENDING && signature
                      ? 'Approved'
                      : approvalState.toLowerCase().replace('_', ' ')}
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
      ),
      button: (
        <Button
          key={index}
          loading={approvalState === ApprovalState.LOADING}
          testdata-id={id}
          variant={variant}
          size={size}
          className={className}
          fullWidth={fullWidth}
          onClick={onApprove}
        >
          Approve Bentobox
        </Button>
      ),
    }
  }, [_state, approvalState, className, fullWidth, id, index, onApprove, signature, size, variant])
}
