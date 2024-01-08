'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Explainer,
  SkeletonText,
} from '@sushiswap/ui'
import { ConnectButton } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { Amount, Type } from 'sushi/currency'
import { formatNumber } from 'sushi/format'
import { BoostVotingPowerModal } from './BoostVotingPowerModal'
import { useVotingPower } from './VotingPowerProvider'

export const VotingPowerCard = () => {
  const { votingPower, balances, weights, isConnected, isLoading } =
    useVotingPower()

  const nonZeroBalances: Amount<Type>[] = useMemo(
    () =>
      !balances
        ? []
        : Object.values(balances).filter((amount) => amount.greaterThan(0)),
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
      {isConnected ? (
        <CardContent>
          <div className="flex items-center gap-3">
            {isLoading ? (
              <>
                <SkeletonText fontSize="xl" className="!w-3/4" />
              </>
            ) : (
              <>
                <span className="text-xl font-bold">
                  {votingPower === 0 ? 0 : formatNumber(votingPower)} SUSHI
                  POWAH
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
            <Button>
              <a
                target="_blank"
                rel="noreferrer noopener noreferer"
                href={'https://snapshot.org/#/delegate/sushigov.eth'}
              >
                Delegate Someone
              </a>
            </Button>
            <BoostVotingPowerModal weights={weights} />
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <span className="font-bold text-xl">n/a</span>
          <span>
            <ConnectButton>Connect Wallet</ConnectButton>
          </span>
        </CardContent>
      )}
    </Card>
  )
}
