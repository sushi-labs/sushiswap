import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, KASHI_ADDRESS, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { KashiMarketWithdrawReviewModal, useKashiMarket } from 'app/features/kashi/KashiMarket'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { unwrappedToken } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useState } from 'react'

export interface KashiMarketWithdrawButtonProps {
  receiveToWallet: boolean
  withdrawAmount?: CurrencyAmount<Currency>
  removeMax: boolean
}

export const KashiMarketWithdrawButton: FC<KashiMarketWithdrawButtonProps> = ({
  receiveToWallet,
  withdrawAmount,
  removeMax,
}) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { chainId } = useActiveWeb3React()
  const balance = useBentoOrWalletBalance(account ?? undefined, unwrappedToken(market.asset.token), false)
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId ? KASHI_ADDRESS[chainId] : undefined
  const [open, setOpen] = useState(false)

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !withdrawAmount?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !balance
    ? i18n._(t`Loading balance`)
    : ''

  const buttonText = error ? error : withdrawAmount?.greaterThan(ZERO) ? i18n._(t`Withdraw`) : ''

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        spendFromWallet={receiveToWallet}
        inputAmounts={[withdrawAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        withPermit={true}
        permit={permit}
        onPermit={setPermit}
        onPermitError={() => setPermitError(true)}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading
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
      <KashiMarketWithdrawReviewModal
        open={open}
        onDismiss={() => setOpen(false)}
        receiveToWallet={receiveToWallet}
        withdrawAmount={withdrawAmount}
        removeMax={removeMax}
        permit={permit}
      />
    </>
  )
}
