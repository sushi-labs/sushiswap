import { GlobeAltIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import type { PortfolioTransaction } from '@sushiswap/graph-client/data-api'
import { ClipboardController, FormattedNumber, IconButton } from '@sushiswap/ui'
import { SushiLiteIcon } from '@sushiswap/ui/icons/SushiLiteIcon'
import { format, fromUnixTime } from 'date-fns'
import React, { type FC } from 'react'
import { type EvmChainId, getEvmChainById, shortenHash } from 'sushi/evm'
import type { Hex } from 'viem'
import { PortfolioInfoRow } from '../portfolio-info-row'

export const PortfolioOtherTransaction: FC<{ tx: PortfolioTransaction }> = ({
  tx,
}) => {
  return (
    <PortfolioInfoRow
      chainId={tx.chainId as EvmChainId}
      href={getEvmChainById(tx.chainId as EvmChainId).getTransactionUrl(
        tx.txHash as Hex,
      )}
      externalLink
      icon={
        tx.projectName.toLowerCase().includes('sushi') ? (
          <div className="p-1.5 bg-gradient-to-r from-[rgba(12,116,183,0.3)] to-[rgba(174,46,141,0.3)] rounded-full w-7 h-7">
            <SushiLiteIcon className="text-white" />
          </div>
        ) : (
          <div className="p-1.5 bg-[#64748B] rounded-full w-7 h-7">
            <GlobeAltIcon className="stroke-2 text-white" />
          </div>
        )
      }
      leftContent={
        <React.Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {tx.functionName}
          </div>
          <ClipboardController>
            {({ setCopied, isCopied }) => (
              <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                TxHash: {shortenHash(tx.txHash)}
                <IconButton
                  icon={Square2StackIcon}
                  name={'Copy'}
                  variant={'ghost'}
                  className="!w-3 !h-3 !min-w-[unset] !min-h-[unset]"
                  description={isCopied ? 'Copied!' : 'Copy Transaction Hash'}
                  onClick={(e) => {
                    e.preventDefault()
                    setCopied(tx.txHash)
                  }}
                />
              </div>
            )}
          </ClipboardController>
        </React.Fragment>
      }
      rightContent={
        <React.Fragment>
          {tx.sends.length ? (
            <div className="text-sm font-medium flex justify-end items-center gap-x-1 overflow-hidden">
              {tx.sends[0].logoUrl ? (
                <div className="shrink-0">
                  <img
                    className="rounded-full"
                    src={tx.sends[0].logoUrl}
                    width={16}
                    height={16}
                    alt={tx.sends[0].symbol}
                  />
                </div>
              ) : null}

              <span className="overflow-hidden overflow-ellipsis">
                {'-'}
                <FormattedNumber number={tx.sends[0].amount.toString()} />{' '}
                {tx.sends[0].symbol}
              </span>
            </div>
          ) : tx.receives.length ? (
            <div className="text-sm font-medium flex justify-end items-center gap-x-1 overflow-hidden">
              {tx.receives[0].logoUrl ? (
                <div className="shrink-0">
                  <img
                    className="rounded-full"
                    src={tx.receives[0].logoUrl}
                    width={16}
                    height={16}
                    alt={tx.receives[0].symbol}
                  />
                </div>
              ) : null}

              <span className="overflow-hidden overflow-ellipsis">
                <FormattedNumber number={tx.receives[0].amount.toString()} />{' '}
                {tx.receives[0].symbol}
              </span>
            </div>
          ) : (
            <div className="h-5" />
          )}
          <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
            {format(fromUnixTime(tx.timestamp), 'yyyy/MM/dd HH:mm')}
          </div>
        </React.Fragment>
      }
    />
  )
}
