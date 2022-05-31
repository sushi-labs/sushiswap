import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import {
  selectTridentAdd,
  setAddBentoPermit,
  setAddShowReview,
  setAddSpendFromWallet,
} from 'app/features/trident/add/addSlice'
import {
  useAddLiquidityDerivedCurrencyAmounts,
  useAddLiquidityDerivedInput,
  useAddLiquidityDerivedInputError,
} from 'app/features/trident/add/useAddLiquidityDerivedState'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { classNames } from 'app/functions'
import { useBentoBoxContract, useTridentRouterContract } from 'app/hooks'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React from 'react'

import TridentApproveGate from '../TridentApproveGate'
import TransactionDetails from './TransactionDetails'

const ClassicStandardMode = () => {
  const { i18n } = useLingui()
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const bentoBox = useBentoBoxContract()
  const router = useTridentRouterContract()
  const { currencies } = usePoolContext()
  const { spendFromWallet, attemptingTxn, bentoPermit } = useAppSelector(selectTridentAdd)
  const [parsedAmountA, parsedAmountB] = useAddLiquidityDerivedCurrencyAmounts()
  const error = useAddLiquidityDerivedInputError()

  const {
    mainInput: [mainInput, setMainInput],
    secondaryInput: [secondaryInput, setSecondaryInput],
    onMax,
    isMax,
  } = useAddLiquidityDerivedInput()

  return (
    <>
      <div className="flex flex-col gap-6">
        <div />
        <div className="flex flex-col gap-4">
          <AssetInput
            value={mainInput || ''}
            currency={currencies?.[0]}
            onChange={(val) => setMainInput(val || '')}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => dispatch(setAddSpendFromWallet([!spendFromWallet[0], spendFromWallet[1]]))}
                checked={spendFromWallet[0]}
                id="switch-spend-from-wallet-a"
              />
            }
            spendFromWallet={spendFromWallet[0]}
            id="asset-input-a"
          />
          <div />
          <AssetInput
            value={secondaryInput || ''}
            currency={currencies?.[1]}
            onChange={(val) => setSecondaryInput(val || '')}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => dispatch(setAddSpendFromWallet([spendFromWallet[0], !spendFromWallet[1]]))}
                checked={spendFromWallet[1]}
                id="switch-spend-from-wallet-b"
              />
            }
            spendFromWallet={spendFromWallet[1]}
            id="asset-input-b"
          />
          <div className="flex flex-col gap-3">
            <TridentApproveGate
              inputAmounts={[parsedAmountA, parsedAmountB]}
              tokenApproveOn={bentoBox?.address}
              masterContractAddress={router?.address}
              withPermit={true}
              permit={bentoPermit}
              onPermit={(permit) => dispatch(setAddBentoPermit(permit))}
            >
              {({ approved, loading }) => {
                const disabled = !!error || !approved || loading || attemptingTxn
                const buttonText = attemptingTxn ? (
                  <Dots>{i18n._(t`Depositing`)}</Dots>
                ) : loading ? (
                  ''
                ) : error ? (
                  error
                ) : (
                  i18n._(t`Confirm Deposit`)
                )

                return (
                  <div className={classNames(!isMax ? 'grid grid-cols-2 gap-3' : 'flex')}>
                    {!isMax && (
                      <Button fullWidth color="blue" disabled={isMax} onClick={onMax}>
                        {i18n._(t`Max Deposit`)}
                      </Button>
                    )}
                    <Button
                      id={`btn-${buttonText.toString().replace(/\s/g, '')}`}
                      loading={loading}
                      fullWidth
                      color="gradient"
                      disabled={disabled}
                      onClick={() => dispatch(setAddShowReview(true))}
                    >
                      {buttonText}
                    </Button>
                  </div>
                )
              }}
            </TridentApproveGate>
          </div>
        </div>
        {!error && !isDesktop && (
          <div className="flex flex-col">
            <TransactionDetails />
          </div>
        )}
      </div>
    </>
  )
}

export default ClassicStandardMode
