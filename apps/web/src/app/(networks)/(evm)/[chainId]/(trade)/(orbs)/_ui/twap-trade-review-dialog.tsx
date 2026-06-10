'use client'

import {
  Module,
  submitOrder,
  useDerivedOrder,
  useOrderHistoryPanel,
} from '@orbs-network/spot-react'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  FormattedNumber,
  List,
  Switch,
} from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import React, { type FC, type ReactNode, useMemo, useState } from 'react'
import { logger } from 'src/lib/logger'
import { ORBS_EXPLORER_URL } from 'src/lib/swap/twap'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { type EvmAddress, type EvmChainId, getEvmChainById } from 'sushi/evm'
import { numberToHex, parseSignature } from 'viem'
import { useConnection, useSignTypedData } from 'wagmi'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { getTwapOrderTitle, isLimitPriceOrder } from './helper'
import { TwapOrderDetails } from './twap-order-details'

const useSignAndSendMutation = () => {
  const { address } = useConnection()
  const { mutateAsync: signTypedDataAsync } = useSignTypedData()
  const { rePermitData } = useDerivedOrder()
  const { refetchOrders } = useOrderHistoryPanel()
  const {
    state: { chainId },
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap()

  return useMutation({
    mutationFn: async ({
      confirm,
      orderTitle,
    }: {
      confirm?: () => void
      orderTitle?: string
    }) => {
      const { order: rePermitOrder, domain, types, primaryType } = rePermitData
      const signedTimestamp = new Date().getTime()
      const signatureStr = await signTypedDataAsync({
        domain,
        types,
        primaryType,
        message: rePermitOrder as Record<string, any>,
        account: address,
      })

      if (!signatureStr) {
        throw new Error('Failed to sign order')
      }

      void createInfoToast({
        account: address,
        type: 'swap',
        chainId: chainId,
        summary: `Placing ${orderTitle} order`,
        timestamp: signedTimestamp,
        groupTimestamp: signedTimestamp,
      })

      const parsedSignature = parseSignature(signatureStr)
      const order = await submitOrder(rePermitOrder, {
        v: numberToHex(parsedSignature.v || 0),
        r: parsedSignature.r,
        s: parsedSignature.s,
      })
      await refetchOrders()
      const placedTimestamp = new Date().getTime()
      void createSuccessToast({
        account: address,
        type: 'swap',
        chainId: chainId,
        summary: `Placed ${orderTitle} order`,
        timestamp: placedTimestamp,
        groupTimestamp: placedTimestamp,
        href: `${ORBS_EXPLORER_URL}/twap/order/${order.id}`,
      })
      confirm?.()
      setSwapAmount('')
    },
    onError: (e) => {
      if (isUserRejectedError(e)) {
        return
      }
      logger.error(e, {
        location: 'TwapTradeReviewDialog',
      })
      createErrorToast(
        e instanceof Error ? e.message : 'Something went wrong',
        false,
      )
    },
  })
}

export const TwapTradeReviewDialog: FC<{
  children: ReactNode
  module: Module
}> = ({ children, module }) => {
  const {
    state: { token0, chainId, swapAmount },
  } = useDerivedStateSimpleSwap()

  const [acceptDisclaimer, setAcceptDisclaimer] = useState(true)

  const { mutate: signAndSendOrder, isPending: isSignAndSendPending } =
    useSignAndSendMutation()
  const order = useDerivedOrder()
  const isLimitPrice = isLimitPriceOrder(order.orderType)
  const orderTitle = useMemo(
    () => getTwapOrderTitle(order.orderType),
    [order.orderType],
  )

  const isDca = module === Module.TWAP

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent className="max-h-[80vh]">
              <DialogHeader className="!text-left">
                <DialogTitle>
                  Sell {swapAmount?.toSignificant(6)} {token0?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {isLimitPrice && (
                    <>
                      Receive at least{' '}
                      <FormattedNumber number={order.minDestAmountPerTradeUI} />{' '}
                      {order.dstToken?.symbol}{' '}
                      {order.totalTrades > 1 ? 'per trade' : ''}
                    </>
                  )}
                  <TwapOrderDetails.DcaChunksRow
                    orderType={order.orderType}
                    fillDelay={order.tradeInterval}
                    totalTrades={order.totalTrades}
                  />
                </DialogDescription>
              </DialogHeader>
              {/* 176px is sum of header, footer, padding, and gap */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)]">
                <List className="!pt-0">
                  <List.Control>
                    <div className="flex flex-col gap-3 p-2">
                      <List.KeyValue title="Network" className="!p-0">
                        {getEvmChainById(chainId as EvmChainId).name}
                      </List.KeyValue>
                      {isDca && (
                        <TwapOrderDetails.SellTotal
                          inputAmount={order.srcAmountUI}
                          inputSymbol={order.srcToken?.symbol}
                        />
                      )}
                      <TwapOrderDetails.LimitPrice
                        limitPrice={order.limitPriceUI}
                        token0PriceUSD={order.limitPriceUsd}
                        fromSymbol={order.srcToken?.symbol}
                        toSymbol={order.dstToken?.symbol}
                      />
                      <TwapOrderDetails.TriggerPrice
                        triggerPrice={order.triggerPriceUI}
                        fromToken={order.srcToken}
                        toToken={order.dstToken}
                        token0PriceUSD={order.triggerPriceUsd}
                      />

                      {isDca && (
                        <>
                          <TwapOrderDetails.NumberOfOrders
                            totalChunks={order.totalTrades}
                          />
                          <TwapOrderDetails.SellPerOrder
                            amountInPerChunk={order.sizePerTradeUI}
                            inputSymbol={order.srcToken?.symbol}
                          />

                          <TwapOrderDetails.TradeInterval
                            fillDelay={order.tradeInterval}
                          />
                          <TwapOrderDetails.StartDate
                            startDate={order.createdAt}
                          />
                        </>
                      )}

                      <TwapOrderDetails.EndDate endDate={order.deadline} />

                      <TwapOrderDetails.Recipient
                        recipient={order.recipient as EvmAddress}
                        chainId={chainId}
                      />
                    </div>
                  </List.Control>
                  <List.Control>
                    <List.KeyValue
                      title={
                        <span>
                          Accept{' '}
                          <a
                            href="https://www.orbs.com/dtwap-dlimit-disclaimer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-b border-muted-foreground"
                          >
                            Disclaimer
                          </a>
                        </span>
                      }
                    >
                      <Switch
                        checked={acceptDisclaimer}
                        onCheckedChange={setAcceptDisclaimer}
                      />
                    </List.KeyValue>
                  </List.Control>
                </List>
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  loading={isSignAndSendPending}
                  size="xl"
                  onClick={() => signAndSendOrder({ confirm, orderTitle })}
                  color="blue"
                  testId="confirm-swap"
                >
                  Place Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={'success'}
        testId="place-another-order"
        buttonText="Place another order"
        txHash={undefined}
        successMessage={`Your ${orderTitle} order was placed`}
      />
    </DialogProvider>
  )
}
