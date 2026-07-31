'use client'

import {
  ArrowRightIcon,
  PlusIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { Button, Container, LinkInternal, Message } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatUsd, shortenAddress } from '../../_ui/format'
import { MetricCard } from '../../_ui/metric-card'
import { PageHeading } from '../../_ui/page-heading'
import { TokenGrid } from '../../_ui/token-grid'
import type { LaunchpadChainId } from '../../constants'
import { useLaunchpadCreator } from '../../hooks/use-launchpad-data'

export function ManageLaunchesPage({ chainId }: { chainId: LaunchpadChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const address = useAccount('evm')
  const filters = useMemo(
    () => ({
      first: 20,
      sortBy: 'CREATED_AT' as const,
      sortDirection: 'DESC' as const,
    }),
    [],
  )
  const {
    data: creator,
    isError,
    isPending,
    refetch,
  } = useLaunchpadCreator(chainId, address, filters)
  const tokens = useMemo(
    () => creator?.launches.edges.map((edge) => edge.node) ?? [],
    [creator?.launches.edges],
  )
  const combinedTvl = useMemo(
    () =>
      tokens.reduce(
        (total, token) => total + (token.metrics?.currentTvlUsd ?? 0),
        0,
      ),
    [tokens],
  )

  return (
    <>
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <PageHeading
          title="My Launches"
          description="Manage editable metadata, replace logos, and distribute accrued V3 fees for your launches."
          action={
            <LinkInternal href={`/${chainKey}/launchpad/create`}>
              <Button asChild size="lg" variant="perps-default" icon={PlusIcon}>
                Create token
              </Button>
            </LinkInternal>
          }
        />

        {!address ? (
          <Message variant="info" className="mt-7">
            Connect your creator wallet to load its launches.
          </Message>
        ) : null}

        {address ? (
          <div className="mt-5">
            <PerpsCard
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              fullWidth
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-perps-blue/10 text-perps-blue">
                  <WalletIcon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs text-perps-muted-50">
                    Creator wallet
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-perps-muted">
                    {shortenAddress(address, 7)}
                  </div>
                </div>
              </div>
              <LinkInternal href={`/${chainKey}/launchpad/creator/${address}`}>
                <Button
                  asChild
                  variant="perps-secondary"
                  size="sm"
                  icon={ArrowRightIcon}
                  iconPosition="end"
                >
                  Public profile
                </Button>
              </LinkInternal>
            </PerpsCard>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricCard label="Launches" value={creator?.launchCount ?? 0} />
          <MetricCard label="Combined TVL" value={formatUsd(combinedTvl)} />
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-10">
        <Container maxWidth="7xl" className="w-full px-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-perps-muted">
                Your tokens
              </h2>
              <p className="mt-2 text-sm text-perps-muted-50">
                Select a launch to update its public profile or distribute fees.
              </p>
            </div>
          </div>
          <div className="mt-6">
            {address && isPending ? (
              <PerpsCard
                className="grid min-h-64 place-items-center p-8 text-center text-sm text-perps-muted-50"
                fullWidth
              >
                Loading your launches…
              </PerpsCard>
            ) : address && isError ? (
              <PerpsCard
                className="grid min-h-64 place-items-center p-8 text-center"
                fullWidth
              >
                <div>
                  <p className="text-sm text-perps-muted-50">
                    Your launches could not be loaded.
                  </p>
                  <Button
                    variant="perps-secondary"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Try again
                  </Button>
                </div>
              </PerpsCard>
            ) : (
              <TokenGrid tokens={tokens} sortBy="CREATED_AT" manage />
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
