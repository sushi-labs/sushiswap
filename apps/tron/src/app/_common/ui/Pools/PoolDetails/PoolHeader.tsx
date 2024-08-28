import {
  Button,
  Currency,
  LinkExternal,
  SkeletonCircle,
  SkeletonText,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import { IToken } from '~tron/_common/types/token-type'
import { Icon } from '~tron/_common/ui/General/Icon'

export const PoolHeader = ({
  token0,
  token1,
  isLoading,
  pairAddress,
}: {
  token0: IToken | undefined
  token1: IToken | undefined
  isLoading: boolean
  pairAddress: string
}) => {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex gap-2 items-center">
        <Currency.IconList iconWidth={36} iconHeight={36}>
          {isLoading ? (
            <SkeletonCircle radius={36} />
          ) : (
            <Icon currency={token0} />
          )}
          {isLoading ? (
            <SkeletonCircle radius={36} />
          ) : (
            <Icon currency={token1} />
          )}
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
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="flex gap-2">
                <SkeletonText fontSize="lg" className="!w-16 !h-14" />
                /
                <SkeletonText fontSize="lg" className="!w-16 !h-14" />
              </div>
            ) : (
              <LinkExternal
                className="flex flex-col !no-underline group"
                href={`https://tronscan.org/#/token20/${pairAddress}`}
              >
                {token0?.symbol} / {token1?.symbol}
              </LinkExternal>
            )}
            <div
              className={classNames(
                'bg-pink/20 text-pink',
                'text-sm px-2 py-1 font-semibold rounded-full mt-0.5',
              )}
            >
              V2
            </div>
          </div>
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="tracking-tighter font-semibold">Network</span>
        Tron
      </div>
    </div>
  )
}
