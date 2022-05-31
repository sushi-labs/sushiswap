import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, CurrencyAmount, currencyEquals, NATIVE, Percent, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { useFarmListItemDetailsModal } from 'app/features/onsen/FarmListItemDetails'
import PoolRemoveLiquidityReviewContent from 'app/features/onsen/PoolRemoveLiquidityReviewContent'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { usePairContract, useRouterContract } from 'app/hooks/useContract'
import { useV2LiquidityTokenPermit } from 'app/hooks/useERC20Permit'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { Field } from 'app/state/burn/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'app/state/burn/hooks'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippageWithDefault } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import React, { useCallback, useMemo, useState } from 'react'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

// @ts-ignore TYPE NEEDS FIXING
const PoolWithdraw = ({ currencyA, currencyB, header }) => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const { setContent } = useFarmListItemDetailsModal()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [useETH, setUseETH] = useState(false)
  // @ts-ignore TYPE NEEDS FIXING
  useETH && currencyA && currencyEquals(currencyA, WNATIVE[chainId]) && (currencyA = NATIVE[chainId])
  // @ts-ignore TYPE NEEDS FIXING
  useETH && currencyB && currencyEquals(currencyB, WNATIVE[chainId]) && (currencyB = NATIVE[chainId])
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const { typedValue } = useBurnState()
  const { pair, parsedAmounts, error, userLiquidity } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // txn values
  const deadline = useTransactionDeadline()
  const allowedSlippage = useAppSelector(selectSlippageWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE))

  // pair contract
  const pairContract = usePairContract(pair?.liquidityToken?.address)

  // router contract
  const routerContract = useRouterContract()

  // allowance handling
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address
  )
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], routerContract?.address)

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (chainId !== ChainId.HARMONY && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        // @ts-ignore TYPE NEEDS FIXING
        if (error?.code !== USER_REJECTED_TX) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  )

  const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
  const amountsMin =
    parsedAmountA && parsedAmountB
      ? {
          [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, allowedSlippage)[0],
          [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, allowedSlippage)[0],
        }
      : undefined

  const amountsMinCurrencyAmount = {
    [Field.CURRENCY_A]:
      amountsMin?.[Field.CURRENCY_A] && parsedAmountA
        ? CurrencyAmount.fromRawAmount(
            // @ts-ignore TYPE NEEDS FIXING
            currencyA.isNative ? NATIVE[chainId || 1] : parsedAmountA.currency,
            amountsMin[Field.CURRENCY_A]
          )
        : undefined,
    [Field.CURRENCY_B]:
      amountsMin?.[Field.CURRENCY_B] && parsedAmountB
        ? CurrencyAmount.fromRawAmount(
            // @ts-ignore TYPE NEEDS FIXING
            currencyB.isNative ? NATIVE[chainId || 1] : parsedAmountB.currency,
            amountsMin[Field.CURRENCY_B]
          )
        : undefined,
  }

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline || !routerContract) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB.isNative
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[Field.CURRENCY_A].toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[Field.CURRENCY_A].toString(),
          // @ts-ignore TYPE NEEDS FIXING
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: t`Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setContent(
            <PoolRemoveLiquidityReviewContent
              liquidityAmount={parsedAmounts[Field.LIQUIDITY]}
              parsedAmounts={[parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B]]}
              execute={onRemove}
              txHash={response.hash}
            />
          )

          gtag('event', 'Remove', {
            event_category: 'Liquidity',
            event_label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)

          gtag('event', 'Remove Failed', {
            event_category: 'Liquidity',
            event_label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
    }
  }

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative

  const oneCurrencyIsWETH = Boolean(
    chainId && WNATIVE[chainId] && (currencyA?.equals(WNATIVE[chainId]) || currencyB?.equals(WNATIVE[chainId]))
  )

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        {header}
        <AssetInput
          currencyLogo={false}
          currency={pair?.liquidityToken}
          value={typedValue}
          // @ts-ignore TYPE NEEDS FIXING
          onChange={onLiquidityInput}
        />
        <div className="flex justify-between mx-2 mt-2">
          <Typography weight={700} variant="sm" className="text-secondary">
            {i18n._(t`You'll receive (at least):`)}
          </Typography>
          {(oneCurrencyIsETH || oneCurrencyIsWETH) && (
            <Button size="xs" variant="empty" color="blue" className="rounded-none" onClick={() => setUseETH(!useETH)}>
              {i18n._(t`Receive`)} {useETH && 'W'}
              {/* @ts-ignore TYPE NEEDS FIXING */}
              {NATIVE[chainId].symbol}
            </Button>
          )}
        </div>
        <ListPanel
          items={Object.values(amountsMinCurrencyAmount).map((parsedInputAmount, index) => (
            <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
          ))}
        />
      </HeadlessUiModal.BorderedContent>
      {!userLiquidity?.equalTo(ZERO) && (
        <Typography variant="xs" className="italic text-center">
          {i18n._(t`If your SLP is staked, you cannot remove your liquidity. You must unstake first.`)}
        </Typography>
      )}
      {!account ? (
        <Web3Connect fullWidth />
      ) : isValid && approval !== ApprovalState.APPROVED && signatureData === null ? (
        <Button
          fullWidth
          loading={approval === ApprovalState.PENDING}
          onClick={onAttemptToApprove}
          disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
        >
          {i18n._(t`Approve`)}
        </Button>
      ) : (
        <Button
          fullWidth
          loading={attemptingTxn}
          color={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'red' : 'blue'}
          onClick={() => {
            setContent(
              <PoolRemoveLiquidityReviewContent
                liquidityAmount={parsedAmounts[Field.LIQUIDITY]}
                parsedAmounts={Object.values(amountsMinCurrencyAmount)}
                execute={onRemove}
              />
            )
          }}
          disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
        >
          {error || i18n._(t`Confirm Withdrawal`)}
        </Button>
      )}
    </>
  )
}

export default PoolWithdraw
