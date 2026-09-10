import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { LaunchpadStatsType } from '@sushiswap/graph-client/data-api'
import { Button, Container, LinkInternal, SkeletonBox } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import { formatUsd } from '../../_lib/format'

export function LaunchpadHero({
  createHref,
  trending,
  stats,
  isLoading = false,
}: {
  createHref?: string
  trending: ReactNode
  stats?: LaunchpadStatsType
  isLoading?: boolean
}): ReactElement {
  const createButton = (
    <Button
      asChild={Boolean(createHref)}
      disabled={!createHref}
      size="lg"
      variant="perps-default"
      icon={ArrowRightIcon}
      iconPosition="end"
      className="!px-8"
    >
      Create token
    </Button>
  )

  return (
    <Container
      maxWidth="7xl"
      className="w-full px-4 sm:px-8 pb-8 pt-8 sm:pt-10"
    >
      <div className="bg-[#151A20] rounded-2xl border border-white/[0.07] px-4 lg:px-10 py-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start items-center lg:justify-between">
          <div className="max-w-3xl flex flex-col gap-2 lg:gap-6 lg:mt-4">
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 lg:gap-0 lg:flex-col">
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-perps-muted sm:text-4xl lg:text-6xl ">
                Launch a token.
              </h1>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-perps-muted sm:text-4xl lg:text-6xl ">
                Create its market.
              </h1>
            </div>
            <p className="lg:max-w-[400px] text-sm leading-6 text-perps-muted-50 sm:text-lg">
              Launch with live Sushi liquidity and pair with crypto, Stock
              Tokens and RWAs.
            </p>
            {createHref ? (
              <LinkInternal
                href={createHref}
                className="mt-1 md:mx-auto lg:mx-0"
              >
                {createButton}
              </LinkInternal>
            ) : (
              <div className="mt-1 md:mx-auto lg:mx-0">{createButton}</div>
            )}
          </div>
          <div className="w-full lg:w-fit">{trending}</div>
        </div>
        <hr className="w-full h-px border-white/[0.07] mt-12 mb-6 hidden md:block" />

        <div className="md:flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0 hidden">
          {[
            {
              label: 'Tokens launched',
              value: stats?.totalTokensLaunched?.toString() ?? '—',
            },
            {
              label: '24H Volume',
              value: formatUsd(stats?.totalVolumeUsd24h),
            },
            {
              label: 'Liquidity',
              value: formatUsd(stats?.totalLiquidityUsd),
            },
          ].map((stat, idx) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex justify-center items-center md:gap-2 flex-col-reverse md:flex-row">
                <div className="flex h-7 items-center text-lg font-bold text-white">
                  {isLoading ? (
                    <SkeletonBox className="h-6 w-20 rounded-md" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-base text-perps-muted-50 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
              {idx < 2 && (
                <div className="mx-6 hidden h-1 w-1 shrink-0 rounded-full bg-perps-muted-20 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
