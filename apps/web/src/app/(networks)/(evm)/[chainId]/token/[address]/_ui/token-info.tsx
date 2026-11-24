import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import type { TokenInfo as TokenInfoType } from '@sushiswap/graph-client/data-api'
import { Card, CardContent, CardHeader, LinkExternal } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { getSafeExternalUrl } from 'src/lib/safe-external-url'
import { sanitizeTokenDescriptionHtml } from 'src/lib/sanitize-html'
import { type EvmToken, getEvmChainById } from 'sushi/evm'
import { TokenCollapsedDescription } from './token-collapsed-description'

interface TokenInfoProps {
  token: EvmToken
  tokenInfo: TokenInfoType
}

export function TokenInfo({ token, tokenInfo }: TokenInfoProps): ReactElement {
  // Token metadata is issuer-controlled: only allow http(s) links,
  // and sanitize the description on the server before it reaches the client.
  const websiteUrl = getSafeExternalUrl(tokenInfo?.website)
  const description = tokenInfo?.description
    ? sanitizeTokenDescriptionHtml(tokenInfo.description)
    : undefined
  const links = [
    {
      label: 'Explorer',
      href: getEvmChainById(token.chainId).getTokenUrl(token.address),
    },
    { label: 'Website', href: websiteUrl },
    {
      label: 'Twitter',
      href: tokenInfo?.twitter
        ? `https://twitter.com/${tokenInfo.twitter}`
        : undefined,
    },
    {
      label: 'Telegram',
      href: tokenInfo?.telegram
        ? `https://t.me/${tokenInfo.telegram}`
        : undefined,
    },
    {
      label: 'Discord',
      href: tokenInfo?.discord
        ? `https://discord.com/${tokenInfo.discord}`
        : undefined,
    },
  ]

  return (
    <Card>
      <CardHeader className="!p-4 sm:!p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h2 className="break-words text-lg font-semibold tracking-tight">
            About {token.name}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {links.map(({ label, href }) =>
              href ? (
                <LinkExternal key={label} href={href}>
                  <span className="inline-flex items-center gap-1 text-sm">
                    {label}
                    <ArrowTopRightOnSquareIcon
                      aria-hidden="true"
                      className="size-3"
                    />
                  </span>
                </LinkExternal>
              ) : null,
            )}
          </div>
        </div>
      </CardHeader>
      {description ? (
        <CardContent className="!px-4 !pb-4 sm:!px-6 sm:!pb-6">
          <TokenCollapsedDescription description={description} />
        </CardContent>
      ) : null}
    </Card>
  )
}
