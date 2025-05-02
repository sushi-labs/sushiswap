import { type ButtonProps, List, SkeletonBox } from '@sushiswap/ui'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'
import { formatUSD } from 'sushi/format'
import { formatUnits } from '~kadena/_common/lib/utils/formatters'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { Icon } from '../../General/Icon'
import { WalletConnector } from '../../WalletConnector/WalletConnector'
import { usePoolState } from '../pool-provider'
import { AddButton } from './AddButton'
import { ReviewAddDialogTrigger } from './ReviewAddDialogTrigger'

export const ReviewAddDialog = (props: ButtonProps) => {
  const { token0, token1, amountInToken0, amountInToken1 } = usePoolState()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const { isConnected } = useKadena()

  const token0Price = '3.93'
  const token1Price = '2.7'

  const [isLoadingToken0Price, setIsLoadingToken0Price] = useState(true)
  const [isLoadingToken1Price, setIsLoadingToken1Price] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingToken0Price(false)
      setIsLoadingToken1Price(false)
    }, 1800)
  }, [])

  const closeModal = () => {
    closeBtnRef?.current?.click()
  }

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
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-[504px] mx-auto w-full">
          <div className="flex flex-col w-full gap-4">
            <List className="w-full">
              <List.Control>
                <List.KeyValue title={token0?.tokenSymbol}>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <Icon currency={token0} width={16} height={16} />
                      {/* show max 12 decimals so nothing is cut off */}
                      <div>{formatUnits(amountInToken0, 0, 12)}</div>{' '}
                      <div>{token0?.tokenSymbol}</div>
                    </div>
                    {isLoadingToken0Price ? (
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
                <List.KeyValue title={token1?.tokenSymbol}>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <Icon currency={token1} width={16} height={16} />
                      {/* show max 12 decimals so nothing is cut off */}
                      <div>{formatUnits(amountInToken1, 0, 12)}</div>{' '}
                      <div>{token1?.tokenSymbol}</div>
                    </div>
                    {isLoadingToken1Price ? (
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
