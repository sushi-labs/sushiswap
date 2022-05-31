import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { BentoboxIcon } from 'app/components/Icon'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { useBalancesSelectedCurrency } from 'app/features/portfolio/useBalancesDerivedState'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { tryParseAmount } from 'app/functions'
import { useBentoBox, useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useCallback, useState } from 'react'

interface DepositViewProps {
  onBack(): void
  onClose(): void
}

const DepositView: FC<DepositViewProps> = ({ onClose, onBack }) => {
  const { account } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const { data: bentoBalance } = useBentoBalanceV2(currency ? currency.wrapped.address : undefined)
  const { deposit } = useBentoBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()
  const bentoboxContract = useBentoBoxContract()

  const valueCA = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = valueCA?.wrapped
  if (valuePlusBalance && bentoBalance) valuePlusBalance = valuePlusBalance.add(bentoBalance)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await deposit(currency.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, deposit, onClose, value])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !valueCA?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !walletBalance
    ? i18n._(t`Loading balance`)
    : valueCA?.greaterThan(walletBalance)
    ? i18n._(t`Insufficient ${valueCA.currency.symbol} balance`)
    : ''

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Deposit to BentoBox`)} onClose={onClose} onBack={onBack} />
      <AssetInput
        title={''}
        currency={currency}
        onChange={(val) => setValue(val)}
        value={value}
        spendFromWallet={true}
      />
      <div className="flex justify-center -mt-6 -mb-6 z-10">
        <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
          <ArrowDownIcon width={14} className="text-high-emphesis" />
        </div>
      </div>
      <HeadlessUiModal.BorderedContent className="bg-dark-900 flex gap-3 px-3">
        <div className="border border-dark-700 rounded-full w-[48px] h-[48px] flex items-center justify-center shadow-md">
          <BentoboxIcon width={20} height={20} />
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="h3" className={value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
            {(valuePlusBalance || bentoBalance)?.toSignificant(6)}
          </Typography>
          <Typography variant="xxs" className="text-secondary">
            {i18n._(t`Total in BentoBox`)}
          </Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <TridentApproveGate inputAmounts={[valueCA]} tokenApproveOn={bentoboxContract?.address}>
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn
          const buttonText = error ? error : i18n._(t`Confirm Deposit`)

          return (
            <Button loading={attemptingTxn || loading} color="blue" disabled={disabled} onClick={execute}>
              <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
                {buttonText}
              </Typography>
            </Button>
          )
        }}
      </TridentApproveGate>
    </div>
  )
}

export default DepositView
