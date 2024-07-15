import { ArrowDownIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { PortfolioTransaction } from '@sushiswap/graph-client/data-api'
import { ClipboardController, FormattedNumber } from '@sushiswap/ui'
import { format, fromUnixTime } from 'date-fns'
import { FC } from 'react'
import React from 'react'
import { ChainId } from 'sushi/chain'
import { shortenHash } from 'sushi/format'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

export const PortfolioReceiveTransaction: FC<{ tx: PortfolioTransaction }> = ({
  tx,
}) => {
  return (
    <PortfolioInfoRow
      id={`${tx.chainId}:${tx.txHash}`}
      chainId={tx.chainId as ChainId}
      icon={
        <div className="p-1.5 border border-primary rounded-full w-7 h-7">
          <ArrowDownIcon className="stroke-2" />
        </div>
      }
      leftContent={
        <React.Fragment>
          <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
            Receive
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
        tx.receives.length ? (
          <React.Fragment>
            <div className="text-sm font-medium flex justify-end items-center gap-x-1 overflow-hidden">
              {tx.receives[0].logoUrl ? (
                <div>
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

    // <div
    //   id={}
    //   className="flex justify-between items-center hover:bg-muted px-5 py-3 gap-x-4"
    // >
    //   <div className="flex gap-x-4 items-center whitespace-nowrap overflow-hidden">
    //     <div className="flex-shrink-0">
    //       <Badge
    //         className="border-1 border-background bg-background rounded-full"
    //         position="bottom-right"
    //         badgeContent={
    //           <NetworkIcon chainId={tx.chainId} width={14} height={14} />
    //         }
    //       >
    //         <ArrowDownCircleIcon width={28} height={28} />
    //       </Badge>
    //     </div>
    //     <div className="overflow-hidden flex flex-col gap-y-1">
    //       <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
    //         Receive
    //       </div>
    //       <div className="text-muted-foreground text-xs">
    //         TxHash: {shortenHash(tx.txHash)}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="text-right">
    //     <div className="text-sm font-medium flex gap-x-1 items-center">
    //       <div>
    //         <img
    //           src={tx.receives[0].logoUrl}
    //           width={16}
    //           height={16}
    //           alt={tx.receives[0].symbol}
    //         />
    //       </div>
    //       <span>
    //         <FormattedNumber number={tx.receives[0].amount.toString()} />{' '}
    //         {tx.receives[0].symbol}
    //       </span>
    //     </div>
    //     <div className="text-xs">...</div>
    //   </div>
    // </div>
  )
}
