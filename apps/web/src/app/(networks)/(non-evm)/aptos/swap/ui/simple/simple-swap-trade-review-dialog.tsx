'use client'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  Dots,
  List,
  classNames,
} from '@sushiswap/ui'
import React, { FC, ReactNode } from 'react'
import { DEFAULT_SLIPPAGE } from 'sushi/config'
import { networkNameToNetwork } from '~aptos/_common/config/chains'
import { AptosSDK } from '~aptos/_common/lib/common/aptos-sdk'
import { formatNumberWithDecimals } from '~aptos/_common/lib/common/format-number-with-decimals'
import { useNetwork } from '~aptos/_common/lib/common/use-network'
import { createToast } from '~aptos/_common/ui/toast'
import { getSwapPayload } from '~aptos/swap/lib/get-swap-payload'
import { useSwap } from '~aptos/swap/lib/use-swap'
import { useSwapNetworkFee } from '~aptos/swap/lib/use-swap-network-fee'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~aptos/swap/lib/warning-severity'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~aptos/swap/ui/simple/simple-swap-provider/simple-swap-provider'

export const SimpleSwapTradeReviewDialog: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    bestRoutes,
    token0,
    token1,
    slippageAmount,
    amount,
    outputAmount,
    isPriceFetching,
    isTransactionPending,
  } = useSimpleSwapState()
  const { account, signAndSubmitTransaction } = useWallet()
  const { setisTransactionPending, setAmount } = useSimpleSwapActions()
  const { data: networkFee } = useSwapNetworkFee()
  const { data: routes } = useSwap()

  const minOutput = slippageAmount
    ? formatNumberWithDecimals(slippageAmount, token1 ? token1.decimals : 8)
    : 0

  const {
    network,
    contracts: { swap: swapContract },
  } = useNetwork()

  const swapToken = async (confirm: () => void) => {
    const aptos = AptosSDK.onNetwork(networkNameToNetwork(network))
    const payload = getSwapPayload(
      swapContract,
      parseInt(
        (parseFloat(String(amount)) *
          10 ** token0.decimals) as unknown as string,
      ),
      bestRoutes,
      parseInt(String(slippageAmount)),
    )

    if (!account?.address) return []
    setisTransactionPending(true)
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload)
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash })

      //return from here if response is failed
      if (!response?.output.success) return
      const toastId = `completed:${response?.hash}`
      createToast({
        summery: `Swap ${amount} ${token0.symbol} for ${parseFloat(
          (parseInt(outputAmount) / 10 ** token1?.decimals).toFixed(9),
        )} ${token1.symbol}`,
        toastId: toastId,
      })
      confirm()
      setAmount('')
    } catch (_e) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: 'User rejected request', toastId: toastId })
    } finally {
      setisTransactionPending(false)
    }
  }
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="mt-4">{children}</div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Buy{' '}
                  {formatNumberWithDecimals(
                    Number(outputAmount),
                    token1.decimals,
                  )}{' '}
                  {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {/* {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'}{' '} */}
                  Sell {amount} {token0?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">Aptos</List.KeyValue>
                    <List.KeyValue
                      title="Price impact"
                      subtitle="The impact your trade has on the market price of this pool."
                    >
                      <span
                        className={classNames(
                          warningSeverityClassName(
                            warningSeverity(routes?.priceImpact),
                          ),
                          'text-gray-700 text-right dark:text-slate-400 ',
                        )}
                      >
                        <>
                          {routes?.priceImpact
                            ? (-routes?.priceImpact).toFixed(2)
                            : 0}
                          %
                        </>
                      </span>
                    </List.KeyValue>
                    <List.KeyValue
                      title={`Min. received after slippage (${
                        slippageTolerance === 'AUTO'
                          ? DEFAULT_SLIPPAGE
                          : slippageTolerance
                      }%)`}
                      subtitle="The minimum amount you are guaranteed to receive."
                    >
                      <>
                        {minOutput} {token1?.symbol}
                      </>
                    </List.KeyValue>

                    <List.KeyValue title="Network fee">{`${networkFee} APT`}</List.KeyValue>
                  </List.Control>
                </List>
                {account?.address && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <a
                          target="_blank"
                          href={`https://explorer.aptoslabs.com/account/${
                            account?.address
                          }?network=${networkNameToNetwork(network)}`}
                          className={classNames(
                            'flex items-center gap-2 cursor-pointer text-blue',
                          )}
                          rel="noreferrer"
                        >
                          {`${account?.address.substring(
                            0,
                            6,
                          )}...${account?.address.substring(66 - 4)}`}
                        </a>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              </div>
              <DialogFooter>
                <Button
                  disabled={isTransactionPending || isPriceFetching}
                  color="blue"
                  fullWidth
                  size="xl"
                  onClick={() => {
                    swapToken(confirm)
                  }}
                >
                  {isTransactionPending ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    <>
                      Swap {token0?.symbol} For {token1?.symbol}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
    </DialogProvider>
  )
}
