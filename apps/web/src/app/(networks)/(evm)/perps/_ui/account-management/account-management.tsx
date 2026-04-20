import { Card, classNames } from '@sushiswap/ui'
import { useUserAccountValues } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { useAssetState } from '../trade-widget'
import { AccountManagementSkeleton } from './account-management-skeleton'
import { AccountSummary } from './account-summary'
import { DepositDialog } from './deposit-dialog'
import { PerpSpotTransferDialog } from './perp-spot-transfer-dialog'
import { useUserSettingsState } from './settings-provider'
import { UnifiedAccountSummary } from './unified-account-summary'
import { WithdrawDialog } from './withdraw-dialog'

export const AccountManagement = ({ className }: { className?: string }) => {
  const address = useAccount('evm')
  const { isLoading, error } = useUserAccountValues()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  const {
    state: { asset },
  } = useAssetState()
  return (
    <Card
      className={classNames(
        'p-2 flex flex-col-reverse lg:flex-col gap-2 !bg-[#0D1421] border border-[#1E2939]',
        className ?? '',
      )}
    >
      {error ? (
        <>
          <div className="text-sm text-center italic pt-10 text-red">
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
              <PerpSpotTransferDialog
                defaultDst="perp"
                defaultDex={asset?.dex}
              />
              <WithdrawDialog />
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
