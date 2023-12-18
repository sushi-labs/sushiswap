'use client'

import { FireIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { ConnectButton } from '@sushiswap/wagmi'
import { useVotingPower } from 'src/lib/bar/useVotingPower'
import { formatNumber } from 'sushi/format'
import { useAccount } from 'wagmi'

export const VotingPowerCard = () => {
  const { address, isConnected } = useAccount()

  const { data: votingPower, isLoading } = useVotingPower({ address })

  return (
    <Card>
      <CardHeader className="!pb-3">
        <CardTitle className="flex gap-1 items-center">
          <span className="text-xs text-muted-foreground">My Voting Power</span>
          <InformationCircleIcon width={12} height={12} />
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
                  110 XSUSHI + 1,092,213.12 ETH-SUSHI SLP
                  {/* TODO */}
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
                Delegate My Vote
              </a>
            </Button>
            <Button variant={'secondary'} icon={FireIcon}>
              Boost Voting Power
            </Button>
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
