import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Divider from 'app/components/Divider'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import BentoBoxFundingSourceModal from 'app/features/trident/add/BentoBoxFundingSourceModal'
import { selectTridentRemove, setRemoveOutputToWallet } from 'app/features/trident/remove/removeSlice'
import { useRemoveDetails } from 'app/features/trident/remove/useRemoveDetails'
import {
  useRemoveLiquidityDerivedInputError,
  useRemoveLiquidityZapCurrency,
} from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { useMemo } from 'react'

import TransactionDetails from './TransactionDetails'

const ClassicSingleAside = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const zapCurrency = useRemoveLiquidityZapCurrency()
  const error = useRemoveLiquidityDerivedInputError()

  const { minLiquidityOutputSingleToken } = useRemoveDetails()
  const minOutputAmount = useMemo(
    () => minLiquidityOutputSingleToken(zapCurrency),
    [minLiquidityOutputSingleToken, zapCurrency]
  )
  const usdcValue = useUSDCValue(minOutputAmount)
  const { outputToWallet } = useAppSelector(selectTridentRemove)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-8 p-10 rounded shadow-lg bg-dark-1000">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis">
          {i18n._(t`Zap Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`Select any asset from your wallet or BentoBox balance to invest in this pool.  That asset will be split and converted into the pool assets and deposited in equal value.`
          )}
        </Typography>
      </div>
      <div className="flex justify-between p-5 mb-2 rounded bg-dark-900">
        <div className="flex items-center gap-2">
          <Typography variant="sm">{i18n._(t`Withdraw to:`)}</Typography>
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
          </Typography>
          <BentoBoxFundingSourceModal />
        </div>
        <Switch
          checked={outputToWallet}
          onChange={() => dispatch(setRemoveOutputToWallet(!outputToWallet))}
          checkedIcon={
            <div className="flex items-center justify-center w-full h-full text-dark-700">
              <WalletIcon width={16} height={14} />
            </div>
          }
          uncheckedIcon={
            <div className="flex items-center justify-center w-full h-full text-dark-700">
              <BentoboxIcon width={16} height={16} />
            </div>
          }
        />
      </div>
      {!outputToWallet && zapCurrency?.isNative && (
        <Alert
          className="bg-transparent"
          dismissable={false}
          type="error"
          message={i18n._(
            // @ts-ignore TYPE NEEDS FIXING
            t`Native ${NATIVE[chainId || 1].symbol} can't be withdrawn to BentoBox, ${
              WNATIVE[chainId || 1].symbol
            } will be received instead`
          )}
        />
      )}
      <div className="flex flex-col gap-5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`You'll Receive (at least):`)}
        </Typography>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 items-center">
            <CurrencyLogo currency={minOutputAmount?.currency} size={20} />
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {minOutputAmount?.greaterThan(0) ? minOutputAmount.toSignificant(6) : '0.00'}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {!outputToWallet && zapCurrency?.isNative ? zapCurrency.wrapped.symbol : zapCurrency?.symbol}
            </Typography>
          </div>
          <Typography variant="sm" weight={700} className="text-secondary">
            ≈${usdcValue?.greaterThan(0) ? usdcValue.toSignificant(2) : '0.00'}
          </Typography>
        </div>
        <Divider className="mt-5 border-dark-700" />
        <div className="flex justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Total Amount`)}
          </Typography>
          <Typography weight={700} className="text-high-emphesis">
            ≈${usdcValue?.greaterThan(0) ? usdcValue.toSignificant(2) : '0.00'}
          </Typography>
        </div>
      </div>
      <div className={error ? 'opacity-50' : 'opacity-100'}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicSingleAside
