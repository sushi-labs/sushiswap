import { type ButtonProps, List, SkeletonBox } from '@sushiswap/ui'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useMemo, useRef } from 'react'
import { Amount, formatUSD } from 'sushi'
import { parseUnits } from 'viem'
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

  const closeBtnRef = useRef<HTMLButtonElement>(null)
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

  const closeModal = () => {
    closeBtnRef?.current?.click()
  }

  const amount0 = useMemo(() => {
    if (!token0 || !amountInToken0) return '0'
    return new Amount(
      token0,
      parseUnits(amountInToken0.toString(), token0.decimals).toString(),
    ).toString({
      fixed: 12,
    })
  }, [amountInToken0, token0])

  const amount1 = useMemo(() => {
    if (!token1 || !amountInToken1) return '0'
    return new Amount(
      token1,
      parseUnits(amountInToken1.toString(), token1.decimals).toString(),
    ).toString({
      fixed: 12,
    })
  }, [amountInToken1, token1])

  return (
    <Dialog>
      {isConnected ? (
        <ReviewAddDialogTrigger {...props} />
      ) : (
        <WalletConnector fullWidth {...props} />
      )}
      <DialogContent>
        <DialogClose ref={closeBtnRef} />
        <DialogHeader>
          <DialogTitle>Add liquidity</DialogTitle>
          <DialogDescription>
            Please review your entered details.
            {!poolId ? (
              <>
                <br />
                Creating a pool will require 2 transactions to be submitted
                on-chain.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-[504px] mx-auto w-full">
          <div className="flex flex-col gap-4 w-full">
            <List className="w-full">
              <List.Control>
                <List.KeyValue title={token0?.symbol}>
                  <div className="flex flex-col items-end">
                    <div className="flex gap-1 items-center">
                      <Icon currency={token0} width={16} height={16} />
                      <div>{amount0}</div> <div>{token0?.symbol}</div>
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
                      <div>{amount1}</div> <div>{token1?.symbol}</div>
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
            <AddButton closeModal={closeModal} {...props} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
