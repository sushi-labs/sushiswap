import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  type ButtonProps,
  DialogProvider,
  DialogReview,
  IconButton,
  List,
  SettingsModule,
  SettingsOverlay,
  SkeletonBox,
} from '@sushiswap/ui'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { Amount, formatUSD } from 'sushi'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { usePoolState } from '../../../../pool/pool-provider'
import { Icon } from '../../General/Icon'
import { WalletConnector } from '../../WalletConnector/WalletConnector'
import { AddButton } from './AddButton'
import { ReviewAddDialogTrigger } from './ReviewAddDialogTrigger'

export const ReviewAddDialog = (props: ButtonProps) => {
  const { token0, token1, amountInToken0, amountInToken1, poolId } =
    usePoolState()

  const { isConnected } = useKadena()

  const { data: priceUsd0, isLoading: isLoadingPrice0 } = useTokenPrice({
    token: token0,
  })
  const { data: priceUsd1, isLoading: isLoadingPrice1 } = useTokenPrice({
    token: token1,
  })

  const isLoading = isLoadingPrice0 || isLoadingPrice1

  const token0Price = priceUsd0 ?? 0
  const token1Price = priceUsd1 ?? 0

  const amount0 = useMemo(() => {
    if (!token0 || !amountInToken0) return '0'

    return Amount.fromHuman(token0, amountInToken0).toString({
      fixed: 12,
    })
  }, [amountInToken0, token0])

  const amount1 = useMemo(() => {
    if (!token1 || !amountInToken1) return '0'
    return Amount.fromHuman(token1, amountInToken1).toString({
      fixed: 12,
    })
  }, [amountInToken1, token1])

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {isConnected ? (
              <ReviewAddDialogTrigger {...props} />
            ) : (
              <WalletConnector fullWidth {...props} />
            )}
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>Add liquidity</DialogTitle>
                  <DialogDescription>
                    Please review your entered details.
                    {!poolId ? (
                      <>
                        <br />
                        Creating a pool will require 2 transactions to be
                        submitted on-chain.
                      </>
                    ) : null}
                  </DialogDescription>
                </DialogHeader>
                <SettingsOverlay
                  options={{
                    slippageTolerance: {
                      storageKey: SlippageToleranceStorageKey.AddLiquidity,
                    },
                  }} //use this key to get slippage from localStorage
                  modules={[SettingsModule.SlippageTolerance]}
                >
                  <IconButton
                    name="Settings"
                    icon={Cog6ToothIcon}
                    variant="secondary"
                    className="mr-12"
                  />
                </SettingsOverlay>
              </div>
              <div className="max-w-[504px] mx-auto w-full">
                <div className="flex flex-col gap-4 w-full">
                  <List className="w-full">
                    <List.Control>
                      <List.KeyValue title={token0?.symbol}>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-1 items-center">
                            <Icon currency={token0} width={16} height={16} />
                            <div>{Number.parseFloat(amount0)}</div>{' '}
                            <div>{token0?.symbol}</div>
                          </div>
                          {isLoading ? (
                            <SkeletonBox className="h-3 w-[40px] rounded-sm" />
                          ) : (
                            <div className="text-[12px] opacity-60">
                              {formatUSD(
                                Number(token0Price) * Number(amountInToken0),
                              )}
                            </div>
                          )}
                        </div>
                      </List.KeyValue>
                      <List.KeyValue title={token1?.symbol}>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-1 items-center">
                            <Icon currency={token1} width={16} height={16} />
                            <div>{Number.parseFloat(amount1)}</div>{' '}
                            <div>{token1?.symbol}</div>
                          </div>
                          {isLoading ? (
                            <SkeletonBox className="h-3 w-[40px] rounded-sm" />
                          ) : (
                            <div className="text-[12px] opacity-60">
                              {formatUSD(
                                Number(token1Price) * Number(amountInToken1),
                              )}
                            </div>
                          )}
                        </div>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                  <AddButton closeModal={confirm} {...props} />
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </DialogReview>
    </DialogProvider>
  )
}
