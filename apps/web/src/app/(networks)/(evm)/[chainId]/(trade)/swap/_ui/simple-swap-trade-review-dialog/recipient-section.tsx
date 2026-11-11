'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button, List } from '@sushiswap/ui'
import type { FC } from 'react'
import { type ChainId, getChainById, shortenAddress } from 'sushi'
import type { EvmAddress } from 'sushi/evm'

export const RecipientSection: FC<{
  chainId: ChainId
  recipient?: string | null
}> = ({ chainId, recipient }) => {
  if (!recipient) return null

  return (
    <List.KeyValue
      fontWeight="normal"
      title={<div className="text-muted-foreground">Recipient</div>}
      className="!px-0"
    >
      <Button variant="link" size="sm" asChild>
        <a
          target="_blank"
          href={
            getChainById(chainId).getAccountUrl(recipient as EvmAddress) ?? '#'
          }
          rel="noreferrer"
          className="font-normal flex items-center gap-1"
        >
          {shortenAddress(recipient)}
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      </Button>
    </List.KeyValue>
  )
}
