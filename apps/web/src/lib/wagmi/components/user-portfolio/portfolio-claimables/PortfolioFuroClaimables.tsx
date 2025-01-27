import { PortfolioFuroClaim } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  FormattedNumber,
} from '@sushiswap/ui'
import { FC } from 'react'
import React from 'react'
import { EvmChainId } from 'sushi/chain'
import { formatUSD } from 'sushi/format'
import { PortfolioInfoRow } from '../PortfolioInfoRow'

interface PortfolioFuroClaimablesProps {
  claimables: PortfolioFuroClaim[]
}

export const PortfolioFuroClaimables: FC<PortfolioFuroClaimablesProps> = ({
  claimables,
}) => (
  <AccordionItem value="furo" className="!border-0">
    <AccordionTrigger className="px-5 underline-offset-2">
      {`Furo Streaming (${claimables.length})`}
    </AccordionTrigger>
    <AccordionContent className="cursor-default">
      {claimables.map(({ position, token }) => (
        <PortfolioInfoRow
          key={`${position.chainId}:${position.id}`}
          chainId={token.chainId as EvmChainId}
          href={`https://pay.sushi.com/${
            position.name.startsWith('Vesting') ? 'vesting' : 'stream'
          }/${position.chainId}:${position.positionId}`}
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
