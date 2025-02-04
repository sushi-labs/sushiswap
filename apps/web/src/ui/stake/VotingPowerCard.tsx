'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Explainer,
  LinkExternal,
  SkeletonText,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import type { Amount, Type } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
// import { BoostVotingPowerModal } from './BoostVotingPowerModal'
import { useVotingPower } from './VotingPowerProvider'

export const VotingPowerCard = () => {
  const { votingPower, balances, isConnected, isLoading } = useVotingPower()

  const nonZeroBalances: Amount<Type>[] = useMemo(
    () =>
      !balances
        ? []
        : Object.values(balances).filter((amount) => amount?.greaterThan(0)),
    [balances],
  )

  return (
    <Card>
      <CardHeader className="!pb-3">
        <CardTitle className="flex gap-1 items-center">
          <span className="text-xs text-muted-foreground">
            Your Voting Power
          </span>
          <Explainer
            icon={InformationCircleIcon}
            iconProps={{ width: 12, height: 12 }}
          >
            Voting power is used to participate in the Sushi DAO.
          </Explainer>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1.5 flex-col">
          <div className="flex items-center gap-3">
            {isConnected && isLoading ? (
              <>
                <SkeletonText fontSize="xl" className="!w-[200px]" />
              </>
            ) : (
              <>
                <span className="text-xl font-bold">
                  {votingPower === 0 || votingPower === undefined
                    ? 0
                    : formatNumber(votingPower)}{' '}
                  SUSHI POWAH
                </span>
                <span className="text-sm text-muted-foreground">
                  {nonZeroBalances
                    .map(
                      (amount) =>
                        `${formatNumber(amount.toSignificant(6))} ${
                          amount.currency.symbol
                        }`,
                    )
                    .join(' + ')}
                </span>
              </>
            )}
          </div>
          <div className="flex gap-6">
            <LinkExternal href="https://snapshot.org/#/delegate/sushigov.eth">
              <Button
                asChild
                variant="link"
                size="sm"
                className="!font-medium !text-secondary-foreground"
              >
                Delegate <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            </LinkExternal>
            {/* <BoostVotingPowerModal weights={weights} /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
