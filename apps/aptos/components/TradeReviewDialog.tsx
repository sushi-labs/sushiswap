import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { Button } from '@sushiswap/ui/future/components/button'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { ModalType } from '@sushiswap/ui/future/components/modal/ModalProvider'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { Network, Provider } from 'aptos'
import React, { FC } from 'react'
import { payloadArgs } from 'utils/payloadUtil'
import { createToast } from './toast'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

interface Props {
  isTransactionPending: boolean
}

export const TradeReviewDialog: FC<Props> = ({ isTransactionPending }) => {
  const { bestRoutes, token0, token1, slippageAmount, amount, outputAmount, isPriceFetching } = useSwapState()
  const { account, signAndSubmitTransaction } = useWallet()
  const { setisTransactionPending } = useSwapActions()

  const swapToken = async (close: () => void) => {
    const provider = new Provider(Network.TESTNET)
    const payload: any = payloadArgs(
      parseInt((parseFloat(String(amount)) * 10 ** token0.decimals) as unknown as string),
      bestRoutes,
      parseInt(String(slippageAmount))
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      // sign and submit transaction to chain
      const response: Promise<any> = await signAndSubmitTransaction(payload)
      console.log(response)
      // wait for transaction
      await provider.waitForTransaction(response?.hash)

      //return from here if response is failed
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      createToast({
        summery: `Swap ${amount} ${token0.symbol} for ${parseFloat(
          (parseInt(outputAmount) / 10 ** token1?.decimals).toFixed(9)
        )} ${token1.symbol}`,
        toastId: toastId,
      })
      setisTransactionPending(false)
      close()
    } catch (error) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: `User rejected request`, toastId: toastId })
    } finally {
      setisTransactionPending(false)
    }
  }
  const [slippageTolerance] = useSlippageTolerance('swapSlippage')
  return (
    // <>Hello</>
    <Modal.Review modalType={ModalType.Regular} variant="opaque" tag="review-modal">
      {({ close }) => (
        <div className="max-w-[504px] mx-auto">
          <button type="button" onClick={close} className="p-3 pl-0">
            <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
          </button>
          <div className="flex items-start justify-between gap-4 py-2">
            <div className="flex flex-col flex-grow gap-1">
              {!outputAmount ? (
                <Skeleton.Text fontSize="text-3xl" className="w-2/3" />
              ) : (
                <h1 className="text-3xl font-semibold dark:text-slate-50">
                  Buy {(parseFloat(outputAmount) / 10 ** token1.decimals).toFixed(9)} {token1?.symbol}
                </h1>
              )}
              <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">
                {/* {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'} {amount?.toSignificant(6)} {token0?.symbol} */}
                Sell {amount} {token0?.symbol}
              </h1>
            </div>
            <div className="min-w-[56px] min-h-[56px]">
              <div className="pr-1">
                <Badge
                  position="bottom-right"
                  badgeContent={
                    <div className="bg-gray-100 border-2 border-gray-100 rounded-full">
                      <PlusIcon
                        strokeWidth={2}
                        width={24}
                        height={24}
                        className="bg-blue text-white rounded-full p-0.5"
                      />
                    </div>
                  }
                >
                  {token1 ? (
                    <img src={token1.logoURI} className="rounded-full" width={56} height={56} />
                  ) : (
                    // <Currency.Icon currency={token1} width={56} height={56} />
                    <Skeleton.Circle radius={56} className="bg-gray-100 dark:bg-slate-800" />
                  )}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <List>
              <List.Control>
                <List.KeyValue title="Network">APTOS</List.KeyValue>
                <List.KeyValue
                  title="Price Impect"
                  subtitle="The impact your trade has on the market price of this pool."
                >
                  <span className={'text-gray-700 text-right dark:text-slate-400'}>+0.13% (static right now)</span>
                </List.KeyValue>
                <List.KeyValue
                  title={`Min. received after slippage (${slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%)`}
                  subtitle="The minimum amount you are guaranteed to receive."
                >
                  {!outputAmount ? (
                    <Skeleton.Text align="right" fontSize="text-sm" className="w-1/2" />
                  ) : (
                    <>
                      {parseFloat(String((slippageAmount / 10 ** token1.decimals).toFixed(8)))} {token1?.symbol}
                    </>
                  )}
                </List.KeyValue>

                <List.KeyValue title="Network fee">~$0.00</List.KeyValue>
              </List.Control>
              <div className="pt-4">
                <div className="space-y-4">
                  <Button
                    disabled={isTransactionPending || isPriceFetching}
                    color="blue"
                    fullWidth
                    size="xl"
                    onClick={() => {
                      swapToken(close)
                    }}
                  >
                    {isTransactionPending ? <Dots>Confirm Swap</Dots> : <>Swap</>}
                  </Button>
                </div>
              </div>
            </List>
          </div>
        </div>
      )}
    </Modal.Review>
  )
}
