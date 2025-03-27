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
import { useEffect, useState } from 'react'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { Icon } from '~kadena/_common/ui/General/Icon'
import { MOCK_TOKEN_1, MOCK_TOKEN_2 } from '../PositionsTable/PositionsTable'

export const PoolHeader = ({
  token0: _token0,
  token1: _token1,
  pairAddress,
  backUrl,
}: {
  token0: string
  token1: string
  pairAddress: string
  backUrl: string
}) => {
  const token0 = MOCK_TOKEN_1
  const token1 = MOCK_TOKEN_2
  const [isLoadingToken0, setIsLoadingToken0] = useState(true)
  const [isLoadingToken1, setIsLoadingToken1] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingToken0(false)
      setIsLoadingToken1(false)
    }, 1200)
  }, [])

  const isLoading = isLoadingToken0 || isLoadingToken1

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
        ) : (
          <div className="relative flex items-center gap-3 max-w-[100vh]">
            <Currency.IconList iconWidth={36} iconHeight={36}>
              <Icon currency={token0} />
              <Icon currency={token1} />
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
              <LinkExternal href={getChainwebAddressLink(pairAddress)}>
                {token0?.symbol}/{token1?.symbol}
              </LinkExternal>
            </Button>
            {/* <div className="bg-pink/20 text-pink text-sm px-2 py-1 font-semibold rounded-full mt-0.5">
              V2
            </div> */}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">Fee</span>
          0.3%
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">Network</span>
          Kadena
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
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">
                {token0?.symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getChainwebAddressLink(token0?.address)}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token0?.address.slice(0, 6)}...${token0?.address.slice(
                    -4,
                  )}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="tracking-tighter font-semibold">
                {token1?.symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getChainwebAddressLink(token1?.address)}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token1?.address.slice(0, 6)}...${token1?.address.slice(
                    -4,
                  )}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
