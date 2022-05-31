import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, CurrencyAmount, currencyEquals, NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Web3Connect from 'app/components/Web3Connect'
import { ZERO_PERCENT } from 'app/constants'
import { useFarmListItemDetailsModal } from 'app/features/onsen/FarmListItemDetails'
import PoolAddLiquidityReviewContent from 'app/features/onsen/PoolAddLiquidityReviewContent'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useRouterContract } from 'app/hooks/useContract'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppSelector } from 'app/state/hooks'
import { Field } from 'app/state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'app/state/mint/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import React, { useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const PoolDeposit = ({ currencyA, currencyB, header }) => {
  const { i18n } = useLingui()
  const { setContent } = useFarmListItemDetailsModal()
  const { account, chainId, library } = useActiveWeb3React()
  const [useETH, setUseETH] = useState(chainId !== ChainId.CELO)
  const [isExpertMode] = useExpertModeManager()
  const deadline = useTransactionDeadline() // custom from users settings
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm
  const allowedSlippage = useAppSelector(selectSlippage)
  const routerContract = useRouterContract()
  const addTransaction = useTransactionAdder()

  // @ts-ignore TYPE NEEDS FIXING
  chainId && useETH && currencyA && currencyEquals(currencyA, WNATIVE[chainId]) && (currencyA = NATIVE[chainId])
  // @ts-ignore TYPE NEEDS FIXING
  chainId && useETH && currencyB && currencyEquals(currencyB, WNATIVE[chainId]) && (currencyB = NATIVE[chainId])

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
        (currencyB && currencyEquals(currencyB, WNATIVE[chainId])))
  )

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const { dependentField, currencies, parsedAmounts, noLiquidity, liquidityMinted, poolTokenPercentage, error } =
    useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerContract?.address)

  const minLiquidityMintedJSBI = liquidityMinted
    ? calculateSlippageAmount(liquidityMinted, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0]
    : undefined

  const minLiquidityCurrencyAmount =
    liquidityMinted?.currency && minLiquidityMintedJSBI
      ? CurrencyAmount.fromRawAmount(liquidityMinted.currency, minLiquidityMintedJSBI)
      : undefined

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          setContent(
            <PoolAddLiquidityReviewContent
              noLiquidity={noLiquidity}
              liquidityMinted={liquidityMinted}
              poolShare={poolTokenPercentage}
              parsedAmounts={parsedAmounts}
              execute={onAdd}
              txHash={response.hash}
            />
          )

          addTransaction(response, {
            summary: i18n._(
              t`Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                currencies[Field.CURRENCY_A]?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
            ),
          })

          gtag('event', 'Add', {
            event_category: 'Liquidity',
            event_label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      })
  }

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        {header}
        <AssetInput
          size="sm"
          id="add-liquidity-input-tokena"
          value={formattedAmounts[Field.CURRENCY_A]}
          currency={currencyA}
          // @ts-ignore TYPE NEEDS FIXING
          onChange={onFieldAInput}
        />
        <div className="z-10 flex justify-center -mt-6 -mb-6">
          <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
            <PlusIcon width={14} className="text-high-emphesis" />
          </div>
        </div>
        <AssetInput
          size="sm"
          id="add-liquidity-input-tokena"
          value={formattedAmounts[Field.CURRENCY_B]}
          currency={currencyB}
          // @ts-ignore TYPE NEEDS FIXING
          onChange={onFieldBInput}
          className="!mt-0"
        />
        {(oneCurrencyIsETH || oneCurrencyIsWETH) && chainId != ChainId.CELO && (
          <div className="flex justify-center">
            <Button size="xs" variant="empty" color="blue" className="rounded-none" onClick={() => setUseETH(!useETH)}>
              {i18n._(t`Use`)} {useETH && 'W'}
              {/* @ts-ignore TYPE NEEDS FIXING */}
              {NATIVE[chainId].symbol} instead of {!useETH && 'W'}
              {/* @ts-ignore TYPE NEEDS FIXING */}
              {NATIVE[chainId].symbol}
            </Button>
          </div>
        )}
      </HeadlessUiModal.BorderedContent>
      {!account ? (
        <Web3Connect fullWidth />
      ) : isValid &&
        (approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) ? (
        <div className="flex gap-4">
          {approvalA !== ApprovalState.APPROVED && (
            <Button
              fullWidth
              loading={approvalA === ApprovalState.PENDING}
              onClick={approveACallback}
              disabled={approvalA === ApprovalState.PENDING}
              style={{
                width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%',
              }}
            >
              {i18n._(t`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)}
            </Button>
          )}
          {approvalB !== ApprovalState.APPROVED && (
            <Button
              fullWidth
              loading={approvalB === ApprovalState.PENDING}
              onClick={approveBCallback}
              disabled={approvalB === ApprovalState.PENDING}
            >
              {i18n._(t`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)}
            </Button>
          )}
        </div>
      ) : (
        <Button
          color={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'red' : 'blue'}
          onClick={() => {
            isExpertMode
              ? onAdd()
              : setContent(
                  <PoolAddLiquidityReviewContent
                    noLiquidity={noLiquidity}
                    liquidityMinted={minLiquidityCurrencyAmount}
                    poolShare={poolTokenPercentage}
                    parsedAmounts={parsedAmounts}
                    execute={onAdd}
                  />
                )
          }}
          disabled={!isValid || attemptingTxn}
          fullWidth
        >
          {error ?? i18n._(t`Confirm Adding Liquidity`)}
        </Button>
      )}
    </>
  )
}

export default PoolDeposit
