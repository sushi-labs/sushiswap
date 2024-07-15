import { Square2StackIcon } from '@heroicons/react/24/outline'
import { PortfolioTransaction } from '@sushiswap/graph-client/data-api'
import { ClipboardController, FormattedNumber } from '@sushiswap/ui'
import { format, fromUnixTime } from 'date-fns'
import React from 'react'
import { FC } from 'react'
import { ChainId } from 'sushi/chain'
import { shortenHash } from 'sushi/format'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

export const PortfolioOtherTransaction: FC<{ tx: PortfolioTransaction }> = ({
  tx,
}) => {
  return (
    <PortfolioInfoRow
      id={`${tx.chainId}:${tx.txHash}`}
      chainId={tx.chainId as ChainId}
      icon={
        <img
          className="rounded-full"
          src={tx.protocolLogo}
          width={28}
          height={28}
          alt={tx.projectName}
        />
      }
      leftContent={
        <React.Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            {tx.functionName}
          </div>
          <ClipboardController hideTooltip>
            {({ setCopied }) => (
              <div
                onClick={() => setCopied(tx.txHash)}
                onKeyDown={() => setCopied(tx.txHash)}
                className="flex items-center gap-x-1 text-xs text-muted-foreground cursor-pointer"
              >
                TxHash: {shortenHash(tx.txHash)}
                <Square2StackIcon className="w-3 h-3" />
              </div>
            )}
          </ClipboardController>
        </React.Fragment>
      }
      rightContent={
        tx.sends.length ? (
          <React.Fragment>
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
            <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
              {format(fromUnixTime(tx.timestamp), 'yyyy/MM/dd HH:mm')}
            </div>
          </React.Fragment>
        ) : tx.receives.length ? (
          <React.Fragment>
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
            <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
              {format(fromUnixTime(tx.timestamp), 'yyyy/MM/dd HH:mm')}
            </div>
          </React.Fragment>
        ) : null
      }
    />
  )
}
