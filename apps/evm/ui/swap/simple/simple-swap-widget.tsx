'use client'

import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogSuccess,
  DialogTitle,
  DialogTrigger,
  useToast,
} from '@sushiswap/ui'
import { CrossChainBanner } from '../cross-chain-banner'
import { SwapModeButtons } from '../swap-mode-buttons'
import { SimpleSwapHeader } from './simple-swap-header'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from './simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeButton } from './simple-swap-trade-button'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'
import { ChainId } from 'sushi/chain'

let i = 0
export const SimpleSwapWidget = () => {
  const { toast } = useToast()

  const createPromise = () => {
    return new Promise<void>((resolve, reject) =>
      setTimeout(() => resolve(), 2000),
    )
  }

  const onClick = () => {
    const promise = new Promise<void>((resolve, reject) =>
      setTimeout(() => resolve(), 2000),
    )

    promise
      .then(() => {
        toast({
          variant: 'success',
          description: (
            <>
              Swapped <b>0.0001 ETH</b> for <b>0.0001 ETH</b>
            </>
          ),
        })
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          description: (
            <>
              <b>Oops!</b> Something went wrong.
            </>
          ),
        })
      })
  }

  return (
    <div className="flex flex-col gap-4">
      <SimpleSwapHeader />
      <div className="flex items-center justify-between">
        <SwapModeButtons />
        <SimpleSwapSettingsOverlay />
      </div>
      <CrossChainBanner />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <div className="flex flex-col">
        <SimpleSwapToken1Input />
        <SimpleSwapTradeButton />
      </div>

      <SimpleSwapTradeStats />
      <SimpleSwapTokenNotFoundDialog />
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              <DialogTrigger>
                <Button fullWidth size="xl">
                  Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buy</DialogTitle>
                  <DialogDescription>
                    Test dialog to test toasts
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button fullWidth size="xl" onClick={confirm}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogSuccess
          chainId={ChainId.ETHEREUM}
          testId="make-another-swap"
          buttonText="Close"
          hash="0xa868b8c0261320a8282086e5b4649bd26898028106507e47f254f75b764e4948"
          summary="Swap of MATIC to SUSHI"
          onClose={() =>
            toast({
              description: (
                <>
                  Swapping <b>0.0001 ETH</b> for <b>0.0001 ETH</b>
                </>
              ),
            })
          }
        />
      </DialogProvider>
      <Button
        onClick={() => {
          i++
          toast({
            visual:
              i % 2 === 0 ? (
                <div className="rounded-t-xl bg-blue flex text-2xl font-bold tracking-tighter text-white justify-center items-center w-full h-full">
                  Success!
                </div>
              ) : null,
            description: (
              <>
                Swapped <b>0.0001 ETH</b> for <b>0.0001 ETH</b>
              </>
            ),
          })
        }}
      >
        Test
      </Button>
    </div>
  )
}
