import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import { type V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { PoolPositionProvider } from '~evm/[chainId]/pool/v2/[address]/_common/ui/pool-position-provider'
import { V2MigrateDialog } from './v2-migrate-dialog/v2-migrate-dialog'

export const V2Migrate = ({ position }: { position: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Temporary hardcoded pool data until we can fetch based on position data
  const { data: pool, isLoading } = useQuery<V2Pool | null>({
    queryKey: ['v2-pool-testing'],
    queryFn: async () => {
      const result = await getV2Pool({
        chainId: 137,
        address: '0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e',
      })
      return result
    },
  })

  return (
    <div className="flex flex-col gap-5 rounded-xl mt-6 bg-gray-100 dark:bg-slate-900 px-3 py-4">
      <p className="text-sm">
        Migrate your V2 position to a concentrated liquidity position to improve
        your captial efficiency.
      </p>
      {pool && !isLoading ? (
        <CheckerProvider>
          <PoolPositionProvider pool={pool}>
            <ConcentratedLiquidityProvider>
              <V2MigrateDialog
                pool={pool}
                fakePosition={position}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </ConcentratedLiquidityProvider>
          </PoolPositionProvider>
        </CheckerProvider>
      ) : (
        <Button
          icon={ArrowRightIcon}
          loading={true}
          iconProps={{ className: '!w-4 !h-4' }}
          iconPosition="end"
        >
          Migrate to V3
        </Button>
      )}
    </div>
  )
}
