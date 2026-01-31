'use client'

import React, { type FC } from 'react'
import { Button, List } from '@sushiswap/ui'
import { ChainId, getChainById, shortenAddress } from 'sushi'
import { type EvmAddress } from 'sushi/evm'

export const RecipientSection: FC<{
  chainId: ChainId
  recipient?: string | null
}> = ({ chainId, recipient }) => {
  if (!recipient) return null

  return (
    <List className="!pt-0">
      <List.Control>
        <List.KeyValue title="Recipient">
          <Button variant="link" size="sm" asChild>
            <a
              target="_blank"
              href={
                getChainById(chainId).getAccountUrl(recipient as EvmAddress) ?? '#'
              }
              rel="noreferrer"
            >
              {shortenAddress(recipient)}
            </a>
          </Button>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}
