import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, minimum } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import {
  KashiMarketCurrentLentPosition,
  KashiMarketView,
  KashiMarketWithdrawButton,
  useKashiMarket,
} from 'app/features/kashi/KashiMarket'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { tryParseAmount, unwrappedToken } from 'app/functions'
import React, { FC, useMemo, useState } from 'react'

import { KashiMarketLentDetailsView } from '../KashiMarketLentDetailsView'

export const KashiMarketWithdrawView: FC = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()
  const [receiveToWallet, setReceiveToWallet] = useState(true)
  const [removeMax, setRemoveMax] = useState(false)

  const assetToken = unwrappedToken(market.asset.token)
  const withdrawAmountCurrencyAmount = tryParseAmount(withdrawAmount, assetToken)

  const max = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        market.asset.token,
        minimum(market.maxAssetAvailable, market.currentUserAssetAmount)
      ),
    [market.asset.token, market.currentUserAssetAmount, market.maxAssetAvailable]
  )

  return (
    <div className="flex flex-col gap-3">
      <KashiMarketCurrentLentPosition setLentAmount={setWithdrawAmount} />
      <SwapAssetPanel
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Withdraw`)} hideSearchModal />}
        walletToggle={(props) => (
          <SwapAssetPanel.Switch
            id={`switch-classic-withdraw-from-0}`}
            {...props}
            label={i18n._(t`Receive to`)}
            onChange={() => setReceiveToWallet((prev) => !prev)}
          />
        )}
        spendFromWallet={receiveToWallet}
        currency={assetToken}
        value={withdrawAmountCurrencyAmount?.toSignificant(6)}
        onChange={(val) => {
          setWithdrawAmount(val)
          setRemoveMax(false)
        }}
        balancePanel={({ onChange }) => (
          <Typography
            variant="sm"
            className="text-right text-secondary"
            onClick={() => {
              onChange(max?.toExact())
              setRemoveMax(true)
            }}
          >
            Max: {max?.toSignificant(6)}
          </Typography>
        )}
      />
      <KashiMarketLentDetailsView view={KashiMarketView.WITHDRAW} lentAmount={withdrawAmountCurrencyAmount} />
      <KashiMarketWithdrawButton
        withdrawAmount={withdrawAmountCurrencyAmount}
        receiveToWallet={receiveToWallet}
        removeMax={removeMax}
      />
    </div>
  )
}
