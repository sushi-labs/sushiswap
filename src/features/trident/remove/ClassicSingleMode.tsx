import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, Percent, WNATIVE } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import AssetSelect from 'app/components/AssetSelect'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import PercentInput from 'app/components/Input/Percent'
import ListPanel from 'app/components/ListPanel'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import {
  selectTridentRemove,
  setRemoveBentoPermit,
  setRemoveOutputToWallet,
  setRemovePercentageAmount,
  setRemoveShowReview,
  setRemoveSLPPermit,
  setRemoveZapCurrency,
} from 'app/features/trident/remove/removeSlice'
import {
  useRemoveLiquidityDerivedCurrencyAmountSingle,
  useRemoveLiquidityDerivedInputError,
  useRemoveLiquidityDerivedSLPAmount,
  useRemoveLiquidityZapCurrency,
} from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { classNames } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import SumUSDCValues from '../SumUSDCValues'
import TridentApproveGate from '../TridentApproveGate'

const ClassicSingleMode: FC = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const dispatch = useAppDispatch()
  const { poolBalance, poolWithState, liquidityValue } = usePoolContext()
  const error = useRemoveLiquidityDerivedInputError()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()
  const parsedAmountSingleToken = useRemoveLiquidityDerivedCurrencyAmountSingle()
  const zapCurrency = useRemoveLiquidityZapCurrency()
  const { percentageAmount, outputToWallet, attemptingTxn, bentoPermit } = useAppSelector(selectTridentRemove)

  const toggleButtonGroup = (
    <ToggleButtonGroup
      value={percentageAmount}
      onChange={(val: string) => dispatch(setRemovePercentageAmount(val))}
      variant="outlined"
      size="sm"
      className="!bg-dark-900 rounded border border-dark-800 h-9"
    >
      <ToggleButtonGroup.Button value="25" className="px-6">
        25%
      </ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="50" className="px-6">
        50%
      </ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="75" className="px-6">
        75%
      </ToggleButtonGroup.Button>
      <ToggleButtonGroup.Button value="100" className="px-6">
        Max
      </ToggleButtonGroup.Button>
    </ToggleButtonGroup>
  )

  const oneTokenIsWETH =
    poolWithState?.pool?.token0.address === WNATIVE[chainId || 1].address ||
    poolWithState?.pool?.token1.address === WNATIVE[chainId || 1].address
  const assetSelectCurrencies = [poolWithState?.pool?.token0, poolWithState?.pool?.token1]
  // @ts-ignore TYPE NEEDS FIXING
  if (oneTokenIsWETH) assetSelectCurrencies.push(NATIVE[chainId || 1])

  return (
    <SumUSDCValues amounts={liquidityValue}>
      {({ amount }) => {
        const selectedLiquidityValueInUsdc = amount?.multiply(new Percent(percentageAmount, '100'))
        return (
          <div className="flex flex-col gap-8">
            <AssetSelect
              value={zapCurrency}
              onSelect={(currency) =>
                dispatch(setRemoveZapCurrency(currency.isNative ? 'ETH' : currency.wrapped.address))
              }
              currencies={assetSelectCurrencies}
            />
            <div className={classNames(zapCurrency ? '' : 'pointer-events-none opacity-50', 'flex flex-col gap-3')}>
              <div className="flex items-center justify-between gap-10 lg:mb-2">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Amount to Remove:`)}
                </Typography>
                <div className="hidden lg:block">{toggleButtonGroup}</div>
              </div>
              <ListPanel
                header={
                  <ListPanel.Header
                    title={i18n._(t`Balances`)}
                    value={`$${amount ? amount.toSignificant(6) : '0.0000'}`}
                    subValue={`${poolBalance ? poolBalance.toSignificant(6) : '0.0000'} SLP`}
                  />
                }
                items={[
                  liquidityValue.map((amount, index) => <ListPanel.CurrencyAmountItem amount={amount} key={index} />),
                ]}
                footer={
                  <div className="flex items-center justify-between gap-3 px-4 py-5">
                    <PercentInput
                      value={percentageAmount}
                      onUserInput={(val) => dispatch(setRemovePercentageAmount(val))}
                      placeholder="0%"
                      className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow font-bold text-high-emphesis"
                    />
                    <Typography variant="sm" className="text-low-emphesis" weight={700}>
                      ≈$
                      {selectedLiquidityValueInUsdc?.greaterThan('0')
                        ? selectedLiquidityValueInUsdc?.toSignificant(6)
                        : '0.0000'}
                    </Typography>
                  </div>
                }
              />
              <div className="block lg:hidden">{toggleButtonGroup}</div>
              <div className="hidden lg:block" />
              <TridentApproveGate
                inputAmounts={[slpAmountToRemove]}
                tokenApproveOn={router?.address}
                withPermit={true}
                permit={bentoPermit}
                onPermit={(permit) => dispatch(setRemoveBentoPermit(permit))}
                onSLPPermit={(permit) => dispatch(setRemoveSLPPermit(permit))}
              >
                {({ approved, loading }) => {
                  const disabled = !!error || !approved || loading || attemptingTxn
                  const buttonText = attemptingTxn ? (
                    <Dots>{i18n._(t`Withdrawing`)}</Dots>
                  ) : loading ? (
                    ''
                  ) : error ? (
                    error
                  ) : (
                    i18n._(t`Confirm Withdrawal`)
                  )

                  return (
                    <Button
                      size="lg"
                      loading={loading}
                      color={approved ? 'gradient' : 'blue'}
                      disabled={disabled}
                      onClick={() => dispatch(setRemoveShowReview(true))}
                    >
                      <Typography
                        variant="sm"
                        weight={700}
                        className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}
                      >
                        {buttonText}
                      </Typography>
                    </Button>
                  )
                }}
              </TridentApproveGate>
            </div>
            <div className="flex flex-col block gap-5 lg:hidden">
              <div className="flex justify-between gap-3">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Receive:`)}
                </Typography>
                <AssetInput.WalletSwitch
                  onChange={() => dispatch(setRemoveOutputToWallet(!outputToWallet))}
                  checked={outputToWallet}
                />
              </div>
              <div className="flex flex-col gap-4">
                <ListPanel items={[<ListPanel.CurrencyAmountItem amount={parsedAmountSingleToken} key={0} />]} />
              </div>
            </div>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}

export default ClassicSingleMode
