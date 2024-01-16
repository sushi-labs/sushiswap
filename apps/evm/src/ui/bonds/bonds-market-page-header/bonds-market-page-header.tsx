import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { AuctionType, MarketId, getCliffTimestamp } from '@sushiswap/bonds-sdk'
import { getBond } from '@sushiswap/client'
import { Currency, LinkInternal } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { Button, LinkExternal, typographyVariants } from '@sushiswap/ui'
import { formatDistance } from 'date-fns'
import { shortenAddress } from 'sushi'
import { Chain } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { BondsMarketPageHeaderDiscount } from './bonds-market-page-header-discount'

export const BondsMarketPageHeader = async ({ id }: { id: MarketId }) => {
  const bond = await getBond({
    marketId: id,
  })

  const quoteToken = new Token(bond.quoteToken)
  const payoutToken = new Token(bond.payoutToken)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <LinkInternal
          href="/bonds"
          className="text-blue hover:underline text-sm"
        >
          ← Bonds
        </LinkInternal>
        <div className="relative flex items-center gap-3 max-w-[100vh]">
          <Currency.Icon width={36} height={36} currency={quoteToken} />
          <LinkExternal
            target="_blank"
            href={Chain.from(quoteToken.chainId)?.getTokenUrl(
              quoteToken.wrapped.address,
            )}
          >
            <Button
              asChild
              variant="link"
              className={typographyVariants({
                variant: 'h1',
                className:
                  'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
              })}
            >
              {quoteToken.symbol}:
            </Button>
          </LinkExternal>
          <Currency.Icon width={36} height={36} currency={payoutToken} />
          <LinkExternal
            target="_blank"
            href={Chain.from(payoutToken.chainId)?.getTokenUrl(
              payoutToken.wrapped.address,
            )}
          >
            <Button
              asChild
              variant="link"
              className={typographyVariants({
                variant: 'h1',
                className:
                  'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
              })}
            >
              {payoutToken.symbol}
            </Button>
          </LinkExternal>
          <div
            className={classNames(
              bond.auctionType === AuctionType.Dynamic
                ? 'bg-blue/20 text-blue'
                : 'bg-green/20 text-green',
              'text-sm px-2 py-1 font-semibold rounded-full mt-0.5',
            )}
          >
            {bond.auctionType === AuctionType.Dynamic ? 'Dynamic' : 'Static'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-5 text-secondary-foreground mb-8 mt-1.5">
        <div className="flex flex-wrap gap-x-[32px]">
          <BondsMarketPageHeaderDiscount bond={bond} />
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Cliff</span>
            {formatDistance(
              getCliffTimestamp({
                vestingLength: bond.vesting,
                vestingType: bond.vestingType,
              }) * 1000,
              Date.now(),
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {bond.end * 1000 < Date.now() ? 'Ended' : 'Ends'}
            </span>
            {formatDistance(bond.end * 1000, new Date(), { addSuffix: true })}
          </div>
        </div>
        <div className="flex gap-x-[32px]">
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Network</span>
            {Chain.from(bond.chainId)?.name}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {payoutToken.symbol}
            </span>
            <LinkExternal
              href={Chain.from(bond.chainId)?.getTokenUrl(
                payoutToken.wrapped.address,
              )}
            >
              <Button
                asChild
                variant="link"
                size="md"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(payoutToken.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {quoteToken.symbol}
            </span>
            <LinkExternal
              target="_blank"
              href={Chain.from(quoteToken.chainId)?.getTokenUrl(
                quoteToken.wrapped.address,
              )}
            >
              <Button
                asChild
                size="md"
                variant="link"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(quoteToken.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Issuer</span>
            {bond.issuer ? (
              <LinkExternal target="_blank" href={bond.issuer.link}>
                <Button
                  asChild
                  size="md"
                  variant="link"
                  className="!font-medium !text-secondary-foreground"
                >
                  {bond.issuer.name}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            ) : (
              <div className="text-secondary-foreground">Unknown</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
