import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { ChainId } from '@sushiswap/core-sdk'
import { SUSHIGUARD_RELAY } from 'app/config/sushiguard'
import { PrivateTxState, PrivateTxStatus } from 'app/entities/SushiGuard'
import { fetchJsonRpc } from 'app/lib/jsonrpc'
import { retry, RetryableError, RetryOptions } from 'functions/retry'
import useBlockNumber, { useFastForwardBlockNumber } from 'lib/hooks/useBlockNumber'
import ms from 'ms.macro'
import { useCallback, useEffect } from 'react'
import { useActiveWeb3React } from 'services/web3'

interface Transaction {
  addedTime: number
  receipt?: unknown
  lastCheckedBlockNumber?: number
  privateTx?: any
}

export function shouldCheckTx(lastBlockNumber: number, tx: Transaction): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / ms`1m`
  if (minutesPending > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

export function shouldCheckPrivateTx(lastBlockNumber: number, tx: Transaction): boolean {
  if (!tx.privateTx) throw new Error('Invalid check for a non private tx')

  const { state } = tx.privateTx
  if (
    (state === PrivateTxState.OK && tx.receipt) ||
    state === PrivateTxState.INDETERMINATE ||
    state === PrivateTxState.ERROR
  )
    return false

  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / ms`1m`
  if (minutesPending > 15) {
    // every 3 blocks if pending for longer than 15 minutes
    return blocksSinceCheck > 3
  } else if (minutesPending > 10) {
    // every 3 blocks if pending more than 15 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {
  [ChainId.HARMONY]: { n: 10, minWait: 250, maxWait: 1000 },
  [ChainId.ARBITRUM]: { n: 10, minWait: 250, maxWait: 1000 },
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 }

interface UpdaterProps {
  pendingTransactions: { [hash: string]: Transaction }
  onCheck: (tx: { chainId: number; hash: string; blockNumber: number }) => void
  onPrivateTxStatusCheck: (tx: { chainId: number; hash: string; blockNumber: number; status: PrivateTxStatus }) => void
  onReceipt: (tx: { chainId: number; hash: string; receipt: TransactionReceipt }) => void
}

export default function Updater({
  pendingTransactions,
  onCheck,
  onReceipt,
  onPrivateTxStatusCheck,
}: UpdaterProps): null {
  const { chainId, library } = useActiveWeb3React()

  const lastBlockNumber = useBlockNumber()
  const fastForwardBlockNumber = useFastForwardBlockNumber()

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library || !chainId) throw new Error('No library or chainId')
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS
      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt) => {
            if (receipt === null) {
              console.debug(`Retrying tranasaction receipt for ${hash}`)
              throw new RetryableError()
            }
            return receipt
          }),
        retryOptions
      )
    },
    [chainId, library]
  )

  const getPrivateTxStatus = useCallback(
    (hash: string) => {
      if (!chainId) throw new Error('No chainId')
      if (!SUSHIGUARD_RELAY[chainId as ChainId])
        throw new Error('SushiGuard is not available for the selected network.')
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS
      return retry(
        () =>
          fetchJsonRpc<PrivateTxStatus>(SUSHIGUARD_RELAY[chainId as ChainId] ?? '', {
            method: 'manifold_transactionStatus',
            params: [hash],
          }),
        retryOptions
      )
    },
    [chainId]
  )

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) => shouldCheckTx(lastBlockNumber, pendingTransactions[hash]))
      .map((hash) => {
        const isPrivateTx = pendingTransactions[hash].privateTx ?? false

        if (!isPrivateTx) {
          const { promise, cancel } = getReceipt(hash)
          promise
            .then((receipt) => {
              if (receipt) {
                onReceipt({ chainId, hash, receipt })
              } else {
                onCheck({ chainId, hash, blockNumber: lastBlockNumber })
              }
            })
            .catch((error) => {
              if (!error.isCancelledError) {
                console.warn(`Failed to get transaction receipt for ${hash}`, error)
              }
            })
          return cancel
        }

        // tx is private
        const { promise, cancel } = getPrivateTxStatus(hash)
        promise
          .then((status) => {
            if (status.result) {
              const txStatus = status.result as PrivateTxStatus
              onPrivateTxStatusCheck({
                chainId,
                hash,
                blockNumber: lastBlockNumber,
                status: txStatus,
              })

              // obtain tx receipt if everything went well
              if (txStatus.minedAt)
                library.getTransactionReceipt(hash).then((receipt) => {
                  // there's a chance tx receipt is not yet available whenever we receive a valid minedAt event
                  // shouldCheckPrivateTx will take care of ensuring that receipt should be present
                  // so it will be retried until this call is succesful
                  if (receipt) onReceipt({ chainId, hash, receipt })
                })
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) console.warn(`Failed to get private tx status for ${hash}`, error)
          })
        return cancel
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [
    chainId,
    library,
    lastBlockNumber,
    getReceipt,
    getPrivateTxStatus,
    fastForwardBlockNumber,
    onReceipt,
    onPrivateTxStatusCheck,
    onCheck,
    pendingTransactions,
  ])

  return null
}
