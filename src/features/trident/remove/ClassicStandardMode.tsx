import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, WNATIVE } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
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
  setRemoveReceiveNative,
  setRemoveShowReview,
  setRemoveSLPPermit,
} from 'app/features/trident/remove/removeSlice'
import {
  useRemoveLiquidityDerivedCurrencyAmounts,
  useRemoveLiquidityDerivedInputError,
  useRemoveLiquidityDerivedSLPAmount,
} from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useTridentRouterContract } from 'app/hooks'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

import SumUSDCValues from '../SumUSDCValues'

const CurrencyAmountItemWithEthSelector: FC<{
  amount?: CurrencyAmount<Currency>
}> = ({ amount }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const usdcValue = useUSDCValue(amount)
  const { receiveNative } = useAppSelector(selectTridentRemove)

  if (amount?.currency.wrapped.address !== WNATIVE[chainId || 1].address) {
    return <ListPanel.CurrencyAmountItem amount={amount} />
  }

  return (
    <ListPanel.Item
      left={
        <div className="flex flex-row gap-1.5 lg:gap-3 items-center">
          <CurrencyLogo currency={amount?.currency} size={20} className="!rounded-full" />
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {amount?.toSignificant(6)} {amount?.currency.symbol}
          </Typography>
          <Typography
            variant="sm"
            weight={700}
            className="cursor-pointer text-blue"
            onClick={() => dispatch(setRemoveReceiveNative(!receiveNative))}
            id="btn-receive-native"
          >
            {receiveNative ? i18n._(t`Receive WETH instead`) : i18n._(t`Receive ETH instead`)}
          </Typography>
        </div>
      }
      right={<ListPanel.Item.Right>≈${usdcValue ? usdcValue?.toFixed(2) : '0.00'}</ListPanel.Item.Right>}
      key={0}
    />
  )
}

const ClassicStandardMode: FC = () => {
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const { poolBalance, liquidityValue } = usePoolContext()
  const dispatch = useAppDispatch()
  const { attemptingTxn, bentoPermit, outputToWallet, percentageAmount } = useAppSelector(selectTridentRemove)
  const error = useRemoveLiquidityDerivedInputError()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()
  const parsedAmounts = useRemoveLiquidityDerivedCurrencyAmounts()

  const toggleButtonGroup = (
    <ToggleButtonGroup
      value={percentageAmount}
      onChange={(val: string) => dispatch(setRemovePercentageAmount(val))}
      variant="outlined"
      id={`blamanam`}
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

  return (
    <SumUSDCValues amounts={liquidityValue}>
      {({ amount }) => {
        const selectedLiquidityValueInUsdc = amount?.multiply(new Percent(percentageAmount, '100'))
        return (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3 lg:gap-6">
              <div className="flex items-center justify-between gap-10">
                <Typography variant="h3" weight={700} className="mb-2 text-high-emphesis lg:mb-0">
                  Amount to Remove:
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
                  liquidityValue.map((el, index) => <CurrencyAmountItemWithEthSelector amount={el} key={index} />),
                ]}
                footer={
                  <div className="flex items-center justify-between gap-3 px-4 py-6">
                    <PercentInput
                      value={percentageAmount}
                      onUserInput={(val) => dispatch(setRemovePercentageAmount(val))}
                      placeholder="0%"
                      className="bg-transparent text-3xl leading-7 tracking-[-0.01em] flex-grow font-bold text-high-emphesis"
                    />
                    <Typography variant="lg" className="text-high-emphesis" weight={700}>
                      ≈$
                      {selectedLiquidityValueInUsdc?.greaterThan('0')
                        ? selectedLiquidityValueInUsdc?.toSignificant(6)
                        : '0.0000'}
                    </Typography>
                  </div>
                }
              />
              <div className="block lg:hidden">{toggleButtonGroup}</div>
              <TridentApproveGate
                inputAmounts={[slpAmountToRemove]}
                tokenApproveOn={router?.address}
                masterContractAddress={router?.address}
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
                    i18n._(t`Review and Confirm`)
                  )

                  return (
                    <Button
                      id="btn-confirm-remove-liquidity"
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
            <div className="flex flex-col block gap-4 lg:hidden">
              <div className="flex justify-between gap-3">
                <Typography variant="h3" weight={700} className="text-high-emphesis">
                  {i18n._(t`Receive:`)}
                </Typography>
                <AssetInput.WalletSwitch
                  label={i18n._(t`Withdraw to:`)}
                  onChange={() => dispatch(setRemoveOutputToWallet(!outputToWallet))}
                  checked={outputToWallet}
                />
              </div>

              <div className="flex flex-col gap-4">
                <ListPanel
                  items={[parsedAmounts.map((el, index) => <ListPanel.CurrencyAmountItem amount={el} key={index} />)]}
                  footer={
                    <div className="flex justify-between px-4 py-3.5 bg-dark-900">
                      <Typography weight={700} className="text-high-emphesis">
                        {i18n._(t`Total Amount`)}
                      </Typography>
                      <Typography weight={700} className="text-right text-high-emphesis">
                        ≈$
                        {selectedLiquidityValueInUsdc?.greaterThan('0')
                          ? selectedLiquidityValueInUsdc?.toSignificant(6)
                          : '0.0000'}
                      </Typography>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}

export default ClassicStandardMode
