import type { PortfolioFuroClaim } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  FormattedNumber,
} from '@sushiswap/ui'
import type { FC } from 'react'
import React from 'react'
import { formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

interface PortfolioFuroClaimablesProps {
  claimables: PortfolioFuroClaim[]
}

export const PortfolioFuroClaimables: FC<PortfolioFuroClaimablesProps> = ({
  claimables,
}) => (
  <AccordionItem value="furo" className="!border-0">
    <AccordionTrigger
      chevronChildren={<span className="text-xs text-[#64748B]">Hide</span>}
      className="px-3 !py-2 text-xs text-[#64748B] hover:!no-underline [&[data-state=open]>div>span]:block [&[data-state=closed]>div>span]:hidden"
    >
      {`Furo Streaming (${claimables.length})`}
    </AccordionTrigger>
    <AccordionContent childClassName="!pb-0" className="cursor-default">
      {claimables.map(({ position, token }) => (
        <PortfolioInfoRow
          key={`${position.chainId}:${position.id}`}
          chainId={token.chainId as EvmChainId}
          href={`https://pay.sushi.com/${position.name.startsWith('Vesting') ? 'vesting' : 'stream'}/${
            position.chainId
          }:${position.positionId}`}
          icon={
            <img
              className="rounded-full"
              src={token.logoUrl}
              width={28}
              height={28}
              alt={token.symbol ?? token.name}
            />
          }
          leftContent={
            <React.Fragment>
              <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                {token.name}
              </div>
              <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
                {position.name.toUpperCase()}
              </div>
            </React.Fragment>
          }
          rightContent={
            <React.Fragment>
              <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                {formatUSD(token.amountUSD)}
              </div>
              <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
                <FormattedNumber number={token.amount.toString()} />{' '}
                {token.symbol}
              </div>
            </React.Fragment>
          }
        />
      ))}
    </AccordionContent>
  </AccordionItem>
)
