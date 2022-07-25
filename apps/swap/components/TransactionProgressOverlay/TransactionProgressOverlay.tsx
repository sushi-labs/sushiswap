import { Amount, Token, Type } from '@sushiswap/currency'
import { STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { classNames, Dialog, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { TransactionProgressStepper } from './TransactionProgressStepper'

interface TransactionProgressOverlay {
  onClose(): void
  id: string
  srcTxHash: string
  inputAmount?: Amount<Type>
  outputAmount?: Amount<Type>
  srcBridgeToken: Token
  dstBridgeToken: Token
  crossChain: boolean
}

export const TransactionProgressOverlay: FC<TransactionProgressOverlay> = ({
  onClose,
  id,
  srcTxHash,
  inputAmount,
  outputAmount,
  srcBridgeToken,
  dstBridgeToken,
  crossChain,
}) => {
  return (
    <>
      <Dialog.Header title="Transaction In Progress" onClose={onClose} />
      <div className="flex flex-col gap-8 flex-grow">
        <div className={classNames('flex justify-center items-center flex-grow', crossChain ? 'pt-6' : 'pt-3')}>
          <TransactionProgressStepper
            id={id}
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            srcBridgeToken={srcBridgeToken}
            dstBridgeToken={dstBridgeToken}
            srcTxHash={srcTxHash}
            crossChain={crossChain}
          />
        </div>
        {crossChain && (
          <Typography variant="xs" className="text-slate-500 text-center">
            This usually takes{' '}
            <span className="font-medium text-slate-200">
              ~
              {Math.ceil(
                STARGATE_CONFIRMATION_SECONDS[
                  inputAmount?.currency.chainId as keyof typeof STARGATE_CONFIRMATION_SECONDS
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
