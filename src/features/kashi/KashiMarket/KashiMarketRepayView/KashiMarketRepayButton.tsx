import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  KASHI_ADDRESS,
  maximum,
  TradeType,
  WNATIVE_ADDRESS,
  ZERO,
} from '@sushiswap/core-sdk'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk/dist/entities/Trade'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Warning, Warnings } from 'app/entities/Warnings'
import { KashiMarketRepayReviewModal, KashiMarketView, useKashiMarket } from 'app/features/kashi/KashiMarket'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { unwrappedToken } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, ReactNode, useState } from 'react'

export interface KashiMarketRepayButtonProps {
  view: KashiMarketView
  closePosition: boolean
  repayFromWallet: boolean
  removeToWallet: boolean
  repayAmount?: CurrencyAmount<Currency>
  removeAmount?: CurrencyAmount<Currency>
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_OUTPUT>
  repayMax: boolean
  removeMax: boolean
}

export const KashiMarketRepayButton: FC<
  KashiMarketRepayButtonProps & { nextMaxRemoveCollateral: JSBI; nextMinCollateralMinimum: JSBI }
> = ({
  closePosition,
  repayFromWallet,
  removeToWallet,
  repayAmount,
  removeAmount,
  trade,
  view,
  repayMax,
  removeMax,
  nextMaxRemoveCollateral,
  nextMinCollateralMinimum,
}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const asset = unwrappedToken(market.asset.token)
  const collateral = unwrappedToken(market.collateral.token)

  const { chainId } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ?? undefined, asset, repayFromWallet)
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>(false)
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId ? KASHI_ADDRESS[chainId] : undefined
  const [open, setOpen] = useState(false)

  const totalAvailableToRemove = removeAmount
    ? CurrencyAmount.fromRawAmount(removeAmount.currency, market.totalCollateralAmount)
    : undefined

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !closePosition && !repayAmount?.greaterThan(ZERO) && !removeAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !balance
    ? i18n._(t`Loading balance`)
    : repayAmount?.greaterThan(balance)
    ? i18n._(t`Insufficient balance`)
    : totalAvailableToRemove && removeAmount && removeAmount.greaterThan(totalAvailableToRemove)
    ? i18n._(t`Not enough ${removeAmount.currency.symbol} available`)
    : removeAmount?.greaterThan(market.userCollateralAmount)
    ? i18n._(t`Withdraw too large`)
    : repayAmount?.greaterThan(market.currentUserBorrowAmount)
    ? 'Repay larger than debt'
    : ''

  const buttonText = error
    ? error
    : closePosition
    ? i18n._(t`Close Position`)
    : removeAmount?.greaterThan(ZERO) && repayAmount?.greaterThan(ZERO)
    ? i18n._(t`Repay and Remove`)
    : removeAmount?.greaterThan(ZERO)
    ? i18n._(t`Remove Collateral`)
    : repayAmount?.greaterThan(ZERO)
    ? i18n._(t`Repay Debt`)
    : ''

  const warnings = new Warnings()
  warnings
    .addError(
      Boolean(chainId && asset.wrapped.address === WNATIVE_ADDRESS[chainId] && repayFromWallet && repayMax),
      `You cannot MAX repay ${asset.symbol} directly from your wallet. Please deposit your ${asset.symbol} into the BentoBox first, then repay. Because your debt is slowly accruing interest we can't predict how much it will be once your transaction gets mined.`
    )
    .addError(
      permitError,
      i18n._(
        t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
      )
    )
    .addError(
      Boolean(repayAmount && JSBI.greaterThan(repayAmount.quotient, market.currentUserBorrowAmount)),
      "You can't repay more than you owe. To fully repay, please click the 'max' button.",
      new Warning(
        Boolean(balance && repayAmount && balance.lessThan(repayAmount)),
        `Please make sure your ${
          !repayFromWallet ? 'BentoBox' : 'wallet'
        } balance is sufficient to repay and then try again.`,
        true
      )
    )
    .addError(
      Boolean(
        removeAmount &&
          removeAmount?.greaterThan(maximum(JSBI.subtract(market.userCollateralAmount, nextMinCollateralMinimum), ZERO))
      ),
      'Removing this much collateral would put you into insolvency.',
      new Warning(
        Boolean(removeAmount && removeAmount?.greaterThan(nextMaxRemoveCollateral)),
        'Removing this much collateral would put you very close to insolvency.'
      )
    )

  return (
    <>
      {warnings.reduce<ReactNode[]>((acc, cur, index) => {
        if (cur)
          acc.push(
            <Typography
              variant="sm"
              className="p-4 text-center border rounded border-yellow/40 text-yellow"
              key={index}
            >
              {cur.message}
            </Typography>
          )
        return acc
      }, [])}
      <TridentApproveGate
        spendFromWallet={repayFromWallet}
        inputAmounts={closePosition ? [] : [repayAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        withPermit={true}
        permit={permit}
        onPermit={setPermit}
        onPermitError={() => setPermitError(true)}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || warnings.some((warning) => warning.breaking)
          return (
            <Button
              loading={loading}
              color="gradient"
              disabled={disabled}
              onClick={() => setOpen(true)}
              className="rounded-2xl md:rounded"
            >
              {buttonText}
            </Button>
          )
        }}
      </TridentApproveGate>
      <KashiMarketRepayReviewModal
        open={open}
        onDismiss={() => setOpen(false)}
        repayFromWallet={repayFromWallet}
        repayAmount={repayAmount}
        removeToWallet={removeToWallet}
        removeAmount={removeAmount}
        closePosition={closePosition}
        trade={trade}
        view={view}
        removeMax={removeMax}
        repayMax={repayMax}
        permit={permit}
      />
    </>
  )
}
