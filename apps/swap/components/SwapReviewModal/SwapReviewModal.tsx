import { Signature } from '@ethersproject/bytes'
import { ChainId } from '@sushiswap/chain'
import { Button, Dots } from '@sushiswap/ui'
import { BENTOBOX_ADDRESS, getTridentRouterContractConfig } from '@sushiswap/wagmi'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApprovalTypeBentobox, ApprovalTypeToken, ToDef } from '@sushiswap/wagmi/systems/Approve2/types'
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

  const definition = useMemo(() => {
    const definition: Array<ToDef<ApprovalTypeBentobox> | ToDef<ApprovalTypeToken>> = []
    if (trade?.isV2()) {
      definition.push({
        type: ApprovalType.Bentobox,
        masterContract: getTridentRouterContractConfig(chainId).addressOrName,
        buttonProps: {
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'swap-review-approve-button',
        },
      })
    }

    definition.push({
      type: ApprovalType.Token,
      amount: input0,
      address: approveTokenTo,
      buttonProps: {
        className: 'whitespace-nowrap',
        size: 'md',
        id: 'swap-review-approve-button',
      },
    })

    return definition
  }, [approveTokenTo, chainId, input0, trade])

  return (
    <>
      {children({ setOpen })}
      <SwapReviewModalBase chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Approve2.Root chainId={chainId} onSuccess={createNotification} definition={definition}>
          <TradeExecuteProvider chainId={chainId} approved={true} signature={signature} onSuccess={onSwapSuccess}>
            {({ isWritePending, execute }) => {
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
        </Approve2.Root>
      </SwapReviewModalBase>
    </>
  )
}
