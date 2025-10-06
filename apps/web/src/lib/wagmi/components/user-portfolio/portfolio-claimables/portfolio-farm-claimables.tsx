import type { PortfolioFarmClaim } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  FormattedNumber,
} from '@sushiswap/ui'
import type { FC } from 'react'
import React from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import { PortfolioInfoRow } from '../portfolio-info-row'

interface PortfolioFarmClaimablesProps {
  claimables: PortfolioFarmClaim[]
}

export const PortfolioFarmClaimables: FC<PortfolioFarmClaimablesProps> = ({
  claimables,
}) => (
  <AccordionItem value="alm" className="!border-0">
    <AccordionTrigger
      chevronChildren={<span className="text-xs text-[#64748B]">Hide</span>}
      className="px-3 !py-2 text-xs text-[#64748B] hover:!no-underline [&[data-state=open]>div>span]:block [&[data-state=closed]>div>span]:hidden"
    >
      {`Farms (${claimables.length})`}
    </AccordionTrigger>
    <AccordionContent childClassName="!pb-0" className="cursor-default">
      {claimables.map(({ position, token }) => (
        <PortfolioInfoRow
          key={`${position.chainId}:${position.id}`}
          chainId={token.chainId as EvmChainId}
          href={
            position.protocol === 'SUSHISWAP_V2'
              ? `/${getEvmChainById(position.chainId as EvmChainId).key}/pool/v2/${position.address}/add`
              : `/${getEvmChainById(position.chainId as EvmChainId).key}/rewards`
          }
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
              <div className="text-muted-foreground text-xs overflow-hidden overflow-ellipsis">
                {`${
                  position.protocol === 'SUSHISWAP_V2'
                    ? 'V2'
                    : position.protocol === 'SUSHISWAP_V3'
                      ? 'V3'
                      : position.protocol
                }-${position.swapFee * 100}%-${position.name.replace(' / ', '-')}`}
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
