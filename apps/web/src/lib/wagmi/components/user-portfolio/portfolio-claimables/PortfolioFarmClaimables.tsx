import { PortfolioFarmClaim } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  FormattedNumber,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { FC } from 'react'
import { formatUSD } from 'sushi/format'

interface PortfolioFarmClaimablesProps {
  claimables: PortfolioFarmClaim[]
}

export const PortfolioFarmClaimables: FC<PortfolioFarmClaimablesProps> = ({
  claimables,
}) => (
  <AccordionItem value="alm" className="!border-0">
    <AccordionTrigger className="px-5 underline-offset-2">
      {`Farms (${claimables.length})`}
    </AccordionTrigger>
    <AccordionContent className="cursor-default">
      {claimables.map(({ position, token }) => (
        <div
          id={`${position.chainId}:${position.id}`}
          className="flex justify-between items-center hover:bg-muted px-5 py-3 gap-x-4"
        >
          <div className="flex gap-x-4 items-center whitespace-nowrap overflow-hidden">
            <div className="shrink-0">
              <Badge
                className="border-1 border-background bg-background rounded-full z-[11] right-[-0.225rem] bottom-[-0.225rem]"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon
                    chainId={position.chainId}
                    width={14}
                    height={14}
                  />
                }
              >
                <img
                  className="rounded-full"
                  src={position.protocolLogoUrl}
                  width={28}
                  height={28}
                  alt={position.protocol}
                />
              </Badge>
            </div>
            <div className="overflow-hidden flex flex-col gap-y-1">
              <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
                {token.name}
              </div>
              <div className="text-muted-foreground text-xs">
                {`${
                  position.protocol === 'SUSHISWAP_V2'
                    ? 'V2'
                    : position.protocol === 'SUSHISWAP_V3'
                      ? 'V3'
                      : position.protocol
                }-${position.swapFee * 100}%-${position.name.replace(
                  ' / ',
                  '-',
                )}`}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 text-right">
            <div className="text-sm font-medium">
              {formatUSD(token.amountUSD)}
            </div>
            <div className="text-xs text-muted-foreground">
              <FormattedNumber number={token.amount.toString()} />{' '}
              {token.symbol}
            </div>
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>
)
