import { Signature } from '@ethersproject/bytes'
import { ChainId } from '@sushiswap/chain'
import { Button, Dots } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, getTridentRouterContractConfig } from '@sushiswap/wagmi'
import { TRIDENT_ENABLED_NETWORKS } from 'config'
import { useRouters } from 'lib/hooks/useRouters'
import { useNotifications, useSettings } from 'lib/state/storage'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { TradeExecuteProvider } from '../TradeExecuteProvider'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalLegacy {
  chainId: number | undefined
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
  onSuccess(): void
}

export const SwapReviewModalLegacy: FC<SwapReviewModalLegacy> = ({ chainId, children, onSuccess }) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [sushiSwapRouter, tridentRouter, sushiSwapKlimaRouter] = useRouters(chainId)
  const [{ carbonOffset }] = useSettings()
  const [signature, setSignature] = useState<Signature>()

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount]
  )

  const approveTokenTo = useMemo(() => {
    if (trade?.isV1()) {
      return chainId === ChainId.POLYGON && carbonOffset ? sushiSwapKlimaRouter?.address : sushiSwapRouter?.address
    } else if (trade?.isV2()) {
      return chainId && chainId in BENTOBOX_ADDRESS ? BENTOBOX_ADDRESS[chainId] : undefined
    }
  }, [trade, carbonOffset, sushiSwapKlimaRouter?.address, sushiSwapRouter?.address, chainId])

  const onSwapSuccess = useCallback(() => {
    setSignature(undefined)
    setOpen(false)

    onSuccess()
  }, [onSuccess])

  return (
    <>
      {children({ setOpen })}
      <SwapReviewModalBase chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Bentobox
                id="swap-review-approve-bentobox"
                size="md"
                className="whitespace-nowrap"
                fullWidth
                address={getTridentRouterContractConfig(chainId).addressOrName}
                onSignature={setSignature}
                enabled={Boolean(typeof chainId === 'number' && TRIDENT_ENABLED_NETWORKS.includes(chainId))}
              />
              <Approve.Token
                id="swap-review-approve-token"
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={approveTokenTo}
                enabled={trade?.inputAmount?.currency?.isToken}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <TradeExecuteProvider
                chainId={chainId}
                approved={approved}
                signature={signature}
                onSuccess={onSwapSuccess}
              >
                {({ isWritePending, execute }) => {
                  console.log(approved, execute)
                  return (
                    <Button
                      size="md"
                      testdata-id="swap-review-confirm-button"
                      disabled={isWritePending}
                      fullWidth
                      onClick={() => execute?.()}
                    >
                      {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
                    </Button>
                  )
                }}
              </TradeExecuteProvider>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
