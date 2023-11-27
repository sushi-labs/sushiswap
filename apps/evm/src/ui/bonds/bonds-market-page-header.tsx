'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Currency, LinkInternal } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { Button, LinkExternal, typographyVariants } from '@sushiswap/ui'
import { formatDistance } from 'date-fns'
import { shortenAddress } from 'sushi'
import { Chain, ChainId } from 'sushi/chain'
import { SUSHI, USDC, tryParseAmount } from 'sushi/currency'
import { AuctionType } from './table-filters-auction-type'

export const MOCK_DATA = {
  chainId: ChainId.POLYGON,
  auctionType: AuctionType.Dynamic,
  discount: '28.91%',
  cliff: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  ends: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  bondAsset: SUSHI[ChainId.POLYGON],
  payoutAsset: USDC[ChainId.POLYGON],
  issuer: 'Sushi',
  issuerLink: 'https://sushi.com',
  totalBondedValue: 234244.13,
  bondPrice: 1.13,
  marketPrice: 1.53,
  maxPayout: tryParseAmount('24324.13', USDC[ChainId.POLYGON]),
  remainingCapacity: tryParseAmount('5423231.56', SUSHI[ChainId.POLYGON]),
}

export const BondsMarketPageHeader = () => {
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
          <Currency.Icon
            width={36}
            height={36}
            currency={MOCK_DATA.bondAsset}
          />
          <LinkExternal
            target="_blank"
            href={Chain.from(MOCK_DATA.bondAsset.chainId)?.getTokenUrl(
              MOCK_DATA.bondAsset.wrapped.address,
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
              {MOCK_DATA.bondAsset.symbol}:
            </Button>
          </LinkExternal>
          <Currency.Icon
            width={36}
            height={36}
            currency={MOCK_DATA.payoutAsset}
          />
          <LinkExternal
            target="_blank"
            href={Chain.from(MOCK_DATA.bondAsset.chainId)?.getTokenUrl(
              MOCK_DATA.bondAsset.wrapped.address,
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
              {MOCK_DATA.payoutAsset.symbol}
            </Button>
          </LinkExternal>
          <div
            className={classNames(
              MOCK_DATA.auctionType === AuctionType.Dynamic
                ? 'bg-blue/20 text-blue'
                : 'bg-green/20 text-green',
              'text-sm px-2 py-1 font-semibold rounded-full mt-0.5',
            )}
          >
            {MOCK_DATA.auctionType === AuctionType.Dynamic
              ? 'Dynamic'
              : 'Static'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-5 text-secondary-foreground mb-8 mt-1.5">
        <div className="flex flex-wrap gap-x-[32px]">
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Discount</span>
            <span
              className={classNames(
                MOCK_DATA.bondPrice > 0
                  ? 'text-green'
                  : MOCK_DATA.bondPrice < 0
                  ? 'text-red'
                  : '',
                'underline decoration-dotted underline-offset-2',
              )}
            >
              {MOCK_DATA.discount}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Cliff</span>
            {formatDistance(MOCK_DATA.cliff, new Date(), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Ends</span>
            {formatDistance(MOCK_DATA.ends, new Date(), { addSuffix: true })}
          </div>
        </div>
        <div className="flex gap-x-[32px]">
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Network</span>
            {Chain.from(MOCK_DATA.chainId)?.name}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {MOCK_DATA.payoutAsset.symbol}
            </span>
            <LinkExternal
              href={Chain.from(MOCK_DATA.chainId)?.getTokenUrl(
                MOCK_DATA.payoutAsset.wrapped.address,
              )}
            >
              <Button
                asChild
                variant="link"
                size="md"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(MOCK_DATA.payoutAsset.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">
              {MOCK_DATA.bondAsset.symbol}
            </span>
            <LinkExternal
              target="_blank"
              href={Chain.from(MOCK_DATA.bondAsset.chainId)?.getTokenUrl(
                MOCK_DATA.bondAsset.wrapped.address,
              )}
            >
              <Button
                asChild
                size="md"
                variant="link"
                className="!font-medium !text-secondary-foreground"
              >
                {shortenAddress(MOCK_DATA.bondAsset.wrapped.address, 4)}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tighter font-semibold">Issuer</span>
            <LinkExternal target="_blank" href={MOCK_DATA.issuerLink}>
              <Button
                asChild
                size="md"
                variant="link"
                className="!font-medium !text-secondary-foreground"
              >
                {MOCK_DATA.issuer}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
          </div>
        </div>
      </div>
    </div>
  )
}
