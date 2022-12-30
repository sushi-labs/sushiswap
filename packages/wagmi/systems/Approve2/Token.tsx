import {
  Badge,
  Button,
  classNames,
  Currency as CurrencyFromUi,
  IconButton,
  Loader,
  Tooltip,
  Typography,
} from '@sushiswap/ui'
import { useMemo } from 'react'

import { ApprovalState, useERC20ApproveCallback } from '../../hooks'
import { DefaultButton } from '../Approve/DefaultButton'
import { ApprovalTypeToken, ApproveButtonReturnType } from './types'

interface ApproveButtonTokenReturn extends ApproveButtonReturnType {
  approvalState: ApprovalState
}

export type ApproveTokenFn = (params: ApprovalTypeToken) => ApproveButtonTokenReturn

export const Token: ApproveTokenFn = ({
  index,
  onSuccess,
  address,
  amount,
  enabled = true,
  buttonProps: { id, className, variant, size, fullWidth = true },
}) => {
  const [approvalState, onApprove] = useERC20ApproveCallback(
    enabled && Boolean(!!amount && !!address),
    amount,
    address,
    onSuccess
  )

  return useMemo(() => {
    return {
      approvalState,
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
                          approvalState === ApprovalState.PENDING
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
                      'flex items-center justify-center hover:scale-[1.10] transition-all'
                    )}
                    onClick={onApprove}
                  >
                    {amount && <CurrencyFromUi.Icon disableLink currency={amount?.currency} width={24} height={24} />}
                  </IconButton>
                </Badge>
              </div>
            }
            panel={
              <div className="flex flex-col gap-2 max-w-[200px]">
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
      ),
      button: (
        <Button
          key={index}
          loading={[ApprovalState.LOADING, ApprovalState.PENDING].includes(approvalState)}
          testdata-id={id}
          variant={variant}
          size={size}
          className={className}
          fullWidth={fullWidth}
          onClick={onApprove}
        >
          Approve {amount?.currency.symbol}
        </Button>
      ),
    }
  }, [amount, approvalState, className, fullWidth, id, index, onApprove, size, variant])
}
