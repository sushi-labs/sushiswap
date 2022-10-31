import { createClient } from '@layerzerolabs/scan-client'
import chains from '@sushiswap/chain'
import { STARGATE_CHAIN_ID, STARGATE_TOKEN } from '@sushiswap/stargate'
import { Link, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useAccount, useContractEvent, useWaitForTransaction } from 'wagmi'

import { useNotifications } from '../../lib/state/storage'
import { useBridgeState, useDerivedBridgeState } from '../BridgeStateProvider'
import { TransactionProgressStep } from './TransactionProgressStep'

const client = createClient('mainnet')

interface TransactionProgressBridgeStargate {
  isPrevLoading: boolean
  isPrevError: boolean
  isPrevSuccess: boolean
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

export const TransactionProgressBridgeStargate: FC<TransactionProgressBridgeStargate> = ({
  isPrevLoading,
  isPrevError,
  isPrevSuccess,
  children,
}) => {
  const { address } = useAccount()
  const { srcChainId, dstChainId, srcToken, amount, sourceTx, timestamp, id } = useBridgeState()
  const { dstAmountOut } = useDerivedBridgeState()
  const [dstTxState, setDstTxState] = useState<{ txHash: `0x${string}`; isSuccess: boolean } | undefined>()
  const [, { createInfoNotification }] = useNotifications(address)
  const [lzLink, setLzLink] = useState<string>()

  useContractEvent({
    ...getSushiXSwapContractConfig(dstAmountOut?.currency.chainId),
    chainId: dstAmountOut?.currency.chainId,
    eventName: 'StargateSushiXSwapDst',
    listener: (event) => {
      const [context, success, { transactionHash }] = event
      if (context === formatBytes32String(id)) {
        setDstTxState({
          txHash: transactionHash,
          isSuccess: !success,
        })
      }
    },
  })

  const { isError, isSuccess } = useWaitForTransaction({
    hash: dstTxState?.txHash,
    chainId: dstChainId,
    enabled: Boolean(dstTxState?.txHash) && Boolean(amount),
  })

  useEffect(() => {
    if (isPrevSuccess && sourceTx?.hash && timestamp) {
      let notificationSent = false

      const ts = new Date().getTime()

      const getMessages = () => {
        if (lzLink && !notificationSent) {
          notificationSent = true
          createInfoNotification({
            type: 'stargate',
            chainId: srcChainId,
            txHash: '',
            href: lzLink,
            summary: {
              pending: '',
              completed: '',
              failed: '',
              info: `Bridging ${amount?.toSignificant(6)} ${srcToken?.symbol} to ${chains[dstChainId].name}`,
            },
            timestamp: ts,
            groupTimestamp: timestamp,
          })
        }

        client.getMessagesBySrcTxHash(sourceTx.hash).then((result) => {
          if (result.messages.length > 0 && !lzLink) {
            const { srcUaAddress, dstUaAddress, srcUaNonce } = result.messages[0]
            setLzLink(
              `https://layerzeroscan.com/${STARGATE_CHAIN_ID[srcChainId]}/address/${srcUaAddress}/message/${STARGATE_CHAIN_ID[dstChainId]}/address/${dstUaAddress}/nonce/${srcUaNonce}`
            )
          } else {
            setTimeout(getMessages, 1000)
          }
        })
      }

      getMessages()
    }
  }, [
    amount,
    createInfoNotification,
    dstChainId,
    isPrevSuccess,
    lzLink,
    sourceTx,
    srcChainId,
    srcToken?.symbol,
    timestamp,
  ])

  return (
    <>
      <TransactionProgressStep
        link={lzLink}
        status={isSuccess ? 'success' : isError ? 'skipped' : lzLink ? 'pending' : 'idle'}
        header={
          <TransactionProgressStep.Header>
            Send <b>{srcToken?.symbol}</b> to destination chain
          </TransactionProgressStep.Header>
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<Icon currency={STARGATE_TOKEN} width={16} height={16} />}
            caption={
              <Typography variant="xs">
                Powered by{' '}
                <Link.External href="https://stargate.finance" className="underline">
                  Stargate Finance
                </Link.External>
              </Typography>
            }
          />
        }
      />
      {children({
        isPrevSuccess: isPrevSuccess && isSuccess,
        isPrevError: isPrevError || isError,
        isPrevLoading: isPrevLoading || !!lzLink,
      })}
    </>
  )
}
