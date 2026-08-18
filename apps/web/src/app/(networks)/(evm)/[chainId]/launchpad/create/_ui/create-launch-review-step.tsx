import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { Button, Dots, Message } from '@sushiswap/ui'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Checker } from 'src/lib/wagmi/systems/checker'
import type { EvmAddress } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { SUSHI_V2_LAUNCHPAD_ADDRESS } from '../../_providers/sushi-v2/contract'
import { DetailList, type DetailListItem } from '../../_ui/detail-list'
import type { LaunchpadChainId } from '../../constants'
import type { CreateLaunchForm } from './create-launch-types'

export function CreateLaunchReviewStep({
  chainId,
  values,
  previewImageUrl,
  details,
  isFactoryTermsError,
  launchedTokenAddress,
  isWaitingForIndexing,
  tokenHref,
  isNativeInitialBuy,
  initialBuyAmountRaw,
  initialBuyAmount,
  isLaunching,
  isLogoProcessing,
  isFactoryTermsPending,
  selectedQuoteTokenAvailable,
  onOpenLegalDialog,
  onBack,
}: {
  chainId: LaunchpadChainId
  values: CreateLaunchForm
  previewImageUrl: string | undefined
  details: readonly DetailListItem[]
  isFactoryTermsError: boolean
  launchedTokenAddress: EvmAddress | undefined
  isWaitingForIndexing: boolean
  tokenHref: string | undefined
  isNativeInitialBuy: boolean
  initialBuyAmountRaw: bigint | undefined
  initialBuyAmount: ComponentProps<typeof Checker.ApproveERC20>['amount']
  isLaunching: boolean
  isLogoProcessing: boolean
  isFactoryTermsPending: boolean
  selectedQuoteTokenAvailable: boolean
  onOpenLegalDialog: () => void
  onBack: () => void
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-start gap-4">
          {previewImageUrl ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-black/20">
              <img
                src={previewImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-perps-blue/10 text-perps-blue">
              <SparklesIcon className="h-6 w-6" />
            </span>
          )}

          <div>
            <div className="text-xl font-semibold text-perps-muted">
              {values.name || 'Untitled token'}
            </div>
            <div className="mt-1 text-sm text-perps-muted-50">
              {values.symbol || 'TOKEN'} · 1,000,000,000 supply
            </div>
          </div>
        </div>
        <DetailList className="mt-7" variant="bordered" items={details} />
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/[0.04] p-4 text-sm text-perps-muted-50">
          <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-perps-blue" />
          <p className="leading-6">
            Token name, symbol, supply, starting valuation, quote asset, and
            liquidity mode are fixed. The creator may be transferred, and the
            fee mode may only move toward more burning. The contract is
            upgradeable; liquidity custody is not.
          </p>
        </div>
        {isFactoryTermsError ? (
          <Message variant="destructive" className="mt-6">
            The current factory terms could not be loaded. Try again before
            creating your token.
          </Message>
        ) : null}
        {launchedTokenAddress ? (
          <Message variant="success" className="mt-6">
            <span>
              Launch confirmed at {launchedTokenAddress}.{' '}
              {isWaitingForIndexing
                ? 'Waiting for the launch catalog to index it…'
                : 'Catalog indexing is taking longer than expected.'}
            </span>
          </Message>
        ) : null}
      </PerpsCard>

      <div className="space-y-4">
        <PerpsCard className="space-y-4 p-5" fullWidth>
          <div className="text-sm font-semibold text-perps-muted">
            Ready to launch
          </div>
          {isWaitingForIndexing ? (
            <>
              Waiting for indexing
              <Dots />
            </>
          ) : launchedTokenAddress && tokenHref ? (
            <Button
              asChild
              fullWidth
              size="xl"
              variant="perps-default"
              className="mt-5"
              icon={ArrowTopRightOnSquareIcon}
              iconPosition="end"
            >
              <Link href={tokenHref}>View launch</Link>
            </Button>
          ) : (
            <Checker.Connect
              namespace="evm"
              fullWidth
              size="xl"
              variant="perps-default"
              className="mt-5"
              type="button"
            >
              <Checker.Network
                chainId={chainId}
                fullWidth
                size="xl"
                variant="perps-default"
                type="button"
              >
                <Checker.ApproveERC20
                  id="approve-launchpad-initial-buy"
                  amount={
                    !isNativeInitialBuy && initialBuyAmountRaw !== 0n
                      ? initialBuyAmount
                      : undefined
                  }
                  contract={SUSHI_V2_LAUNCHPAD_ADDRESS}
                  enabled={
                    !isNativeInitialBuy &&
                    initialBuyAmountRaw !== undefined &&
                    initialBuyAmountRaw > 0n
                  }
                  variant="perps-default"
                >
                  <Button
                    type="button"
                    fullWidth
                    size="xl"
                    variant="perps-default"
                    disabled={
                      isLaunching ||
                      isLogoProcessing ||
                      isFactoryTermsPending ||
                      isFactoryTermsError ||
                      !selectedQuoteTokenAvailable ||
                      initialBuyAmountRaw === undefined
                    }
                    onClick={onOpenLegalDialog}
                  >
                    {isLaunching ? 'Creating token…' : 'Create token'}
                  </Button>
                </Checker.ApproveERC20>
              </Checker.Network>
            </Checker.Connect>
          )}
          <div className="mt-3 text-center text-xs text-perps-muted-50">
            Estimated network cost appears after simulation
          </div>
        </PerpsCard>
        <Button
          type="button"
          fullWidth
          variant="perps-secondary"
          icon={ArrowLeftIcon}
          onClick={onBack}
        >
          Back to initial buy
        </Button>
      </div>
    </div>
  )
}
