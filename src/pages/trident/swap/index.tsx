import { Transition } from '@headlessui/react'
import { ArrowDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TradeVersion, ZERO } from '@sushiswap/core-sdk'
import Banner from 'app/components/Banner'
import RecipientField from 'app/components/RecipientField'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import ConfirmSwapModal from 'app/features/legacy/swap/ConfirmSwapModal'
import SwapCallbackError from 'app/features/legacy/swap/SwapCallbackError'
import SwapDetails from 'app/features/legacy/swap/SwapDetails'
import UnsupportedCurrencyFooter from 'app/features/legacy/swap/UnsupportedCurrencyFooter'
import HeaderNew from 'app/features/trade/HeaderNew'
import _useSwapPage from 'app/features/trident/swap/_useSwapPage'
import { DerivedTradeContext } from 'app/features/trident/swap/DerivedTradeContext'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import SwapButton from 'app/features/trident/swap/SwapButton'
import {
  selectTridentSwap,
  setAttemptingTxn,
  setBentoPermit,
  setReceiveToWallet,
  setRecipient,
  setSpendFromWallet,
  setTridentSwapState,
  TypedField,
} from 'app/features/trident/swap/swapSlice'
import WrapButton from 'app/features/trident/swap/WrapButton'
import useCurrenciesFromURL from 'app/features/trident/useCurrenciesFromURL'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import NetworkGuard from 'app/guards/Network'
import useENS from 'app/hooks/useENS'
import { useIsSwapUnsupported } from 'app/hooks/useIsSwapUnsupported'
import { useSwapCallback } from 'app/hooks/useSwapCallback'
import useSwapSlippageTolerance from 'app/hooks/useSwapSlippageTollerence'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import { TradeUnion } from 'app/types'
import React, { useCallback, useMemo, useState } from 'react'

import { SwapProps } from '../../swap'

const Swap = ({ banners }: SwapProps) => {
  const { formattedAmounts, trade, priceImpact, isWrap, parsedAmounts, error } = _useSwapPage()
  const tradeVersion = getTradeVersion(trade)
  const { i18n } = useLingui()
  const { currencies, setURLCurrency, switchCurrencies } = useCurrenciesFromURL()
  const [expertMode] = useExpertModeManager()
  const dispatch = useAppDispatch()
  const tridentSwapState = useAppSelector(selectTridentSwap)
  const {
    typedField,
    spendFromWallet,
    receiveToWallet,
    recipient,
    attemptingTxn,
    showReview,
    error: swapStateError,
    bentoPermit,
  } = tridentSwapState
  const { address } = useENS(recipient)
  const [txHash, setTxHash] = useState<string>()
  const [confirmTrade, setConfirmTrade] = useState<TradeUnion>()
  const swapIsUnsupported = useIsSwapUnsupported(currencies[0], currencies[1])
  const allowedSlippage = useSwapSlippageTolerance(trade)
  const [executeError, setExecuteError] = useState<string>()

  const _spendFromWallet = tradeVersion === TradeVersion.V2TRADE ? true : spendFromWallet
  const _receiveToWallet = tradeVersion === TradeVersion.V2TRADE ? true : receiveToWallet

  const handleArrowsClick = useCallback(async () => {
    dispatch(setTridentSwapState({ ...tridentSwapState, value: '', typedField: TypedField.A }))
    await switchCurrencies()
  }, [dispatch, switchCurrencies, tridentSwapState])

  const { callback, error: cbError } = useSwapCallback(trade, allowedSlippage, address ?? undefined, null, {
    receiveToWallet: _receiveToWallet,
    fromWallet: _spendFromWallet,
    parsedAmounts,
    bentoPermit,
    resetBentoPermit: () => dispatch(setBentoPermit(undefined)),
  })

  const execute = useCallback(async () => {
    if (!callback) return
    dispatch(setAttemptingTxn(true))

    let { value, typedField } = tridentSwapState
    try {
      const txHash = await callback()
      setTxHash(txHash)

      value = ''
      typedField = TypedField.A
    } catch (e) {
      // @ts-ignore TYPE NEEDS FIXING
      setExecuteError(e.message)
    }

    dispatch(setTridentSwapState({ ...tridentSwapState, value, typedField, attemptingTxn: false }))
  }, [callback, dispatch, tridentSwapState])

  const handleDismiss = useCallback(() => {
    dispatch(setTridentSwapState({ ...tridentSwapState, showReview: false, error: undefined }))
    setTxHash(undefined)
  }, [dispatch, tridentSwapState])

  return (
    <>
      <SwapLayoutCard>
        <div className="px-2">
          <HeaderNew inputCurrency={currencies[0]} outputCurrency={currencies[1]} trident={true} />
        </div>
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
            error={typedField === TypedField.A && !!error && !!formattedAmounts[0]}
            header={(props) => <SwapAssetPanel.Header {...props} id={`asset-select-trigger-${TypedField.A}`} />}
            walletToggle={(props) => (
              <Transition
                show={!trade || tradeVersion === TradeVersion.V3TRADE}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <SwapAssetPanel.Switch
                  {...props}
                  label={i18n._(t`Pay from`)}
                  onChange={(spendFromWallet) => dispatch(setSpendFromWallet(spendFromWallet))}
                  id="chk-pay-from-wallet"
                />
              </Transition>
            )}
            selected={typedField === TypedField.A}
            spendFromWallet={_spendFromWallet}
            currency={currencies[0]}
            value={formattedAmounts[0]}
            onChange={(value) =>
              dispatch(setTridentSwapState({ ...tridentSwapState, value: value || '', typedField: TypedField.A }))
            }
            onSelect={(currency) => setURLCurrency(currency, 0)}
          />
          <div className="z-0 flex justify-center -mt-6 -mb-6">
            <div
              role="button"
              className="p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-dark-600"
              onClick={handleArrowsClick}
            >
              <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
            </div>
          </div>
          <SwapAssetPanel
            error={typedField === TypedField.B && !!error && !!formattedAmounts[0]}
            header={(props) => <SwapAssetPanel.Header {...props} id={`asset-select-trigger-${TypedField.B}`} />}
            walletToggle={(props) => (
              <Transition
                show={!trade || tradeVersion === TradeVersion.V3TRADE}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <SwapAssetPanel.Switch
                  {...props}
                  label={i18n._(t`Receive to`)}
                  onChange={(receiveToWallet) => dispatch(setReceiveToWallet(receiveToWallet))}
                  id="chk-receive-to-wallet"
                />
              </Transition>
            )}
            selected={typedField === TypedField.B}
            spendFromWallet={_receiveToWallet}
            currency={currencies[1]}
            value={formattedAmounts[1]}
            onChange={(value) => {
              // Change typedField to TypedField.B once exactOut is available
              dispatch(setTridentSwapState({ ...tridentSwapState, value: value || '', typedField: TypedField.A }))
            }}
            onSelect={(currency) => setURLCurrency(currency, 1)}
            priceImpact={priceImpact}
            // Remove when exactOut works
            inputDisabled={true}
          />
          <DerivedTradeContext.Provider
            value={useMemo(
              () => ({
                formattedAmounts,
                trade,
                priceImpact,
                error: error ?? swapStateError ?? cbError ?? undefined,
                isWrap,
                parsedAmounts,
              }),
              [cbError, error, formattedAmounts, isWrap, parsedAmounts, priceImpact, swapStateError, trade]
            )}
          >
            {expertMode && <RecipientField recipient={recipient} action={setRecipient} />}
            {Boolean(trade) && (
              <SwapDetails
                inputCurrency={currencies[0]}
                outputCurrency={currencies[1]}
                trade={trade}
                recipient={recipient ?? undefined}
              />
            )}
            {trade && !trade?.route && parsedAmounts[0]?.greaterThan(ZERO) && (
              <Typography variant="xs" className="py-2 text-center">
                {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
              </Typography>
            )}
            {isWrap ? (
              <WrapButton />
            ) : (
              <SwapButton onClick={(trade) => setConfirmTrade(trade)} spendFromWallet={_spendFromWallet} />
            )}
          </DerivedTradeContext.Provider>
          {expertMode && executeError ? <SwapCallbackError error={executeError} /> : null}
          {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies[0], currencies[1]]} /> : null}
        </div>
        <ConfirmSwapModal
          isOpen={showReview}
          trade={trade}
          originalTrade={confirmTrade}
          onAcceptChanges={() => setConfirmTrade(trade)}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={allowedSlippage}
          onConfirm={execute}
          swapErrorMessage={swapStateError}
          onDismiss={handleDismiss}
        />
      </SwapLayoutCard>
      <Typography variant="xs" className="px-10 mt-5 text-center text-low-emphesis">
        <Typography variant="xs" weight={700} component="span">
          Tip
        </Typography>
        : {i18n._(t`BentoBox to BentoBox swaps are up to 50% cheaper than normal swaps`)}
      </Typography>
      <Banner banners={banners} />
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
Swap.Guard = NetworkGuard(Feature.TRIDENT)

export default Swap
