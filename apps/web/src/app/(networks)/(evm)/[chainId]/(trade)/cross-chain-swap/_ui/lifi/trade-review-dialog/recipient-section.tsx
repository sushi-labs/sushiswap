'use client'

import { List } from '@sushiswap/ui'
import { getChainById, shortenAddress } from 'sushi'
import { useLifiXSwap } from '../xswap-provider'

export function RecipientSection() {
  const {
    state: { chainId1, recipient },
  } = useLifiXSwap()

  if (!recipient) return null

  return (
    <List className="!pt-2">
      <List.Control>
        <List.KeyValue title="Recipient">
          <a
            target="_blank"
            href={getChainById(chainId1).getAccountUrl(recipient)}
            className="flex items-center gap-2 cursor-pointer text-blue"
            rel="noreferrer"
          >
            {shortenAddress(recipient)}
          </a>
        </List.KeyValue>
      </List.Control>
    </List>
  )
}
