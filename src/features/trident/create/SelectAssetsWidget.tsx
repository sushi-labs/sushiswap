import { PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { SpendSource } from 'app/features/trident/create/SelectedAsset'
import { useCreatePoolDerivedAsset } from 'app/features/trident/create/useCreateDerivedState'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import React, { FC } from 'react'

const SelectPanel: FC<{ index: number }> = ({ index }) => {
  const { i18n } = useLingui()
  const { asset, setCurrency, setAmount, setWalletSource } = useCreatePoolDerivedAsset(index)

  return (
    <SwapAssetPanel
      error={asset.error !== '' && asset.amount !== ''}
      header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Pool Token ${index + 1}`)} />}
      walletToggle={(props) => (
        <SwapAssetPanel.Switch
          id={`switch-classic-withdraw-from-${index}`}
          {...props}
          label={i18n._(t`Withdraw from`)}
          onChange={() => setWalletSource(asset.oppositeToggle())}
        />
      )}
      selected={true}
      spendFromWallet={asset.spendFromSource !== SpendSource.BENTO_BOX}
      currency={asset.currency}
      value={asset.amount}
      onChange={(amount) => setAmount(amount)}
      onSelect={(currency) => setCurrency(currency)}
    />
  )
}

export const SelectAssetsWidget: FC = () => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex flex-col gap-0.5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`Select Two Assets`)}
        </Typography>
        <Typography variant="sm" className="text-secondary">
          {i18n._(
            t`Please select the two assets that this pool will consist of. When creating a pair, you are the first liquidity provider. Please note that the ratio of tokens you add will set the price of this pool.`
          )}
        </Typography>
      </div>
      <div className="flex flex-col gap-6 max-w-xl">
        <SelectPanel index={0} />
        <div className="flex justify-center -mt-8 -mb-8 z-10">
          <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
            <PlusIcon width={14} className="text-high-emphesis" />
          </div>
        </div>
        <SelectPanel index={1} />
      </div>
    </div>
  )
}
