import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, NATIVE, Percent, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Input from 'app/components/Input'
import ListPanel from 'app/components/ListPanel'
import SettingsTab from 'app/components/Settings'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { classNames, unwrappedCurrencyAmount } from 'app/functions'
import { calculateGasMargin, calculateSlippageAmount } from 'app/functions/trade'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { usePairContract, useRouterContract } from 'app/hooks/useContract'
import useDebouncedChangeHandler from 'app/hooks/useDebouncedChangeHandler'
import { useV2LiquidityTokenPermit } from 'app/hooks/useERC20Permit'
import useTransactionDeadline from 'app/hooks/useTransactionDeadline'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { Field } from 'app/state/burn/actions'
import { useBurnActionHandlers, useDerivedBurnInfo } from 'app/state/burn/hooks'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippageWithDefault } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useMemo, useState } from 'react'
import { Plus } from 'react-feather'
const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function Remove() {
  const { i18n } = useLingui()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = tokens || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // burn state
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const allowedSlippage = useAppSelector(selectSlippageWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

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
        /* @ts-ignore TYPE NEEDS FIXING */
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

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline || !router) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
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
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
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
          amountsMin[Field.CURRENCY_A].toString(),
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
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
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
          amountsMin[Field.CURRENCY_A].toString(),
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
        /* @ts-ignore TYPE NEEDS FIXING */
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
      /* @ts-ignore TYPE NEEDS FIXING */
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

          setTxHash(response.hash)

          gtag('event', 'Remove', {
            event_category: 'Routing',
            event_label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.log(error)
        })
    }
  }

  const ModalHeader = (
    <div className="grid gap-4 pt-3 pb-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={currencyA} size={48} />
            <div className="text-2xl font-bold text-high-emphesis">
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyA?.symbol}</div>
        </div>
        <div className="ml-3 mr-3 min-w-[24px]">
          <Plus size={24} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={currencyB} size={48} />
            <div className="text-2xl font-bold text-high-emphesis">
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{currencyB?.symbol}</div>
        </div>
      </div>
      <div className="justify-start text-sm text-secondary">
        {t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
          4
        )}% your transaction will revert.`}
      </div>
    </div>
  )

  const ModalBottom = (
    <div className="p-6 mt-0 -m-6 bg-dark-800">
      {pair && (
        <>
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-high-emphesis">{i18n._(t`Rates`)}</div>
              <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                {`1 ${currencyA?.symbol} = ${tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} ${
                  currencyB?.symbol
                }`}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
                {`1 ${currencyB?.symbol} = ${tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} ${
                  currencyA?.symbol
                }`}
              </div>
            </div>
          </div>
          <div className="h-px my-6 bg-gray-700" />
        </>
      )}
      <div className="grid gap-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">{i18n._(t`${currencyA?.symbol}/${currencyB?.symbol} Burned`)}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphasis">
            {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
          </div>
        </div>
      </div>
      <Button
        color="gradient"
        size="lg"
        disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
        onClick={onRemove}
      >
        {i18n._(t`Confirm`)}
      </Button>
    </div>
  )

  const pendingText = i18n._(
    t`Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
      Field.CURRENCY_B
    ]?.toSignificant(6)} ${currencyB?.symbol}`
  )

  const liquidityPercentChangeCallback = useCallback(
    (value: string) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value)
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative
  const oneCurrencyIsWETH = Boolean(
    chainId && WNATIVE[chainId] && (currencyA?.equals(WNATIVE[chainId]) || currencyB?.equals(WNATIVE[chainId]))
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    liquidityPercentChangeCallback
  )

  const inputError = +innerLiquidityPercentage > 100 || +innerLiquidityPercentage < 0

  const currencyAmounts = [
    currencyA?.isNative ? unwrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_A]) : parsedAmounts[Field.CURRENCY_A],
    currencyB?.isNative ? unwrappedCurrencyAmount(parsedAmounts[Field.CURRENCY_B]) : parsedAmounts[Field.CURRENCY_B],
  ]

  return (
    <>
      <NextSeo title="Remove Liquidity" />
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={
          <ConfirmationModalContent
            title={i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={ModalHeader}
            bottomContent={ModalBottom}
          />
        }
        pendingText={pendingText}
      />
      <SwapLayoutCard>
        <div className="grid items-center grid-cols-3">
          <ArrowLeftIcon
            width={24}
            height={24}
            className="cursor-pointer text-high-emphesis hover:text-white focus:text-white"
            onClick={() => router.push('/pool')}
          />
          <Typography weight={700} className="text-center whitespace-nowrap text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Typography>
          <SettingsTab className="!w-6 !h-6 justify-self-end" />
        </div>
        <div className="flex flex-col gap-3">
          <div
            className={classNames(
              inputError ? 'border-red/40 hover:border-red' : 'border-dark-700 hover:border-dark-600',
              'flex flex-col gap-1 bg-dark-900 px-4 py-2 rounded border'
            )}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Percent to remove`)}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography
                weight={700}
                variant="lg"
                className="relative flex items-baseline flex-grow gap-3 overflow-hidden text-high-emphesis"
              >
                <Input.Percent
                  className="leading-[32px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
                  value={innerLiquidityPercentage}
                  onUserInput={setInnerLiquidityPercentage}
                  placeholder="0%"
                  id="liquidity-percent"
                />
              </Typography>
            </div>
          </div>
          <div className="flex-col overflow-hidden border rounded bg-dark-900 border-dark-700">
            <div className="flex items-center justify-between px-4 py-2 overflow-hidden bg-dark-900">
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {i18n._(t`You'll receive`)}
              </Typography>
              {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) && (
                <Typography variant="xs" weight={700}>
                  {oneCurrencyIsETH ? (
                    <Link
                      href={`/remove/${currencyA?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdA}/${
                        currencyB?.isNative ? WNATIVE_ADDRESS[chainId] : currencyIdB
                      }`}
                    >
                      <a className="text-baseline text-blue opacity-80 hover:opacity-100 focus:opacity-100 whitespace-nowrap">
                        Receive W{NATIVE[chainId].symbol} instead
                      </a>
                    </Link>
                  ) : (
                    oneCurrencyIsWETH && (
                      <Link
                        href={`/remove/${currencyA?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdA}/${
                          currencyB?.equals(WNATIVE[chainId]) ? 'ETH' : currencyIdB
                        }`}
                      >
                        <a className="text-baseline text-blue opacity-80 hover:opacity-100 whitespace-nowrap">
                          Receive {NATIVE[chainId].symbol} instead
                        </a>
                      </Link>
                    )
                  )}
                </Typography>
              )}
            </div>
            {currencyAmounts.map((currencyAmount, index) => (
              <ListPanel.CurrencyAmountItem amount={currencyAmount} key={index} size="xs" hideIfZero={false} />
            ))}
          </div>
          {!account ? (
            <Web3Connect size="lg" color="blue" className="w-full" />
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                fullWidth
                loading={approval === ApprovalState.PENDING}
                onClick={onAttemptToApprove}
                disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              >
                {approval === ApprovalState.APPROVED || signatureData !== null
                  ? i18n._(t`Approved`)
                  : i18n._(t`Approve`)}
              </Button>
              <Button
                fullWidth
                color={
                  !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'red' : 'blue'
                }
                onClick={() => {
                  setShowConfirm(true)
                }}
                disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
              >
                {error || i18n._(t`Confirm Withdrawal`)}
              </Button>
            </div>
          )}
        </div>
      </SwapLayoutCard>
    </>
  )
}

Remove.Layout = SwapLayout('remove-page')
