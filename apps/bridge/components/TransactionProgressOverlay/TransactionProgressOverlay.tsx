import { STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useBridgeState } from '../BridgeStateProvider'
import { TransactionProgressStepper } from './TransactionProgressStepper'

interface TransactionProgressOverlay {
  onClose(): void
}

export const TransactionProgressOverlay: FC<TransactionProgressOverlay> = ({ onClose }) => {
  const { amount } = useBridgeState()

  return (
    <>
      <Dialog.Header title="Transaction In Progress" onClose={onClose} />
      <div className="flex flex-col gap-8 flex-grow">
        <div className={classNames('flex justify-center items-center flex-grow pt-6')}>
          <TransactionProgressStepper />
        </div>
        <Typography variant="xs" className="text-slate-500 text-center">
          This usually takes{' '}
          <span className="font-medium text-slate-200">
            ~
            {Math.ceil(
              STARGATE_CONFIRMATION_SECONDS[amount?.currency.chainId as keyof typeof STARGATE_CONFIRMATION_SECONDS] / 60
            )}{' '}
            minutes
          </span>{' '}
          but <br /> sometimes the wait is longer.
        </Typography>
      </div>
    </>
  )
}
