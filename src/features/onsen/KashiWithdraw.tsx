import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { toShare } from '@sushiswap/bentobox-sdk'
import { CurrencyAmount, JSBI, KASHI_ADDRESS, minimum, ZERO } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { KashiCooker } from 'app/entities'
import { tryParseAmount, unwrappedToken } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import React, { useCallback, useMemo, useState } from 'react'

import KashiMediumRiskLendingPair from '../kashi/KashiMediumRiskLendingPair'

const KashiWithdraw = ({ market, header }: { market: KashiMediumRiskLendingPair; header: JSX.Element }) => {
  const { i18n } = useLingui()
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()
  const masterContract = chainId && KASHI_ADDRESS[chainId]
  const [useBento, setUseBento] = useState<boolean>(false)
  const [removeMax, setRemoveMax] = useState<boolean>(false)
  const assetToken = unwrappedToken(market.asset.token)
  const [withdrawValue, setWithdrawValue] = useState('')
  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()
  const amountAvailable = minimum(market?.maxAssetAvailable ?? ZERO, market?.currentUserAssetAmount ?? ZERO)

  const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

  const currentUserAssetAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserAssetAmount),
    [market.asset.token, market.currentUserAssetAmount]
  )

  const max = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        market.asset.token,
        minimum(market.maxAssetAvailable, market.currentUserAssetAmount)
      ),
    [market.asset.token, market.currentUserAssetAmount, market.maxAssetAvailable]
  )

  const onWithdraw = useCallback(async () => {
    if (!account || !library || !chainId || !masterContract || !bentoBoxContract || !parsedWithdrawValue) {
      console.error('Dependencies unavailable')
      return
    }

    const cooker = new KashiCooker(market, account, library, chainId)

    // Add permit if available
    if (kashiPermit) {
      cooker.approve({
        account,
        masterContract,
        v: kashiPermit.v,
        r: kashiPermit.r,
        s: kashiPermit.s,
      })
    }

    const fraction = removeMax
      ? minimum(market.userAssetFraction, market.maxAssetAvailableFraction)
      : toShare(
          {
            base: market.currentTotalAsset.base,
            elastic: market.currentAllAssets,
          },
          parsedWithdrawValue.quotient
        )

    cooker.removeAsset(BigNumber.from(fraction.toString()), useBento)

    const result = await cooker.cook()

    if (result.success) {
      addTransaction(result.tx, {
        summary: i18n._(t`Withdraw ${parsedWithdrawValue.toSignificant(6)} ${parsedWithdrawValue.currency.symbol}`),
      })

      return result.tx
    }
  }, [
    account,
    addTransaction,
    bentoBoxContract,
    chainId,
    i18n,
    kashiPermit,
    library,
    market,
    masterContract,
    parsedWithdrawValue,
    removeMax,
    useBento,
  ])

  const error = !parsedWithdrawValue
    ? 'Enter an amount'
    : parsedWithdrawValue.greaterThan(currentUserAssetAmount)
    ? 'Insufficient balance'
    : parsedWithdrawValue.greaterThan(max)
    ? 'Not enough assets available'
    : undefined

  const isValid = !error

  console.log({ market })

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <div>
          <AssetInput
            title={''}
            value={withdrawValue}
            currency={assetToken}
            onChange={(val) => setWithdrawValue(val || '')}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setUseBento(!useBento)}
                checked={!useBento}
                id="switch-spend-from-wallet-a"
                label="Send to:"
              />
            }
            spendFromWallet={!useBento}
            balance={max}
            id="add-liquidity-input-tokenb"
          />
        </div>
      </HeadlessUiModal.BorderedContent>

      {approveKashiFallback && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-red/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(
              t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
            )}
          </Typography>
        </HeadlessUiModal.BorderedContent>
      )}

      {JSBI.equal(amountAvailable, ZERO) && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-blue/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(t`If your KMP is staked, you cannot withdraw your lent tokens. You must unstake first.`)}
          </Typography>
        </HeadlessUiModal.BorderedContent>
      )}

      {!account ? (
        <Web3Connect fullWidth />
      ) : isValid &&
        !kashiPermit &&
        (kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
          kashiApprovalState === BentoApprovalState.PENDING) ? (
        <Button
          fullWidth
          loading={kashiApprovalState === BentoApprovalState.PENDING}
          onClick={onApproveKashi}
          disabled={kashiApprovalState !== BentoApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Kashi`)}
        </Button>
      ) : (
        <Button
          fullWidth
          color={!isValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={onWithdraw}
          disabled={!isValid}
        >
          {error || i18n._(t`Confirm Withdraw`)}
        </Button>
      )}
    </>
  )
}

export default KashiWithdraw
