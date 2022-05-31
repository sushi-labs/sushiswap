import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Trade, TradeType } from '@sushiswap/core-sdk'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import useLimitOrderExecute, { DepositPayload } from 'app/features/legacy/limit-order/useLimitOrderExecute'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { useBentoBoxContract } from 'app/hooks'
import useENS from 'app/hooks/useENS'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { setFromBentoBalance, setLimitOrderBentoPermit, setLimitOrderShowReview } from 'app/state/limit-order/actions'
import { useLimitOrderDerivedInputError, useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC, useCallback, useState } from 'react'

interface LimitOrderButton {
  trade?: Trade<Currency, Currency, TradeType>
  parsedAmounts: {
    inputAmount?: CurrencyAmount<Currency>
    outputAmount?: CurrencyAmount<Currency>
  }
}

const LimitOrderButton: FC<LimitOrderButton> = ({ trade, parsedAmounts }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { fromBentoBalance, bentoPermit, attemptingTxn, recipient } = useLimitOrderState()
  const { address } = useENS(recipient)

  const error = useLimitOrderDerivedInputError({ trade })
  const { deposit } = useLimitOrderExecute()
  const bentoboxContract = useBentoBoxContract()
  const masterContractAddress = chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined
  const [permitError, setPermitError] = useState(false)

  const _deposit = useCallback(
    async (payload: DepositPayload) => {
      const tx = await deposit(payload)
      if (tx?.hash) {
        dispatch(setFromBentoBalance(true))
      }
    },
    [deposit, dispatch]
  )

  const handler = useCallback(async () => {
    if (!parsedAmounts?.inputAmount) return

    if (fromBentoBalance) {
      dispatch(setLimitOrderShowReview(true))
    } else {
      await _deposit({
        inputAmount: parsedAmounts?.inputAmount,
        bentoPermit,
        fromBentoBalance,
      })
    }
  }, [_deposit, bentoPermit, dispatch, fromBentoBalance, parsedAmounts?.inputAmount])

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        inputAmounts={[trade?.inputAmount]}
        tokenApproveOn={bentoboxContract?.address}
        masterContractAddress={masterContractAddress}
        {...(fromBentoBalance
          ? { withPermit: false }
          : {
              withPermit: true,
              permit: bentoPermit,
              onPermit: (permit) => dispatch(setLimitOrderBentoPermit(permit)),
              onPermitError: () => setPermitError(true),
            })}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn || Boolean(recipient && !address && error)
          return (
            <Button
              loading={loading || attemptingTxn}
              color="gradient"
              disabled={disabled}
              onClick={handler}
              className="rounded-2xl md:rounded"
            >
              {error ? error : fromBentoBalance ? i18n._(t`Review Limit Order`) : i18n._(t`Confirm Deposit`)}
            </Button>
          )
        }}
      </TridentApproveGate>
    </>
  )
}

export default LimitOrderButton
