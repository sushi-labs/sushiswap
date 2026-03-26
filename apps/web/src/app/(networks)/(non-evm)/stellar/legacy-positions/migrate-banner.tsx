'use client'

import { Button, LinkExternal, LinkInternal } from '@sushiswap/ui'
import type { FC } from 'react'
import { useAccount } from 'src/lib/wallet/hooks'
import { useMyUnmigratedLegacyPositions } from '~stellar/_common/lib/hooks/position/use-my-legacy-position'

export const MigrateBanner: FC = () => {
  const account = useAccount('stellar')

  const { positions } = useMyUnmigratedLegacyPositions({
    userAddress: account,
  })

  if (positions.length === 0) {
    return null
  }

  return (
    <div className="bg-yellow-200 text-center flex flex-col gap-2 justify-center items-center p-4">
      <p className="font-bold text-md text-yellow-950">
        Attention: We've released an upgrade across our pools. If you have
        existing positions, we recommend migrating soon. Unmigrated positions
        risk having your principal become restricted.
      </p>
      <p className="font-bold text-md text-yellow-950">
        Migrating allows you to collect any earned fees and continue with the
        same position and price range.
      </p>
      <p className="font-bold text-md text-yellow-950">
        If you are unable to withdrawal your funds, please{' '}
        <LinkExternal
          href={'https://sushi.com/discord'}
          target="_blank"
          rel="noopener noreferrer"
        >
          create a ticket
        </LinkExternal>{' '}
        and we'll assist you with retrieval.
      </p>
      <Button
        asChild
        size="sm"
        className="bg-yellow-50 text-yellow-900 hover:bg-yellow-100 hover:text-yellow-700 border-yellow-800"
        variant="outline"
      >
        <LinkInternal href="/stellar/legacy-positions">
          Learn More and Migrate
        </LinkInternal>
      </Button>
    </div>
  )
}
