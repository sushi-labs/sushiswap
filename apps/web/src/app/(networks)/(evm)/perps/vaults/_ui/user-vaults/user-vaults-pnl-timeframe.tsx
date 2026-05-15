import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common'
import {
  USER_VAULTS_PNL_TIMEFRAMES,
  useUserVaultsState,
} from './user-vaults-provider'

export const UserVaultsPnLTimeframe = () => {
  const {
    state: { pnlTimeframe },
    mutate: { setPnLTimeframe },
  } = useUserVaultsState()

  return (
    <PerpsCard
      className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-0.5"
      rounded="full"
    >
      {USER_VAULTS_PNL_TIMEFRAMES.map((v) => (
        <Button
          key={v}
          size="xs"
          variant={v === pnlTimeframe ? 'perps-secondary' : 'ghost'}
          onClick={() => setPnLTimeframe(v)}
          className={classNames(
            'w-full capitalize !text-xs !rounded-full !py-4 !border-0',
            v === pnlTimeframe
              ? 'text-white bg-accent'
              : 'text-muted-foreground',
          )}
        >
          {v}
        </Button>
      ))}
    </PerpsCard>
  )
}
