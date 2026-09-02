import { ArrowRightIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { Button, Dots, Message, classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount, shortenAddress } from '../../../_lib/format'
import {
  SUSHI_V2_FEE_DISPOSITION_LABELS,
  type SushiV2FeeDestination,
  getSushiV2FeeRoutes,
} from '../../../_providers/sushi-v2/contract'
import type { DistributionPreview } from '../../../_providers/sushi-v2/contract'
import type { LaunchpadChainId } from '../../../constants'
import type { LaunchpadToken } from '../../../types'

const DESTINATION_LABELS = {
  SUSHI: 'Sushi',
  FEE_RECEIVER: 'Fee receiver',
  BURN: 'Burned',
  BUYBACK: 'Buys back the token',
} as const satisfies Record<SushiV2FeeDestination, string>

interface FeeRoute {
  destination: SushiV2FeeDestination
  amount: bigint
  note?: string
}

export function FeeDistributionCard({
  token,
  chainId,
  preview,
  isSimulating,
  isDistributing,
  distributed,
  error,
  onDistribute,
}: {
  token: LaunchpadToken
  chainId: LaunchpadChainId
  preview: DistributionPreview | null
  isSimulating: boolean
  isDistributing: boolean
  distributed: boolean
  error: string | null
  onDistribute: () => void
}) {
  const quoteToken = token.pool.quoteToken
  const breakdown = preview?.breakdown
  const routes =
    token.__typename === 'SushiV2LaunchpadToken'
      ? getSushiV2FeeRoutes(token.feeDisposition)
      : null
  const launchTokenRoutes: FeeRoute[] | null =
    routes && breakdown
      ? routes.launchToken.map((destination) => ({
          destination,
          amount:
            destination === 'SUSHI'
              ? breakdown.launchTokenToSushi
              : destination === 'FEE_RECEIVER'
                ? breakdown.launchTokenToReceiver
                : breakdown.launchTokenFeesBurned,
        }))
      : null
  const quoteRoutes: FeeRoute[] | null =
    routes && breakdown
      ? routes.quote.map((destination) => ({
          destination,
          amount:
            destination === 'SUSHI'
              ? breakdown.quoteToSushi
              : destination === 'FEE_RECEIVER'
                ? breakdown.quoteToReceiver
                : breakdown.quoteUsedForBuyback,
          note:
            destination === 'BUYBACK'
              ? `Burns ${formatRawAmount(breakdown.launchTokenBoughtAndBurned, token.decimals, 4)} ${token.symbol}`
              : undefined,
        }))
      : null
  const paysFeeReceiver = Boolean(
    routes &&
      (routes.launchToken.includes('FEE_RECEIVER') ||
        routes.quote.includes('FEE_RECEIVER')),
  )

  return (
    <PerpsCard className="p-5 sm:p-7" fullWidth>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <BanknotesIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-perps-muted">
              Distribute trading fees
            </h2>
            <p className="mt-0.5 text-xs leading-5 text-perps-muted-50">
              Collects every registered position in one transaction and routes
              the fees the way this launch is configured. Anyone can trigger it.
            </p>
          </div>
        </div>
        <div className="shrink-0 sm:w-52">
          <Checker.Connect
            namespace="evm"
            fullWidth
            size="lg"
            variant="perps-default"
            type="button"
          >
            <Checker.Network
              chainId={chainId}
              fullWidth
              size="lg"
              type="button"
              variant="perps-default"
              hideChainName
            >
              <Button
                fullWidth
                size="lg"
                variant="perps-default"
                disabled={isDistributing || distributed}
                onClick={onDistribute}
              >
                {isDistributing ? (
                  <>
                    {'Distributing fees'}
                    <Dots />
                  </>
                ) : distributed ? (
                  'Fees distributed'
                ) : (
                  'Distribute fees'
                )}
              </Button>
            </Checker.Network>
          </Checker.Connect>
        </div>
      </div>

      {token.__typename === 'SushiV2LaunchpadToken' ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip
            label="Fee mode"
            value={SUSHI_V2_FEE_DISPOSITION_LABELS[token.feeDisposition]}
          />
          <Chip
            label="Split"
            value={`${token.feeSplit.sushiFeeBps / 100}% Sushi · ${token.feeSplit.nonSushiFeeBps / 100}% non-Sushi`}
          />
          {paysFeeReceiver ? (
            <Chip
              label="Receiver"
              value={shortenAddress(token.feeReceiver, 4)}
            />
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <FeeSideTile
          label={`${token.symbol} fees`}
          amount={
            preview
              ? `${formatRawAmount(preview.tokenCollected, token.decimals, 6)} ${token.symbol}`
              : null
          }
          isSimulating={isSimulating}
          routes={launchTokenRoutes}
          decimals={token.decimals}
          symbol={token.symbol}
        />
        <FeeSideTile
          label={`${quoteToken.symbol} fees`}
          amount={
            preview
              ? `${formatRawAmount(preview.quoteCollected, quoteToken.decimals, 6)} ${quoteToken.symbol}`
              : null
          }
          isSimulating={isSimulating}
          routes={quoteRoutes}
          decimals={quoteToken.decimals}
          symbol={quoteToken.symbol}
        />
      </div>

      {error ? (
        <Message
          variant="destructive"
          className="mt-4 min-w-0 max-w-full break-words"
        >
          {error}
        </Message>
      ) : null}
    </PerpsCard>
  )
}

function FeeSideTile({
  label,
  amount,
  isSimulating,
  routes,
  decimals,
  symbol,
}: {
  label: string
  amount: string | null
  isSimulating: boolean
  routes: FeeRoute[] | null
  decimals: number
  symbol: string
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="text-xs text-perps-muted-50">{label}</div>
      <div
        className={classNames(
          'mt-1 text-lg font-semibold',
          amount ? 'text-perps-muted' : 'text-perps-muted-50',
        )}
      >
        {amount ??
          (isSimulating ? (
            <>
              Simulating
              <Dots />
            </>
          ) : (
            'None pending'
          ))}
      </div>
      {routes ? (
        <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
          {routes.map((route) => (
            <div key={route.destination}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-perps-muted-50">
                  <ArrowRightIcon className="h-3 w-3" />
                  {DESTINATION_LABELS[route.destination]}
                </span>
                <span className="font-medium text-perps-muted">
                  {formatRawAmount(route.amount, decimals, 6)} {symbol}
                </span>
              </div>
              {route.note ? (
                <div className="mt-0.5 pl-[18px] text-[11px] text-perps-muted-50">
                  {route.note}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Chip({ label, value }: { label: string; value: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs">
      <span className="text-perps-muted-50">{label}</span>
      <span className="font-medium text-perps-muted">{value}</span>
    </span>
  )
}
