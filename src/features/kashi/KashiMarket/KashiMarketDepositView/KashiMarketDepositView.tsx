import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  KashiMarketCurrentLentPosition,
  KashiMarketDepositButton,
  KashiMarketView,
  useKashiMarket,
} from 'app/features/kashi/KashiMarket'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount, unwrappedToken } from 'app/functions'
import React, { FC, useState } from 'react'

import { KashiMarketLentDetailsView } from '../KashiMarketLentDetailsView'

export const KashiMarketDepositView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)

  const assetToken = unwrappedToken(market.asset.token)
  const depositAmountCurrencyAmount = tryParseAmount(depositAmount, assetToken)

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentLentPosition setLentAmount={setDepositAmount} />
      <SwapAssetPanel
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Deposit`)} hideSearchModal />}
        walletToggle={(props) => (
          <SwapAssetPanel.Switch
            id={`switch-classic-withdraw-from-0}`}
            {...props}
            label={i18n._(t`Deposit from`)}
            onChange={() => setSpendFromWallet((prev) => !prev)}
          />
        )}
        spendFromWallet={spendFromWallet}
        currency={assetToken}
        value={depositAmountCurrencyAmount?.toSignificant(6)}
        onChange={setDepositAmount}
      />
      <KashiMarketLentDetailsView view={KashiMarketView.DEPOSIT} lentAmount={depositAmountCurrencyAmount} />
      <KashiMarketDepositButton depositAmount={depositAmountCurrencyAmount} spendFromWallet={spendFromWallet} />
    </div>
  )
}
