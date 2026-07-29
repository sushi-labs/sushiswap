'use client'

import { Button, List, classNames } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { type ChainId, getChainById, shortenAddress } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { SimpleSwapTradeReviewDialogVariant } from '../simple-swap-trade-review-dialog'

export const RecipientSection: FC<{
  chainId: ChainId
  recipient?: string | null
  variant: SimpleSwapTradeReviewDialogVariant
}> = ({ chainId, recipient, variant }) => {
  if (!recipient) return null

  return (
    <List className="!pt-0">
      <List.Control
        className={classNames(
          variant === 'perps' && '!border-white/[0.06] !bg-white/[0.025]',
        )}
      >
        <List.KeyValue title="Recipient">
          <Button variant="link" size="sm" asChild>
            <a
              target="_blank"
              href={
                getChainById(chainId).getAccountUrl(recipient as EvmAddress) ??
                '#'
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
