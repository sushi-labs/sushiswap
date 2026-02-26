'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { Button, LinkInternal } from '@sushiswap/ui'
import type { FC } from 'react'
import { useAccount } from 'src/lib/wallet/hooks'
import { useMyLegacyPosition } from '~stellar/_common/lib/hooks/position/use-my-legacy-position'

export const MigrateBanner: FC = () => {
  const account = useAccount('stellar')
  const [showStellarMigrationBanner, setShowStellarMigrationBanner] =
    useLocalStorage<boolean>('show-stellar-migration-banner', true)

  const { positions } = useMyLegacyPosition({
    userAddress: account,
  })

  if (positions.length === 0 || !showStellarMigrationBanner) {
    return null
  }

  return (
    <div className="bg-yellow-200 text-center flex flex-col gap-2 justify-center items-center p-4">
      <p className="font-bold text-md text-yellow-950">
        IMPORTANT: You have legacy positions that need to be migrated to the new
        position manager to avoid the risk of having your position principal
        locked.
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
