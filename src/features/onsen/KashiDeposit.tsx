import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BENTOBOX_ADDRESS, KASHI_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { KashiCooker } from 'app/entities'
import { tryParseAmount } from 'app/functions/parse'
import { useBentoBoxContract } from 'app/hooks'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useKashiApproveCallback, { BentoApprovalState } from 'app/hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useNativeCurrencyBalances } from 'app/state/wallet/hooks'
import React, { useCallback, useMemo, useState } from 'react'

import KashiMediumRiskLendingPair from '../kashi/KashiMediumRiskLendingPair'

// @ts-ignore TYPE NEEDS FIXING
const KashiDeposit = ({ market, header }: { market: KashiMediumRiskLendingPair; header: JSX.Element }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const [useBento, setUseBento] = useState<boolean>(false)
  const asset = market.asset.token
  const [depositValue, setDepositValue] = useState('')

  const isNative = useMemo(
    () => (chainId && chainId in WNATIVE_ADDRESS ? WNATIVE_ADDRESS[chainId] === asset.address : undefined),
    [asset.address, chainId]
  )
  const ethBalance = useNativeCurrencyBalances(isNative ? [account ?? undefined] : [])

  const assetWalletBalance = useBentoOrWalletBalance(account ?? undefined, asset, true)
  const assetBentoBoxBalance = useBentoOrWalletBalance(account ?? undefined, asset, false)

  const assetBalance = useMemo(
    () =>
      account ? (useBento ? assetBentoBoxBalance : isNative ? ethBalance[account] : assetWalletBalance) : undefined,
    [account, assetBentoBoxBalance, assetWalletBalance, ethBalance, isNative, useBento]
  )

  const parsedDepositValue = tryParseAmount(depositValue, asset)
  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApproveKashi, onCook] = useKashiApproveCallback()
  const [tokenApprovalState, onApproveToken] = useApproveCallback(
    parsedDepositValue,
    chainId ? BENTOBOX_ADDRESS[chainId] : undefined
  )

  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()
  const masterContract = useMemo(() => chainId && KASHI_ADDRESS[chainId], [chainId])

  const onDeposit = useCallback(async () => {
    console.log({ account, library, chainId, masterContract, bentoBoxContract, parsedDepositValue })
    if (!account || !library || !chainId || !masterContract || !bentoBoxContract || !parsedDepositValue) {
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

    const deadBalance = await bentoBoxContract.balanceOf(
      market.asset.token.address,
      '0x000000000000000000000000000000000000dead'
    )

    cooker.addAsset(BigNumber.from(parsedDepositValue.quotient.toString()), useBento, deadBalance.isZero())
    const result = await cooker.cook()

    if (result.success) {
      addTransaction(result.tx, {
        summary: i18n._(t`Deposit ${parsedDepositValue.toSignificant(6)} ${parsedDepositValue.currency.symbol}`),
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
    parsedDepositValue,
    useBento,
  ])

  const error = !parsedDepositValue
    ? 'Enter an amount'
    : assetBalance && parsedDepositValue.greaterThan(assetBalance)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  console.log({ tokenApprovalState })

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <AssetInput
          title={''}
          value={depositValue}
          currency={asset}
          onChange={(val) => setDepositValue(val || '')}
          headerRight={
            <AssetInput.WalletSwitch
              onChange={() => setUseBento(!useBento)}
              checked={!useBento}
              id="switch-spend-from-wallet-a"
            />
          }
          spendFromWallet={!useBento}
          id="add-liquidity-input-tokenb"
        />
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
      {!account ? (
        <Web3Connect fullWidth />
      ) : isValid &&
        !kashiPermit &&
        (kashiApprovalState === BentoApprovalState.NOT_APPROVED ||
          kashiApprovalState === BentoApprovalState.PENDING) ? (
        <Button
          loading={kashiApprovalState === BentoApprovalState.PENDING}
          onClick={onApproveKashi}
          disabled={kashiApprovalState !== BentoApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Kashi`)}
        </Button>
      ) : isValid &&
        !useBento &&
        (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING) ? (
        <Button
          loading={tokenApprovalState === ApprovalState.PENDING}
          onClick={onApproveToken}
          disabled={tokenApprovalState !== ApprovalState.NOT_APPROVED}
        >
          {`${i18n._(t`Approve`)} ${asset.symbol}`}
        </Button>
      ) : (
        <Button onClick={onDeposit} disabled={!isValid} color={!isValid && !!parsedDepositValue ? 'red' : 'blue'}>
          {error || i18n._(t`Confirm Deposit`)}
        </Button>
      )}
    </>
  )
}

export default KashiDeposit
