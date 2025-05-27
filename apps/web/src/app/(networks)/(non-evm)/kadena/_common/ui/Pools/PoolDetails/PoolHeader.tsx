'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Currency,
  LinkExternal,
  SkeletonCircle,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { Icon } from '~kadena/_common/ui/General/Icon'

export const PoolHeader = ({
  poolId,
}: {
  poolId: string
}) => {
  const router = useRouter()

  const { data, isLoading } = usePoolById({
    poolId,
    first: 4,
  })
  console.log('poolheader usePoolById', data)

  const token0Name = data?.token0?.name
  const token1Name = data?.token1?.name
  const token0Symbol =
    token0Name === 'coin' ? 'KDA' : token0Name?.slice(0, 3).toUpperCase()
  const token1Symbol =
    token1Name === 'coin' ? 'KDA' : token1Name?.slice(0, 3).toUpperCase()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <button
          className="text-sm text-blue hover:underline w-fit"
          type="button"
          onClick={() => {
            router.back()
          }}
        >
          ← Back
        </button>
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
              <Icon
                currency={{
                  tokenSymbol: token0Symbol ?? '',
                  tokenName: token0Name ?? '',
                  tokenImage: '',
                }}
              />
              <Icon
                currency={{
                  tokenSymbol: token1Symbol ?? '',
                  tokenName: token1Name ?? '',
                  tokenImage: '',
                }}
              />
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
              <LinkExternal href={getChainwebAddressLink(data?.address ?? '')}>
                {token0Symbol}/{token1Symbol}
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
          <span className="font-semibold tracking-tighter">Fee</span>
          0.3%
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">Network</span>
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
              <span className="font-semibold tracking-tighter">
                {token0Symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getChainwebAddressLink(data?.token0?.name ?? '')}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token0Name}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tighter">
                {token1Symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getChainwebAddressLink(data?.token1?.name ?? '')}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token1Name}`}
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
