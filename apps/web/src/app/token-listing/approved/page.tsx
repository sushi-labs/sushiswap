import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  ApprovedCommunityTokens,
  getApprovedCommunityTokens,
} from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import {
  Button,
  Container,
  LinkExternal,
  typographyVariants,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { unstable_cache } from 'next/cache'
import { Chain } from 'sushi'

export default async function ApprovedTokensPage() {
  const approvedTokens = (await unstable_cache(
    async () => await getApprovedCommunityTokens(),
    ['approved-community-tokens'],
    {
      revalidate: 60,
    },
  )()) as ApprovedCommunityTokens
  return (
    <>
      <div className="max-w-5xl px-4 py-16 mx-auto">
        <div className="flex flex-col">
          <h1 className={typographyVariants({ variant: 'h1' })}>
            Approved List
          </h1>
          <p
            className={typographyVariants({
              variant: 'lead',
              className: 'max-w-[800px]',
            })}
          >
            Approved community tokens.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
        <Container maxWidth="5xl" className="px-4 py-10">
          <div className="px-4 border rounded-lg bg-slate-900 border-white/10">
            {/* Header Row */}
            <div
              className="grid grid-cols-4 border-b border-white/5"
              style={{ gridTemplateColumns: '0.5fr 1fr 1fr 3fr' }} // Adjusted to ensure alignment with data rows
            >
              {['', 'Token', 'Symbol', 'Address'].map((label) => (
                <div className="py-2 text-left" key={label}>
                  {' '}
                  {/* Left-aligned text */}
                  <span className="text-xs font-medium text-slate-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {approvedTokens.length ? (
              approvedTokens.map((token, index) => (
                <div
                  className="grid items-center grid-cols-4 border-b border-white/5"
                  style={{ gridTemplateColumns: '0.5fr 1fr 1fr 3fr' }} // Matching header layout
                  key={index}
                >
                  <div className="flex items-center py-4">
                    <div className="relative">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={token.logoUrl}
                        alt={token.address}
                      />
                      <div
                        className="absolute bottom-0 right-0"
                        style={{ width: '10px', height: '10px' }}
                      >
                        <NetworkIcon
                          chainId={token.chainId}
                          width={14}
                          height={14}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start py-4">
                    <span>{token.name}</span>
                  </div>

                  <div className="flex justify-start py-4">
                    <span>{token.symbol}</span>
                  </div>

                  <div className="flex justify-start py-4">
                    <span>
                      <LinkExternal
                        target="_blank"
                        href={Chain.from(token.chainId)?.getTokenUrl(
                          token.address,
                        )}
                      >
                        <Button
                          asChild
                          variant="link"
                          size="sm"
                          className="!font-medium !text-secondary-foreground"
                        >
                          {/* {shortenAddress(token.address, 4)}  // TODO: Shorten on mobile?*/}
                          {token.address}
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </Button>
                      </LinkExternal>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center">No approved tokens</div>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
