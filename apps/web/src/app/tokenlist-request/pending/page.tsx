import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import {
  PendingTokens,
  getPendingTokens,
} from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import {
  Button,
  Container,
  LinkExternal,
  LinkInternal,
  typographyVariants,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { unstable_cache } from 'next/cache'
import React from 'react'
import { Chain, formatUSD, shortenAddress } from 'sushi'

const XIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="hugeicons:new-twitter">
      <path
        id="Vector"
        d="M2.5 17.5L8.79 11.21M8.79 11.21L2.5 2.5H6.66667L11.21 8.79M8.79 11.21L13.3333 17.5H17.5L11.21 8.79M17.5 2.5L11.21 8.79"
        stroke="#F2F3F6"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
)

export default async function PendingTokenListingPage() {
  const pendingTokens = (await unstable_cache(
    async () => await getPendingTokens(),
    ['pending-tokens'],
    {
      revalidate: 60,
    },
  )()) as PendingTokens
  return (
    <>
      <div className="max-w-6xl px-4 py-16 mx-auto">
        <div className="pb-3">
          <LinkInternal
            href={'/tokenlist-request'}
            className="text-sm text-blue hover:under line"
          >
            ← Token Listing
          </LinkInternal>
        </div>
        <div>
          <h1 className={typographyVariants({ variant: 'h1' })}>
            Pending List
          </h1>
          <p
            className={typographyVariants({
              variant: 'lead',
              className: 'max-w-[800px]',
            })}
          >
            Tokens not approved will be deleted after 7 days. You may resubmit
            later if there is meaningful progress. Approvals are not guaranteed.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
        <Container maxWidth="6xl" className="px-4 py-10">
          <div className="border rounded-lg bg-slate-900 border-white/10">
            {/* Header Row */}
            <div className="grid grid-cols-7 border-b border-white/5">
              <div className="px-4 pt-2 text-left" key={'Logo'}>
                <span className="text-xs font-medium text-slate-400">Logo</span>
              </div>
              {[
                'Token',
                'Tweet',
                'Market Cap.',
                'Daily Volume',
                'In Queue',
                'Holders',
              ].map((label) => (
                <div className="px-2 py-2 text-center" key={label}>
                  <span className="text-xs font-medium text-slate-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {pendingTokens.length ? (
              pendingTokens.map((pending, index) => (
                <div
                  className="grid items-center grid-cols-7 border-b border-white/5"
                  key={index}
                >
                  <div className="flex p-4 text-left">
                    <div className="flex items-center py-4">
                      <div className="relative">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={pending.logoUrl}
                          alt={pending.token.address}
                        />
                        <div
                          className="absolute bottom-0 right-0"
                          style={{ width: '10px', height: '10px' }}
                        >
                          <NetworkIcon
                            chainId={pending.token.chainId}
                            width={14}
                            height={14}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">{pending.token.name} </span>
                    <span className="text-sm text-slate-400">
                      ({pending.token.symbol})
                    </span>
                    <LinkExternal
                      target="_blank"
                      href={Chain.from(pending.token.chainId)?.getTokenUrl(
                        pending.token.address,
                      )}
                    >
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="!font-medium !text-secondary-foreground"
                      >
                        {shortenAddress(pending.token.address, 4)}
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                      </Button>
                    </LinkExternal>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">
                      {pending.tweetUrl ? (
                        <LinkExternal href={pending.tweetUrl}>
                          <XIcon />
                        </LinkExternal>
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">
                      {formatUSD(pending.metrics.marketcapUSD)}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">
                      {formatUSD(pending.metrics.volumeUSD24h)}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(pending.createdAt * 1000).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{' '}
                      Days
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm">{pending.metrics.holders}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <span className="text-sm">No pending tokens</span>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
