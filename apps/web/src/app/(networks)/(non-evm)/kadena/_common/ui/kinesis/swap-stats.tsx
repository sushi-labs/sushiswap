'use client'

import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { Collapsible, IconButton, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import {
  Amount,
  ChainId,
  formatPercent,
  formatUSD,
  truncateString,
} from 'sushi'
import { EvmNative, getEvmChainById, shortenEvmAddress } from 'sushi/evm'
import { getKvmChainById } from 'sushi/kvm'
import { isAddress } from 'viem'
import { useAccount, useDisconnect } from 'wagmi'
import { KADENA } from '~kadena/_common/constants/token-list'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const SwapStats: FC = () => {
  const {
    state: {
      isLoadingSimulateBridgeTx: isLoading,
      simulateBridgeTx,
      simulateBridgeError,
      chainId0,
      chainId1,
      swapAmountString,
      recipient,
      token1,
    },
  } = useDerivedStateCrossChainSwap()
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )
  const { isConnected: isEvmConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { isConnected: isKvmConnected } = useKadena()
  const isConnected = isEvmConnected && isKvmConnected

  const isAllowanceError = useMemo(() => {
    if (
      simulateBridgeError?.message.includes('transfer amount exceeds allowance')
    ) {
      return true
    }
    return false
  }, [simulateBridgeError])

  const amountOut = useMemo(() => {
    const stringAmount = isAllowanceError
      ? swapAmountString
      : (simulateBridgeTx?.estimatedAmountReceived ?? '')
    if (token1) {
      return Amount.tryFromHuman(token1, stringAmount)
    }
  }, [simulateBridgeTx, swapAmountString, isAllowanceError, token1])

  const minAmountOut = useMemo(() => {
    const stringAmount = simulateBridgeTx?.amountMinReceived ?? ''
    if (stringAmount && token1) {
      return Amount.tryFromHuman(token1, stringAmount)
    } else if (token1) {
      const totalAmount = isAllowanceError
        ? swapAmountString
        : (simulateBridgeTx?.estimatedAmountReceived ?? '')
      const slippageAmount = Amount.tryFromHuman(token1, totalAmount)?.mulHuman(
        slippageTolerance.toNumber(),
      )
      return Amount.tryFromHuman(token1, totalAmount)?.subHuman(
        slippageAmount?.toString() ?? '0',
      )
    }
  }, [
    simulateBridgeTx,
    swapAmountString,
    isAllowanceError,
    token1,
    slippageTolerance,
  ])

  const feeInToken = useMemo(() => {
    if (simulateBridgeTx?.networkFeeInToken && chainId0 === ChainId.ETHEREUM) {
      return Amount.tryFromHuman(
        EvmNative.fromChainId(ChainId.ETHEREUM),
        simulateBridgeTx?.networkFeeInToken,
      )
    }
    if (simulateBridgeTx?.networkFeeInToken && chainId0 === ChainId.KADENA) {
      return Amount.tryFromHuman(KADENA, simulateBridgeTx?.networkFeeInToken)
    }
  }, [simulateBridgeTx, chainId0])

  return (
    <Collapsible
      open={
        +swapAmountString > 0 &&
        (!simulateBridgeError || isAllowanceError) &&
        isConnected
      }
    >
      <div className="pt-4 w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {isLoading ? (
              <SkeletonBox className="h-4 py-0.5 w-[40px]" />
            ) : (
              formatPercent(0)
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !amountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px]" />
            ) : (
              `${amountOut?.toSignificant(6) ?? '0.00'} ${amountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading || !minAmountOut ? (
              <SkeletonBox className="h-4 py-0.5 w-[100px]" />
            ) : (
              `${minAmountOut?.toSignificant(6) ?? '0.00'} ${minAmountOut?.currency?.symbol ?? ''}`
            )}
          </span>
        </div>
        {/* this will look like they are loading if there is an allowance err in the sim call */}
        {simulateBridgeTx || isLoading ? (
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Fee
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !simulateBridgeTx?.bridgeFeeInUsd ? (
                <SkeletonBox className="h-4 py-0.5 w-[100px]" />
              ) : (
                `${formatUSD(simulateBridgeTx?.bridgeFeeInUsd)}`
              )}
            </span>
          </div>
        ) : null}
        {/* this will look like they are loading if there is an allowance err in the sim call */}
        {simulateBridgeTx || isLoading ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Network fee
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !feeInToken ? (
                <SkeletonBox className="h-4 py-0.5 w-[120px]" />
              ) : (
                `${feeInToken?.toSignificant(6) ?? '0.00'} ${feeInToken?.currency?.symbol ?? ''}`
              )}
            </span>
          </div>
        ) : null}

        {recipient && (
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
            <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
              Recipient
            </span>
            <div className="font-semibold flex items-center gap-1 text-gray-700 text-right dark:text-slate-400">
              {chainId1 === ChainId.ETHEREUM && isAddress(recipient) ? (
                // currently only way to edit evm wallet
                <IconButton
                  onClick={async () => await disconnectAsync()}
                  icon={ArrowLeftOnRectangleIcon}
                  name={'edit evm recipient'}
                  variant="ghost"
                  size="xs"
                />
              ) : null}
              <a
                target="_blank"
                href={
                  chainId1 === ChainId.ETHEREUM && isAddress(recipient)
                    ? getEvmChainById(chainId1).getAccountUrl(recipient)
                    : chainId1 === ChainId.KADENA
                      ? getKvmChainById(chainId1).getAccountUrl(recipient)
                      : ''
                }
                className={classNames(
                  'text-gray-700 dark:text-slate-300',
                  'transition-all flex gap-1 items-center',
                )}
                rel="noreferrer"
              >
                {isAddress(recipient) ? (
                  <AddressToEnsResolver address={recipient}>
                    {({ isLoading, data }) => {
                      return (
                        <>
                          {isLoading || !data
                            ? shortenEvmAddress(recipient)
                            : data}
                        </>
                      )
                    }}
                  </AddressToEnsResolver>
                ) : (
                  <>{truncateString(recipient, 10, 'middle')}</>
                )}
              </a>
            </div>
          </div>
        )}
      </div>
    </Collapsible>
  )
}
