'use client'

import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import { Button, Container, SkeletonBox, TextField } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { MetricStrip, MetricStripItem } from '../_ui/metric-strip'
import { ProviderFilterControls } from '../_ui/provider-filter-controls'
import { TokenGridSkeleton } from '../_ui/token-grid'
import {
  DEFAULT_LAUNCHPAD_TOKEN_SORT,
  TokenSortControls,
} from '../_ui/token-sort-controls'

const METRIC_SKELETONS = [
  { label: 'Tokens launched', valueWidth: 'w-12' },
  { label: '24h volume', valueWidth: 'w-16' },
  { label: 'Liquidity', valueWidth: 'w-[82px]' },
] as const

function noop() {}

export default function LaunchpadLoading() {
  return (
    <div aria-label="Loading launches" aria-busy="true">
      <Container maxWidth="7xl" className="w-full px-4 pb-8 pt-8 sm:pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-perps-muted sm:text-5xl">
              Discover tokens as they launch.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-perps-muted-50 sm:text-base">
              Follow live markets, trade directly from each token page, and
              launch with permanently locked Sushi V3 liquidity.
            </p>
          </div>
          <Button
            disabled
            size="lg"
            variant="perps-default"
            icon={ArrowRightIcon}
            iconPosition="end"
          >
            Create token
          </Button>
        </div>

        <div className="mt-7">
          <MetricStrip>
            {METRIC_SKELETONS.map((metric, index) => (
              <MetricStripItem
                key={metric.label}
                index={index}
                label={metric.label}
                value={
                  <SkeletonBox
                    className={`h-7 rounded-md ${metric.valueWidth}`}
                  />
                }
              />
            ))}
            <div className="flex items-center gap-3 border-l border-t border-white/[0.06] px-5 py-4 lg:border-t-0">
              <span className="hidden h-9 w-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-400 sm:grid">
                <SignalIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-perps-muted-50">
                  Market feeds
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
                  Live
                </div>
              </div>
            </div>
          </MetricStrip>
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-8">
        <Container maxWidth="7xl" className="w-full px-4">
          <PerpsCard className="p-3 sm:p-4" fullWidth>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <TextField
                  disabled
                  type="text"
                  icon={MagnifyingGlassIcon}
                  placeholder="Search name, symbol, or address"
                  aria-label="Search launches"
                  className="!bg-white/[0.04] !text-perps-muted"
                  wrapperClassName="min-w-0 sm:w-[300px] xl:w-[400px]"
                />
                <ProviderFilterControls
                  disabled
                  filter="all"
                  onFilterChange={noop}
                />
              </div>
              <TokenSortControls
                disabled
                sortBy={DEFAULT_LAUNCHPAD_TOKEN_SORT}
                onSortByChange={noop}
              />
            </div>
          </PerpsCard>

          <div className="mt-6">
            <TokenGridSkeleton />
          </div>
        </Container>
      </section>
    </div>
  )
}
