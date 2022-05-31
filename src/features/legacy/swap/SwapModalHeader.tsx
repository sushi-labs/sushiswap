import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, TradeType, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import SwapDetails from 'app/features/legacy/swap/SwapDetails'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { TradeUnion } from 'app/types'
import React, { FC } from 'react'
import { ArrowDown } from 'react-feather'

interface SwapModalHeader {
  trade?: TradeUnion
  recipient?: string
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  minimumAmountOut?: CurrencyAmount<Currency>
  maximumAmountIn?: CurrencyAmount<Currency>
}

const SwapModalHeader: FC<SwapModalHeader> = ({
  trade,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  inputAmount,
  minimumAmountOut,
  outputAmount,
  maximumAmountIn,
}) => {
  const { i18n } = useLingui()
  const fiatValueInput = useUSDCValue(inputAmount)
  const fiatValueOutput = useUSDCValue(outputAmount)

  const change =
    ((Number(fiatValueOutput?.toExact()) - Number(fiatValueInput?.toExact())) / Number(fiatValueInput?.toExact())) * 100

  return (
    <div className="grid gap-2">
      <div className="flex flex-col">
        <HeadlessUiModal.BorderedContent className="bg-dark-1000/40 border !border-dark-800 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {inputAmount?.toSignificant(6)}{' '}
                </Typography>
                {fiatValueInput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">${fiatValueInput.toFixed(2)}</Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={inputAmount?.currency} size={18} className="!rounded-full overflow-hidden" />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {inputAmount?.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
        <div className="flex justify-center -mt-3 -mb-3">
          <div className="border-2 border-dark-800 shadow-md rounded-full p-1 backdrop-blur-[20px] z-10">
            <ArrowDown size={18} />
          </div>
        </div>
        <HeadlessUiModal.BorderedContent className="bg-dark-1000/40 border !border-dark-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {outputAmount?.toSignificant(6)}{' '}
                </Typography>
                {fiatValueOutput?.greaterThan(ZERO) && (
                  <Typography className="text-secondary">
                    ${fiatValueOutput?.toFixed(2)}{' '}
                    <Typography variant="xs" component="span">
                      ({change.toFixed(2)}%)
                    </Typography>
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyLogo currency={outputAmount?.currency} size={18} className="!rounded-full overflow-hidden" />
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {outputAmount?.currency.symbol}
              </Typography>
            </div>
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
      <SwapDetails
        trade={trade}
        recipient={recipient}
        inputCurrency={inputAmount?.currency}
        outputCurrency={outputAmount?.currency}
        inputAmount={inputAmount}
        outputAmount={outputAmount}
        minimumAmountOut={minimumAmountOut}
        className="!border-dark-800"
      />

      {showAcceptChanges && (
        <HeadlessUiModal.BorderedContent className="border !border-dark-800">
          <div className="flex items-center justify-between">
            <Typography variant="sm" weight={700}>
              {i18n._(t`Price Updated`)}
            </Typography>
            <Button variant="outlined" size="xs" color="blue" onClick={onAcceptChanges}>
              {i18n._(t`Accept`)}
            </Button>
          </div>
        </HeadlessUiModal.BorderedContent>
      )}
      <div className="justify-start text-sm text-center text-secondary py-2">
        {trade?.tradeType === TradeType.EXACT_INPUT ? (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Output is estimated. You will receive at least`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {minimumAmountOut?.toSignificant(6)} {outputAmount?.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        ) : (
          <Typography variant="xs" className="text-secondary">
            {i18n._(t`Input is estimated. You will sell at most`)}{' '}
            <Typography variant="xs" className="text-high-emphesis" weight={700} component="span">
              {maximumAmountIn?.toSignificant(6)} {inputAmount?.currency.symbol}
            </Typography>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default SwapModalHeader
