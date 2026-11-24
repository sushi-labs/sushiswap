import {
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/20/solid'
import {
  Button,
  ClipboardController,
  Currency,
  LinkExternal,
  LinkInternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { shortenAddress } from 'sushi'
import { type EvmToken, getEvmChainById } from 'sushi/evm'

export function TokenHeader({ token }: { token: EvmToken }): ReactElement {
  const chain = getEvmChainById(token.chainId)

  return (
    <header className="flex flex-col gap-4">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 break-all text-sm text-muted-foreground"
      >
        <LinkInternal href="/" className="hover:text-pink hover:underline">
          Home
        </LinkInternal>
        <ChevronRightIcon aria-hidden="true" className="size-4" />
        <LinkInternal
          href={`/${chain.key}/explore/tokens`}
          className="hover:text-pink hover:underline"
        >
          Explore
        </LinkInternal>
        <ChevronRightIcon aria-hidden="true" className="size-4" />
        <LinkInternal
          href={`/${chain.key}/token/${token.address}`}
          aria-current="page"
          className="font-medium text-primary hover:text-pink hover:underline"
        >
          {token.symbol}
        </LinkInternal>
      </nav>
      <div className="flex items-start gap-3">
        <Currency.Icon currency={token} width={36} height={36} />
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="break-words text-2xl font-medium md:text-4xl">
            {token.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="break-all font-medium">{token.symbol}</span>
            <LinkExternal href={chain.getTokenUrl(token.address)}>
              <span className="inline-flex items-center gap-1">
                {shortenAddress(token.address)}
                <ArrowTopRightOnSquareIcon
                  aria-hidden="true"
                  className="size-3"
                />
              </span>
            </LinkExternal>
            <ClipboardController hideTooltip>
              {({ setCopied }) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        size="xs"
                        aria-label="Copy address"
                        onClick={() => setCopied(token.address)}
                      >
                        <DocumentDuplicateIcon
                          aria-hidden="true"
                          className="size-4"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Copy address</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </ClipboardController>
          </div>
        </div>
      </div>
    </header>
  )
}
