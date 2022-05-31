import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fraction } from '@sushiswap/core-sdk'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { useTridentPoolContract } from 'app/hooks'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import React, { FC } from 'react'

const TransactionDetailsExplanationModal: FC = ({ children }) => {
  const { i18n } = useLingui()
  const { poolWithState } = usePoolContext()
  const contract = useTridentPoolContract(poolWithState?.pool)
  const { result } = useSingleCallResult(contract, 'barFee')

  return (
    <HeadlessUiModal trigger={children}>
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {({ setOpen }) => (
        <div className="flex flex-col gap-4 lg:max-w-2xl">
          <HeadlessUiModal.Header header={i18n._(t`Transaction Details`)} onClose={() => setOpen(false)} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border-dark-800">
            <div className="flex flex-col gap-2">
              <Typography weight={700} variant="sm" className="text-high-emphesis">
                {i18n._(t`Minimum Received`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`The minimum amount you’ll receive from your transaction, or else the transaction will revert.`
                )}
              </Typography>
            </div>
            <div className="flex flex-col gap-2">
              <Typography weight={700} variant="sm" className="text-high-emphesis">
                {i18n._(t`Price Impact`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`The difference between market price and estimated price due to the proportional makeup of the assets deposited.`
                )}{' '}
              </Typography>
            </div>
          </HeadlessUiModal.BorderedContent>
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4">
            {poolWithState?.pool?.fee && (
              <div className="flex flex-col gap-2">
                <Typography weight={700} variant="sm" className="text-high-emphesis">
                  {i18n._(t`Liquidity Provider Fee`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(
                    t`${new Fraction(poolWithState?.pool?.fee.toString(), 100).toSignificant(
                      2
                    )}% of each swap goes to liquidity providers.`
                  )}
                </Typography>
              </div>
            )}
            {result && Array.isArray(result) && result.length > 0 && (
              <div className="flex flex-col gap-2">
                <Typography weight={700} variant="sm" className="text-high-emphesis">
                  {i18n._(t`xSUSHI Fee`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(t`${new Fraction(result[0], 100).toSignificant(2)}% of each swap goes to xSUSHI holders.`)}{' '}
                </Typography>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Typography weight={700} variant="sm" className="text-high-emphesis">
                {i18n._(t`Estimated network Fee`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`This is our estimate of how much the gas cost for your transaction will be. Your wallet will give the true and final gas cost, which may be different from what is quoted.`
                )}
              </Typography>
            </div>
          </HeadlessUiModal.BorderedContent>
          <HeadlessUiModal.BorderedContent className="border-purple/60">
            <Typography variant="sm">
              {i18n._(
                t`Depositing with Zap Mode involves swapping your asset for the assets in the pool - this makes your transaction subject to swap-related fees.`
              )}
            </Typography>
          </HeadlessUiModal.BorderedContent>
        </div>
      )}
    </HeadlessUiModal>
  )
}

export default TransactionDetailsExplanationModal
