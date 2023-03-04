import { Signature } from '@ethersproject/bytes'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { Button, Dialog, Dots } from '@sushiswap/ui'
import { getTridentRouterContractConfig } from '@sushiswap/wagmi'
import { Approve2 } from '@sushiswap/wagmi/systems/Approve2'
import { ApprovalType, ApproveDefinition } from '@sushiswap/wagmi/systems/Approve2/types'
import { useRouters } from '../../lib/hooks/useRouters'
import { useNotifications, useSettings } from '../../lib/state/storage'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Address, useAccount } from 'wagmi'

import { TradeExecuteProvider } from '../TradeExecuteProvider'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'
import Image from 'next/legacy/image'
import { XIcon } from '@heroicons/react/solid'

interface SwapReviewModalLegacy {
  chainId: number | undefined
  children({ setOpen }: { setOpen(open: boolean): void }): ReactNode
  onSuccess(): void
}

const BANNER_URLS = [
  'https://cdn.sushi.com/image/upload/v1676366659/Valentine_s_4.jpg',
  'https://cdn.sushi.com/image/upload/v1676366659/Valentine_s_5.jpg',
  'https://cdn.sushi.com/image/upload/v1676366658/Valentine_s_7.jpg',
  'https://cdn.sushi.com/image/upload/v1676366659/Valentine_s23_3.jpg',
  'https://cdn.sushi.com/image/upload/v1676366658/Valentine_s_9.jpg',
  'https://cdn.sushi.com/image/upload/v1676366658/Valentine_s23_2.jpg',
  'https://cdn.sushi.com/image/upload/v1676366659/Valentine_s_6.jpg',
  'https://cdn.sushi.com/image/upload/v1676366658/Valentine_s_8.jpg',
]

export const SwapReviewModalLegacy: FC<SwapReviewModalLegacy> = ({ chainId, children, onSuccess }) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [sushiSwapRouter, tridentRouter, sushiSwapKlimaRouter] = useRouters(chainId)
  const [{ carbonOffset }] = useSettings()
  const [signature, setSignature] = useState<Signature>()
  const [card, setCard] = useState(false)
  const [bannerIndex] = useState(Math.floor(Math.random() * 8))
  const showAd = new Date().getDate() === 14

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount]
  )

  const approveTokenTo = useMemo(() => {
    if (trade?.isV1()) {
      return chainId === ChainId.POLYGON && carbonOffset
        ? (sushiSwapKlimaRouter?.address as Address)
        : (sushiSwapRouter?.address as Address)
    } else if (trade?.isV2()) {
      return chainId && chainId in BENTOBOX_ADDRESS ? BENTOBOX_ADDRESS[chainId] : undefined
    }
  }, [trade, carbonOffset, sushiSwapKlimaRouter?.address, sushiSwapRouter?.address, chainId])

  const onSwapSuccess = useCallback(() => {
    setSignature(undefined)
    setCard(true)

    setTimeout(() => {
      setOpen(false)
    }, 500)

    if (!showAd) {
      onSuccess()
    }
  }, [onSuccess, showAd])

  const onCloseCard = useCallback(() => {
    onSuccess()
  }, [onSuccess])

  const definition = useMemo(() => {
    const definition: ApproveDefinition = []
    if (trade?.isV2()) {
      definition.push({
        type: ApprovalType.Bentobox,
        masterContract: getTridentRouterContractConfig(chainId).address,
        buttonProps: {
          className: 'whitespace-nowrap',
          size: 'md',
          id: 'swap-review-approve-bentobox-button',
        },
        onSignature: setSignature,
      })
    }

    definition.push({
      type: ApprovalType.Token,
      amount: input0,
      address: approveTokenTo,
      buttonProps: {
        className: 'whitespace-nowrap',
        size: 'md',
        id: 'swap-review-approve-token-button',
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
              console.log('sendTransaction function to exec', {
                sendTrasaction: execute,
              })
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

      <Dialog open={showAd && card} onClose={onCloseCard}>
        <div className="relative">
          <div
            role="button"
            onClick={onCloseCard}
            className=" absolute right-[-12px] top-[-12px] z-10 bg-slate-700 p-2 rounded-full flex items-center justify-center hover:bg-slate-600 cursor-pointer"
          >
            <XIcon width={20} height={20} />
          </div>
          <div className="overflow-hidden rounded-[24px] border-[12px] border-slate-800">
            <Image
              src={BANNER_URLS[bannerIndex]}
              alt="valentines-card"
              width={1024}
              height={1024}
              layout="responsive"
              quality={100}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}
