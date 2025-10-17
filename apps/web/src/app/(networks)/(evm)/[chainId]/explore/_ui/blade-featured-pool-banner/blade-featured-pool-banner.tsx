import type {
  BladeChainId,
  BladePool,
} from '@sushiswap/graph-client/data-api-blade-prod'
import { Badge, Button, Currency } from '@sushiswap/ui'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Link from 'next/link'
import type { FC } from 'react'
import {
  getPoolNameFromGroupedTokens,
  getPoolTokensGrouped,
} from 'src/lib/pool/blade'
import { formatPercent, formatUSD } from 'sushi'
import { getEvmChainById } from 'sushi/evm'
import { BladeBadgeIcon } from './blade-badge-icon'
import { BladeLetterBgIcon } from './blade-letter-bg-icon'
import { BladePoolBannerTitle } from './blade-pool-banner-title'

interface BladeFeaturedPoolBannerProps {
  pool: BladePool
  showStableTypes?: boolean
}

export const BladeFeaturedPoolBanner: FC<BladeFeaturedPoolBannerProps> = ({
  pool,
  showStableTypes = false,
}) => {
  const groupedTokens = getPoolTokensGrouped(pool)
  const { tokens, stablecoinUsdTokens } = groupedTokens
  const hasStablecoin = stablecoinUsdTokens.length > 0

  const poolName = getPoolNameFromGroupedTokens(groupedTokens, {
    showStableTypes,
  })

  return (
    <div className="relative min-h-[205px] w-full overflow-hidden rounded-xl bg-[-1289px_-914px] bg-no-repeat py-8 md:py-12 lg:py-0 bg-[url('/blade-banner-background.jpg')]">
      <div className="grid grid-cols-1 items-center gap-x-4 gap-y-8 px-4 md:grid-cols-2 md:gap-x-8 md:px-8 lg:grid-cols-12 lg:gap-y-0">
        <div className="-mt-[80px] -ml-4 md:-ml-8 relative md:col-span-1 lg:col-span-5 lg:mt-0">
          <BladeLetterBgIcon />
          <BladePoolBannerTitle className="absolute top-0 left-0 mt-2 ml-4 h-full w-[280px] md:ml-12 md:w-[312px]" />
        </div>
        <div className="-mt-12 flex flex-col items-center space-y-4 md:col-span-1 md:mt-0 md:items-start lg:col-span-5">
          <div className="flex w-full flex-col items-center gap-3 md:items-start md:justify-start md:gap-4">
            <div className="flex min-w-[54px]">
              <Badge
                className="!-right-[12px] !-bottom-0 z-[11] rounded-full border-2 border-slate-900"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon chainId={pool.chainId} width={20} height={20} />
                }
              >
                <Currency.IconList iconWidth={51} iconHeight={51}>
                  {tokens.map((token) => (
                    <Currency.Icon
                      key={token.wrap().address}
                      disableLink
                      currency={token}
                    />
                  ))}
                  {hasStablecoin && !showStableTypes ? (
                    <CurrencyFiatIcon width={51} height={51} />
                  ) : (
                    stablecoinUsdTokens.map((token) => (
                      <Currency.Icon
                        key={token.wrap().address}
                        disableLink
                        currency={token}
                      />
                    ))
                  )}
                </Currency.IconList>
              </Badge>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-white text-xs opacity-80">
                {poolName}
              </span>
              <BladeBadgeIcon />
            </div>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-4 text-sm md:justify-start md:gap-8">
            <div className="space-y-1">
              <div className="font-medium text-white opacity-60">TVL</div>
              <div className="font-semibold text-lg text-white">
                {formatUSD(pool.liquidityUSD)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-white opacity-60">Volume</div>
              <div className="font-semibold text-lg text-white">
                {formatUSD(pool.volumeUSD1d)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-white opacity-60">APR</div>
              <div className="bg-gradient-to-r from-[#B0F1FF] to-[#E292E2] bg-clip-text font-semibold text-lg text-transparent">
                {formatPercent(pool.totalApr1d)}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2 md:justify-start md:pt-4 lg:hidden">
            <VisitBladePoolButton
              address={pool.address}
              chainId={pool.chainId}
            />
          </div>
        </div>

        <div className="hidden justify-end self-center py-4 lg:col-span-2 lg:flex lg:py-0">
          <VisitBladePoolButton address={pool.address} chainId={pool.chainId} />
        </div>
      </div>
    </div>
  )
}

interface VisitBladePoolButtonProps {
  address: string
  chainId: BladeChainId
}

function VisitBladePoolButton({ address, chainId }: VisitBladePoolButtonProps) {
  const link = `/${getEvmChainById(chainId).key}/pool/blade/${address}`
  return (
    <Link href={link}>
      <Button
        variant="blank"
        className="rounded-lg bg-[#3B7EF6] bg-[linear-gradient(96deg,_#C3F1FB_2%,_#FFC9F1_207%)] px-4 py-3.5 text-neutral-950 hover:opacity-90"
      >
        Visit Blade Pool
      </Button>
    </Link>
  )
}
