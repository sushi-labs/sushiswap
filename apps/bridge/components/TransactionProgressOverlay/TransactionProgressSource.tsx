import chain, { chains } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'
import { useWaitForTransaction } from 'wagmi'

import { useBridgeState } from '../BridgeStateProvider'
import { TransactionProgressStep } from './TransactionProgressStep'

interface TransactionProgressSource {
  children({
    isPrevSuccess,
    isPrevError,
    isPrevLoading,
  }: {
    isPrevSuccess: boolean
    isPrevError: boolean
    isPrevLoading: boolean
  }): ReactNode
}
export const TransactionProgressSource: FC<TransactionProgressSource> = ({ children }) => {
  const { amount, srcChainId, srcToken, sourceTx } = useBridgeState()
  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: sourceTx?.hash,
    chainId: srcChainId,
    enabled: Boolean(sourceTx?.hash) && Boolean(amount),
  })

  if (!amount || !sourceTx?.hash) return <></>

  return (
    <>
      <TransactionProgressStep
        link={chains[amount.currency.chainId].getTxUrl(sourceTx.hash)}
        status={isSuccess ? 'success' : isError ? 'failed' : isLoading ? 'pending' : 'idle'}
        header={
          srcToken && amount.currency.wrapped.equals(srcToken) ? (
            <TransactionProgressStep.Header>
              Transfer{' '}
              <b>
                {amount.toSignificant(6)} {amount.currency.symbol}
              </b>{' '}
              to Stargate Router
            </TransactionProgressStep.Header>
          ) : (
            <TransactionProgressStep.Header>
              Swapping{' '}
              <b>
                {amount.toSignificant(6)} {amount.currency.symbol}
              </b>{' '}
              for <b>{srcToken?.symbol}</b>
            </TransactionProgressStep.Header>
          )
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<NetworkIcon chainId={amount.currency.chainId} width={16} height={16} />}
            caption={chain[amount.currency.chainId].name}
          />
        }
      />
      {children({ isPrevError: isError, isPrevLoading: isLoading, isPrevSuccess: isSuccess })}
    </>
  )
}
