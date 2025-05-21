import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  FormattedNumber,
  classNames,
} from '@sushiswap/ui'
import React from 'react'
import type { EvmChainId } from 'sushi'
import { formatPercent, formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'
import { PortfolioInfoRow } from '../PortfolioInfoRow'
import { usePortfolioWallet } from '../hooks/use-portfolio-wallet'
import { PortfolioInfoRowSkeleton } from '../portfolio-info-row-skeleton'
import type {
  PortfolioAccordionValue,
  PortfolioAssetsProps,
} from './portfolio-assets'

export const WalletAssets = (props: PortfolioAssetsProps) => {
  const { value, onValueChange } = props
  const { address } = useAccount()

  const { data, isError, isLoading } = usePortfolioWallet(address)

  return (
    <Accordion
      type="single"
      className="border border-accent rounded-xl"
      value={value}
      onValueChange={(val) => onValueChange(val as PortfolioAccordionValue)}
    >
      <AccordionItem value="wallet" className="!border-0">
        <AccordionTrigger
          hideChevron={true}
          className="px-3 text-xs !py-2 hover:!no-underline data-[state=closed]:border-0 data-[state=closed]:rounded-b-xl !rounded-t-xl border-b border-b-accent dark:bg-slate-800 bg-slate-100 sm:bg-white flex justify-between items-center"
        >
          <span>Wallet</span>
          <span className="text-[#535263] dark:text-[#E4DDEC]">
            {formatUSD(data?.totalUSD ?? 0)}
          </span>
        </AccordionTrigger>
        <AccordionContent className="cursor-default max-h-[225px] overflow-y-auto">
          {isError ? (
            <div className="text-center text-red text-sm pt-4">
              Could Not Fetch Wallet Data
            </div>
          ) : isLoading ? (
            <PortfolioInfoRowSkeleton amount={12} />
          ) : (
            data?.tokens?.map((token) => {
              return (
                <PortfolioInfoRow
                  key={`${token.chainId}:${token.id}`}
                  chainId={token.chainId as EvmChainId}
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
                        {token.name ?? token.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">
                        <FormattedNumber number={token.amount.toString()} />{' '}
                        {token.symbol}
                      </div>
                    </React.Fragment>
                  }
                  rightContent={
                    <React.Fragment>
                      <div className="text-sm font-medium overflow-hidden overflow-ellipsis">
                        {formatUSD(token.amountUSD)}
                      </div>
                      <div
                        className={classNames(
                          'text-xs',
                          token.price24hChange > 0
                            ? 'text-green'
                            : token.price24hChange < 0
                              ? 'text-red'
                              : 'text-muted-foreground',
                        )}
                      >
                        {`${token.price24hChange > 0 ? '+' : ''}${formatPercent(token.price24hChange)}`}
                      </div>
                    </React.Fragment>
                  }
                />
              )
            })
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
