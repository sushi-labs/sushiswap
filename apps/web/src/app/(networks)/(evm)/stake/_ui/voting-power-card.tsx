'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

import {
  Button,
  Card,
  CardContent,
  Explainer,
  LinkExternal,
  SkeletonText,
} from '@sushiswap/ui'
import { formatNumber, formatPercent } from 'sushi'
import { DataItem } from '../../_common/ui/data-item'
import { useSushiBar } from './sushi-bar-provider'
import { useVotingPower } from './voting-power-provider'

export const VotingPowerCard = () => {
  const { votingPower, balances, isLoading, isError } = useVotingPower()
  const { isPricesLoading, pricePer, apy } = useSushiBar()

  return (
    <Card>
      <CardContent className="pt-6 !pb-3.5">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="pb-1.5 md:pb-0">
            <DataItem
              label={
                <span className="font-medium text-primary text-2xl">
                  Your stake
                </span>
              }
              value={
                <div className="flex gap-1.5 items-end">
                  <div className="text-4xl">
                    {formatNumber(balances?.xsushi?.toString() || '0')}
                  </div>
                  <div className="text-muted-foreground font-normal text-lg">
                    xSUSHI
                  </div>
                </div>
              }
              subLabel={
                balances?.xsushi
                  ? `Equivalent to ${balances?.xsushi?.mulHuman(pricePer)?.toSignificant(4)} SUSHI`
                  : ''
              }
              isLoading={isLoading || isPricesLoading}
              isError={isError}
            />
          </div>
          <div className="border-t md:border-t-0 pt-4 md:pt-0 md:border-l border-accent md:px-8">
            <DataItem
              label={
                <div className="flex items-center gap-1 whitespace-nowrap">
                  APY · 1 month
                  <Explainer>
                    The APY displayed is algorithmic and subject to change.
                  </Explainer>
                </div>
              }
              value={formatPercent(apy || '0')}
              subLabel={undefined}
              isLoading={isLoading || isPricesLoading}
              isError={isError}
            />
          </div>
        </div>
        <div className="border-t border-accent pt-3 flex justify-between items-center text-muted-foreground">
          <div className="text-xs flex items-center gap-1 whitespace-nowrap">
            <div>Voting power:</div>
            {isLoading || isPricesLoading ? (
              <SkeletonText fontSize="xs" className="!w-[50px]" />
            ) : votingPower === 0 || votingPower === undefined ? (
              0
            ) : (
              formatNumber(votingPower)
            )}
          </div>
          <LinkExternal href="https://snapshot.org/#/delegate/sushigov.eth">
            <Button
              asChild
              variant="ghost"
              size="xs"
              className="!text-muted-foreground"
            >
              Delegate <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </Button>
          </LinkExternal>
        </div>
      </CardContent>
    </Card>
  )
}
