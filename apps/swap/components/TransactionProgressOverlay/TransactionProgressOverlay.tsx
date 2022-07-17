import { STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Dialog, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { UseTradeOutput } from '../../lib/hooks'
import { TransactionProgressStepper } from './TransactionProgressStepper'

interface TransactionProgressOverlay {
  onClose(): void
  id: string
  srcTxHash: string
  srcTrade: UseTradeOutput
  dstTrade?: UseTradeOutput
}

export const TransactionProgressOverlay: FC<TransactionProgressOverlay> = ({
  onClose,
  id,
  srcTxHash,
  srcTrade,
  dstTrade,
}) => {
  if (!srcTrade || !dstTrade) return <></>

  return (
    <>
      <Dialog.Header title="Transaction In Progress" onClose={onClose} />
      <div className="flex flex-col gap-8 flex-grow">
        <div className="flex justify-center items-center flex-grow pt-6">
          <TransactionProgressStepper id={id} srcTrade={srcTrade} dstTrade={dstTrade} srcTxHash={srcTxHash} />
        </div>
        {srcTrade && dstTrade && (
          <Typography variant="xs" className="text-slate-500 text-center">
            This usually takes{' '}
            <span className="font-medium text-slate-200">
              ~
              {Math.ceil(
                STARGATE_CONFIRMATION_SECONDS[
                  srcTrade.inputAmount.currency.chainId as keyof typeof STARGATE_CONFIRMATION_SECONDS
                ] / 60
              )}{' '}
              minutes
            </span>{' '}
            but <br /> sometimes the wait is longer.
          </Typography>
        )}
      </div>
    </>
  )
}
