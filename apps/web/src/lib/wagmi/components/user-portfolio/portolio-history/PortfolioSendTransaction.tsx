import { ArrowUpIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { PortfolioTransaction } from '@sushiswap/graph-client/data-api'
import { ClipboardController, FormattedNumber, IconButton } from '@sushiswap/ui'
import { format, fromUnixTime } from 'date-fns'
import { FC } from 'react'
import React from 'react'
import { EvmChain, EvmChainId } from 'sushi/chain'
import { shortenHash } from 'sushi/format'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

export const PortfolioSendTransaction: FC<{ tx: PortfolioTransaction }> = ({
  tx,
}) => {
  return (
    <PortfolioInfoRow
      chainId={tx.chainId as EvmChainId}
      href={EvmChain.from(tx.chainId)?.getTxUrl(tx.txHash)}
      externalLink
      icon={
        <div className="p-1.5 bg-[#64748B] rounded-full w-7 h-7">
          <ArrowUpIcon className="stroke-2 text-white" />
        </div>
      }
      leftContent={
        <React.Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            Send
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
                <div>
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
