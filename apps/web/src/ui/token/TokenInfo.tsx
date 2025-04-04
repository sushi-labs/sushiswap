import { LinkIcon } from '@heroicons/react/24/outline'
import type { TokenInfo as TokenInfoType } from '@sushiswap/graph-client/data-api'
import { LinkExternal } from '@sushiswap/ui'
import type { FC } from 'react'
import { EvmChain } from 'sushi/chain'
import type { Token } from 'sushi/currency'
import { TokenCollapsedDescription } from './TokenCollapsedDescription'

interface TokenInfoProps {
  token: Token
  tokenInfo: TokenInfoType
}

export const TokenInfo: FC<TokenInfoProps> = ({ token, tokenInfo }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium">About {token.name}</span>

        <div className="flex items-center gap-4">
          <LinkExternal
            href={EvmChain.tokenUrl(token.chainId, token.address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-1 text-blue-500 hover:underline">
              <span className="text-sm">Explorer</span>
              <LinkIcon width={16} height={16} />
            </div>
          </LinkExternal>
          {tokenInfo?.website ? (
            <LinkExternal
              href={tokenInfo.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-1 text-blue-500 hover:underline">
                <span className="text-sm">Website</span>
                <LinkIcon width={16} height={16} />
              </div>
            </LinkExternal>
          ) : null}
          {tokenInfo?.twitter ? (
            <LinkExternal
              href={`https://twitter.com/${tokenInfo.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-1 text-blue-500 hover:underline">
                <span className="text-sm">Twitter</span>
                <LinkIcon width={16} height={16} />
              </div>
            </LinkExternal>
          ) : null}
          {tokenInfo?.telegram ? (
            <LinkExternal
              href={`https://t.me/${tokenInfo.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-1 text-blue-500 hover:underline">
                <span className="text-sm">Telegram</span>
                <LinkIcon width={16} height={16} />
              </div>
            </LinkExternal>
          ) : null}
          {tokenInfo?.discord ? (
            <LinkExternal
              href={`https://discord.com/${tokenInfo.discord}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-1 text-blue-500 hover:underline">
                <span className="text-sm">Discord</span>
                <LinkIcon width={16} height={16} />
              </div>
            </LinkExternal>
          ) : null}
        </div>
      </div>
      {tokenInfo?.description ? (
        <TokenCollapsedDescription description={tokenInfo.description} />
      ) : null}
    </div>
  )
}
