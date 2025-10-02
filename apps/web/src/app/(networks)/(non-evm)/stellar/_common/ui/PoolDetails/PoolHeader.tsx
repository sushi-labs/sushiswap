'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  SkeletonCircle,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { usePoolInfo } from '../../lib/hooks/pool/use-pool-info'
import { formatPoolFee } from '../../lib/utils/formatters'
import { getStellarContractLink } from '../../lib/utils/stellarchain-helpers'
import { TokenIcon } from '../General/TokenIcon'

interface PoolHeaderProps {
  pool?: PoolInfo | null
  backUrl: string
  address?: string
}

export const PoolHeader = ({ pool, backUrl, address }: PoolHeaderProps) => {
  // If pool is not provided, fetch it using the address
  const { data: fetchedPool, isLoading: isFetching } = usePoolInfo(
    address || null,
  )

  const actualPool = pool || fetchedPool
  const isLoading = !pool && isFetching

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href={backUrl}
          className="text-blue hover:underline text-sm"
        >
          ← Back
        </LinkInternal>
        {isLoading ? (
          <div className="flex items-center w-full gap-3">
            <div className="flex items-center">
              <SkeletonCircle radius={40} />
              <SkeletonCircle radius={40} className="-ml-[13.33px]" />
            </div>
            <div className="w-[200px]">
              <SkeletonText fontSize="3xl" />
            </div>
          </div>
        ) : actualPool ? (
          <div className="relative flex items-center gap-3 max-w-[100vh]">
            <Currency.IconList iconWidth={36} iconHeight={36}>
              <TokenIcon currency={actualPool.token0} />
              <TokenIcon currency={actualPool.token1} />
            </Currency.IconList>
            <Button
              asChild
              variant="link"
              className={typographyVariants({
                variant: 'h1',
                className:
                  'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
              })}
            >
              <LinkExternal href={getStellarContractLink(actualPool.address)}>
                {actualPool.token0.code}/{actualPool.token1.code}
              </LinkExternal>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">Fee</span>
          {actualPool ? formatPoolFee(actualPool.fee) : '0%'}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">Network</span>
          Stellar
        </div>
        {isLoading ? (
          <>
            <div className="w-48">
              <SkeletonText />
            </div>
            <div className="w-48">
              <SkeletonText />
            </div>
          </>
        ) : actualPool ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">
                {actualPool.token0.code}
              </span>
              <LinkExternal
                target="_blank"
                href={getStellarContractLink(actualPool.token0.contract)}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${actualPool.token0.contract.slice(0, 6)}...${actualPool.token0.contract.slice(
                    -4,
                  )}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">
                {actualPool.token1.code}
              </span>
              <LinkExternal
                target="_blank"
                href={getStellarContractLink(actualPool.token1.contract)}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${actualPool.token1.contract.slice(0, 6)}...${actualPool.token1.contract.slice(
                    -4,
                  )}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
