import { Card, classNames } from '@sushiswap/ui'
import { useUserAccountValues } from 'src/lib/perps/user'
import { useAccount } from 'src/lib/wallet'
import { AccountManagementSkeleton } from './account-management-skeleton'
import { AccountSummary } from './account-summary'
import { DepositDialog } from './deposit-dialog'
import { PerpSpotTransfer } from './perp-spot-transfer'
import { useUserSettingsState } from './settings-provider'
import { UnifiedAccountSummary } from './unified-account-summary'
import { Withdraw } from './withdraw'

export const AccountManagement = ({ className }: { className?: string }) => {
  const address = useAccount('evm')
  const { isLoading, error } = useUserAccountValues()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  return (
    <Card
      className={classNames(
        'p-2 flex flex-col-reverse lg:flex-col gap-2',
        className ?? '',
      )}
    >
      {error ? (
        <>
          <div className="text-sm text-center italic pt-10 text-transparent lg:text-red">
            {error?.message ?? 'Error loading account data'}
          </div>
          <div className="text-red text-sm text-center italic pt-10 lg:text-transparent">
            {error?.message ?? 'Error loading account data'}
          </div>
        </>
      ) : isLoading ? (
        <AccountManagementSkeleton />
      ) : (
        <>
          <div
            className={classNames(
              'flex flex-col gap-2',
              !address ? 'opacity-50 pointer-events-none' : '',
            )}
          >
            <DepositDialog />
            <div className="flex items-center gap-2">
              <PerpSpotTransfer />
              <Withdraw />
            </div>
          </div>
          {isUnifiedAccountModeEnabled ? (
            <UnifiedAccountSummary />
          ) : (
            <AccountSummary />
          )}
        </>
      )}
    </Card>
  )
}
