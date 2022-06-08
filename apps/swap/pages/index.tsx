import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { Zero } from '@ethersproject/constants'
import { ChevronRightIcon } from '@heroicons/react/outline'
import chain, { ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { TradeType, TradeV1, TradeV2 } from '@sushiswap/exchange'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Button, Chip, classNames, Dots, GasIcon, Loader, Typography } from '@sushiswap/ui'
import { Approve, BENTOBOX_ADDRESS, useSushiXSwapContract, Wallet } from '@sushiswap/wagmi'
import {
  Caption,
  ConfirmationOverlay,
  CurrencyInput,
  OverlayContent,
  OverlayHeader,
  Rate,
  WidgetSettingsOverlay,
} from 'components'
import { Route } from 'components'
import { defaultTheme, SUSHI_X_SWAP_ADDRESS } from 'config'
import { Complex, isComplex, isExactInput } from 'lib/getComplexParams'
import { useBentoBoxRebase, useTrade } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { SushiXSwap } from 'lib/SushiXSwap'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Theme } from 'types'
import { useAccount, useFeeData, useNetwork } from 'wagmi'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%

const theme: Theme = {
  ...defaultTheme,
}

export function getBigNumber(value: number): BigNumber {
  const v = Math.abs(value)
  if (v < Number.MAX_SAFE_INTEGER) return BigNumber.from(Math.round(value))

  const exp = Math.floor(Math.log(v) / Math.LN2)
  console.assert(exp >= 51, 'Internal Error 314')
  const shift = exp - 51
  const mant = Math.round(v / Math.pow(2, shift))
  const res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift))
  return value > 0 ? res : res.mul(-1)
}

interface Swap {
  width?: number | string
  theme?: Theme
}

const _Swap: FC<Swap> = ({ width = 360, theme = defaultTheme }) => {
  const { data: account } = useAccount()
  const { activeChain, switchNetwork } = useNetwork()

  const [isWritePending, setIsWritePending] = useState<boolean>()

  const [signature, setSignature] = useState<Signature>()

  const [srcChainId, setSrcChainId] = useState(ChainId.AVALANCHE)
  const [dstChainId, setDstChainId] = useState(ChainId.FANTOM)

  const feeData = useFeeData({
    chainId: srcChainId,
  })

  const [srcToken, setSrcToken] = useState<Currency>(Native.onChain(srcChainId))
  const [dstToken, setDstToken] = useState<Currency>(Native.onChain(dstChainId))

  useEffect(() => setSrcToken(Native.onChain(srcChainId)), [srcChainId])
  useEffect(() => setDstToken(Native.onChain(dstChainId)), [dstChainId])

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>('')
  const [dstTypedAmount, setDstTypedAmount] = useState<string>('')

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(false)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(false)

  const srcTokens = useTokens(srcChainId)
  const dstTokens = useTokens(dstChainId)

  const { rebase: srcTokenRebase } = useBentoBoxRebase(srcChainId, srcToken)

  const contract = useSushiXSwapContract(srcChainId)

  // Computed
  const crossChain = srcChainId !== dstChainId

  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken =
    srcToken.isToken && isStargateBridgeToken(srcToken) ? srcToken : STARGATE_BRIDGE_TOKENS[srcChainId][0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken =
    dstToken.isToken && isStargateBridgeToken(dstToken) ? dstToken : STARGATE_BRIDGE_TOKENS[dstChainId][0]

  const srcAmount = useMemo<Amount<Currency> | undefined>(() => {
    return tryParseAmount(srcTypedAmount, srcToken)
  }, [srcToken, srcTypedAmount])

  // srcTrade
  const srcTrade = useTrade(
    srcChainId,
    TradeType.EXACT_INPUT,
    srcAmount,
    srcToken,
    crossChain ? srcBridgeToken : dstToken
  )

  // 5bps sg fee
  const STARGATE_FEE = new Percent(5, 10_000) // .05%

  const srcMinimumAmountOut =
    (crossChain && !isStargateBridgeToken(srcToken)) || !crossChain
      ? srcTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)
      : srcAmount

  const srcAmountOutMinusStargateFee = crossChain
    ? srcMinimumAmountOut?.subtract(srcMinimumAmountOut.multiply(STARGATE_FEE))
    : srcMinimumAmountOut

  const dstAmountIn = useMemo(() => {
    return tryParseAmount(srcAmountOutMinusStargateFee?.toFixed(), dstBridgeToken)
  }, [dstBridgeToken, srcAmountOutMinusStargateFee])

  // dstTrade
  const dstTrade = useTrade(dstChainId, TradeType.EXACT_INPUT, dstAmountIn, dstBridgeToken, dstToken)

  const dstMinimumAmountOut =
    crossChain && !isStargateBridgeToken(dstToken)
      ? dstTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)
      : srcMinimumAmountOut

  const price =
    srcAmount && dstMinimumAmountOut
      ? new Price({ baseAmount: srcAmount, quoteAmount: dstMinimumAmountOut })
      : undefined

  // console.log('SRC AMOUNT IN', srcAmount?.toFixed())
  // console.log('SRC MINIMUM AMOUNT OUT', srcMinimumAmountOut?.toFixed())
  // console.log('SG FEE', sgFee?.toFixed())
  // console.log('SRC MINIMUM AMOUNT OUT MINUS SG FEE', srcAmountOutMinusFee?.toFixed())
  // console.log('DST AMOUNT IN', dstAmountIn?.toFixed())
  // console.log('DST MINIMUM AMOUNT OUT', dstMinimumAmountOut?.toFixed())

  // console.log('src trade', srcTrade, 'dst trade', dstTrade)

  // console.log({
  //   srcToken,
  //   srcTrade,
  //   dstTrade,
  //   dstBridgeToken,
  //   dstToken,
  //   srcChainId,
  //   dstChainId,
  // })

  useEffect(() => {
    setDstTypedAmount(dstMinimumAmountOut?.toSignificant(6) ?? '')
  }, [dstMinimumAmountOut])

  const execute = useCallback(() => {
    if (
      !srcChainId ||
      !srcAmount ||
      !srcMinimumAmountOut ||
      !dstChainId ||
      !dstMinimumAmountOut ||
      !account ||
      !account.address ||
      !srcTokenRebase ||
      !contract
    ) {
      return
    }

    const srcShare = srcAmount.toShare(srcTokenRebase)

    const srcMinimumShareOut = srcMinimumAmountOut.toShare(srcTokenRebase)

    setIsWritePending(true)

    // Transfers Scenarios
    // T1: BentoBox - Stargate - BentoBox
    // T2: Wallet - Stargate - Wallet
    // T3: Wallet - Stargate - BentoBox
    // T4: BentoBox - Stargate - Wallet

    // Cross Chain Swap Scenarios
    // X1: BentoBox - Swap - Stargate - Swap - BentoBox
    // X2: Wallet - Swap - Stargate - Swap - Wallet
    // X3: Wallet - Swap - Stargate - Swap - BentoBox
    // X4: BentoBox - Swap - Stargate - Swap - Wallet

    // Non Cross Chain Swap Scenarios
    // S1: BentoBox - Swap - BentoBox
    // S2: Wallet - Swap - Wallet
    // S3: Wallet - Swap - BentoBox
    // S4: BentoBox - Swap - Wallet

    const cooker = new SushiXSwap({
      contract,
      srcToken,
      dstToken,
      srcUseBentoBox,
      dstUseBentoBox,
      user: account.address,
    })

    if (signature) {
      console.log('cook set master contract address', signature)
      cooker.setMasterContractApproval(signature)
    }

    if (crossChain && isStargateBridgeToken(srcToken) && isStargateBridgeToken(dstToken)) {
      // Cross-chain transfer operations
      // T1-T4
      cooker.stargateTransfer(srcAmount, srcShare)
    } else {
      // Cross-chain swap operations (and non cross-chain operations for now)

      // TODO: Refactor for readability... else if (crossChain) { cross-chain operations } else { non cross-chain chain operations }

      // S1-S4 & X1-X4

      // Source operations...
      if (srcTrade instanceof TradeV1 && srcTrade.route.path.length) {
        if (!srcUseBentoBox) {
          console.log('cook src depoit to bentobox')
          cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
        }

        console.log('cook src transfer from bentobox')
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          srcTrade.route.pairs[0].liquidityToken.address,
          0,
          srcShare.quotient.toString()
        )

        console.log('cook src legacy swap', [srcAmount.quotient.toString(), srcMinimumAmountOut.quotient.toString()])
        cooker.legacyExactInput(
          srcShare.quotient.toString(),
          srcMinimumAmountOut.toShare(srcTokenRebase).quotient.toString(),
          srcTrade.route.path.map((token) => token.address),
          crossChain || dstToken.isNative || !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[srcChainId] : account.address
        )

        if (!crossChain && dstToken.isNative && !dstUseBentoBox) {
          cooker.unwrapAndTransfer(dstToken)
        } else if (!crossChain && dstUseBentoBox) {
          cooker.srcDepositToBentoBox(dstToken)
        }
      }

      if (srcTrade instanceof TradeV2 && srcTrade?.route?.legs?.length) {
        if (isExactInput(srcTrade)) {
          console.log('cook trident exact input')
          cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
          cooker.srcTransferFromBentoBox(
            srcToken.wrapped.address,
            srcTrade.route.legs[0].poolAddress,
            0,
            srcAmount.toShare(srcTokenRebase).quotient.toString(),
            false
          )
          cooker.tridentExactInput(
            srcToken,
            srcAmount.toShare(srcTokenRebase).quotient.toString(),
            srcMinimumAmountOut.quotient.toString(),
            srcTrade.route.legs.map((leg, i) => {
              const isLastLeg = i === srcTrade.route.legs.length - 1
              const recipientAddress = isLastLeg
                ? crossChain
                  ? SUSHI_X_SWAP_ADDRESS[srcChainId]
                  : account.address
                : leg.poolAddress
              return {
                pool: leg.poolAddress,
                data: defaultAbiCoder.encode(
                  ['address', 'address', 'bool'],
                  [leg.tokenFrom.address, recipientAddress, crossChain ? isLastLeg : isLastLeg && dstUseBentoBox]
                ),
              }
            })
          )
        } else if (isComplex(srcTrade)) {
          console.log('cook trident complex')
          cooker.srcDepositToBentoBox(srcToken, SUSHI_X_SWAP_ADDRESS[srcChainId], srcAmount.quotient.toString())
          const initialPathCount = srcTrade.route.legs.filter(
            (leg) => leg.tokenFrom.address === srcToken.wrapped.address
          ).length
          const params = srcTrade.route.legs.reduce<Complex>(
            ([initialPath, percentagePath, output], leg, i) => {
              const isInitialPath = leg.tokenFrom.address === srcToken.wrapped.address
              if (isInitialPath) {
                return [
                  [
                    ...initialPath,
                    {
                      tokenIn: leg.tokenFrom.address,
                      pool: leg.poolAddress,
                      amount:
                        initialPathCount > 1 && i === initialPathCount - 1
                          ? getBigNumber(srcTrade.route.amountIn).sub(
                              initialPath.reduce(
                                (previousValue, currentValue) => previousValue.add(currentValue.amount),
                                Zero
                              )
                            )
                          : getBigNumber(srcTrade.route.amountIn * leg.absolutePortion),
                      native: false,
                      data: defaultAbiCoder.encode(
                        ['address', 'address', 'bool'],
                        [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[srcChainId], false]
                      ),
                    },
                  ],
                  percentagePath,
                  output,
                ]
              } else {
                return [
                  initialPath,
                  [
                    ...percentagePath,
                    {
                      tokenIn: leg.tokenFrom.address,
                      pool: leg.poolAddress,
                      balancePercentage: getBigNumber(leg.swapPortion * 10 ** 8),
                      data: defaultAbiCoder.encode(
                        ['address', 'address', 'bool'],
                        [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[srcChainId], false]
                      ),
                    },
                  ],
                  output,
                ]
              }
            },
            [
              [],
              [],
              [
                {
                  token: (srcTrade.route.toToken as Currency).wrapped.address,
                  to: crossChain ? SUSHI_X_SWAP_ADDRESS[srcChainId] : account.address,
                  unwrapBento: crossChain ? crossChain : dstUseBentoBox,
                  minAmount: srcMinimumAmountOut.quotient.toString(),
                },
              ],
            ]
          )
          cooker.tridentComplex(params)
        }
      }

      // Destination operations...
      if (crossChain && isStargateBridgeToken(dstToken)) {
        // If dst token is stargate bridge token, just do a withdraw
        cooker.teleporter.dstWithdraw(dstToken)
      } else if (crossChain) {
        // Else dst token is not one of the stargate bridge tokens

        // Dst trades...
        if (dstTrade instanceof TradeV1 && dstTrade.route.path.length) {
          console.log('cook teleport legacy exact in')

          cooker.teleporter.dstWithdraw(dstBridgeToken, dstTrade.route.pairs[0].liquidityToken.address)

          cooker.teleporter.legacyExactInput(
            srcMinimumAmountOut.quotient.toString(),
            dstMinimumAmountOut.quotient.toString(),
            dstTrade.route.path.map((token) => token.address),
            dstToken.isNative && !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[dstChainId] : account.address
          )

          if (dstToken.isNative && !dstUseBentoBox) {
            cooker.teleporter.unwrapAndTransfer(dstToken)
          }
        } else if (dstTrade instanceof TradeV2 && dstTrade?.route?.legs?.length && dstMinimumAmountOut) {
          if (isExactInput(dstTrade)) {
            cooker.teleporter.dstDepositToBentoBox(
              dstBridgeToken,
              dstTrade.route.legs[0].poolAddress,
              srcMinimumAmountOut.quotient.toString()
            )
            console.log('cook teleport trident exact input')
            cooker.teleporter.tridentExactInput(
              dstBridgeToken,
              srcMinimumAmountOut.quotient.toString(),
              dstMinimumAmountOut.quotient.toString(),
              dstTrade.route.legs.map((leg, i) => {
                const isLastLeg = i === dstTrade.route.legs.length - 1
                const recipientAddress = isLastLeg
                  ? dstToken.isNative && !dstUseBentoBox
                    ? SUSHI_X_SWAP_ADDRESS[dstChainId]
                    : account.address
                  : leg.poolAddress
                return {
                  pool: leg.poolAddress,
                  data: defaultAbiCoder.encode(
                    ['address', 'address', 'bool'],
                    [leg.tokenFrom.address, recipientAddress, isLastLeg && !dstUseBentoBox]
                  ),
                }
              })
            )
            if (dstToken.isNative && !dstUseBentoBox) {
              cooker.teleporter.unwrapAndTransfer(dstToken)
            }
          } else if (isComplex(dstTrade)) {
            console.log('cook teleport trident complex')
            cooker.teleporter.dstDepositToBentoBox(
              dstBridgeToken,
              SUSHI_X_SWAP_ADDRESS[dstChainId],
              srcMinimumAmountOut.quotient.toString()
            )
            const initialPathCount = dstTrade.route.legs.filter(
              (leg) => leg.tokenFrom.address === dstBridgeToken.wrapped.address
            ).length
            const params = dstTrade.route.legs.reduce<Complex>(
              ([initialPath, percentagePath, output], leg, i) => {
                const isInitialPath = leg.tokenFrom.address === dstBridgeToken.wrapped.address
                if (isInitialPath) {
                  return [
                    [
                      ...initialPath,
                      {
                        tokenIn: leg.tokenFrom.address,
                        pool: leg.poolAddress,
                        amount:
                          initialPathCount > 1 && i === initialPathCount - 1
                            ? getBigNumber(dstTrade.route.amountIn).sub(
                                initialPath.reduce(
                                  (previousValue, currentValue) => previousValue.add(currentValue.amount),
                                  Zero
                                )
                              )
                            : getBigNumber(dstTrade.route.amountIn * leg.absolutePortion),
                        native: false,
                        data: defaultAbiCoder.encode(
                          ['address', 'address', 'bool'],
                          [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[dstChainId], false]
                        ),
                      },
                    ],
                    percentagePath,
                    output,
                  ]
                } else {
                  return [
                    initialPath,
                    [
                      ...percentagePath,
                      {
                        tokenIn: leg.tokenFrom.address,
                        pool: leg.poolAddress,
                        balancePercentage: getBigNumber(leg.swapPortion * 10 ** 8),
                        data: defaultAbiCoder.encode(
                          ['address', 'address', 'bool'],
                          [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[dstChainId], false]
                        ),
                      },
                    ],
                    output,
                  ]
                }
              },
              [
                [],
                [],
                [
                  {
                    token: dstToken.wrapped.address,
                    to: dstToken.isNative && !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[dstChainId] : account.address,
                    unwrapBento: !dstUseBentoBox,
                    minAmount: dstMinimumAmountOut.quotient.toString(),
                  },
                ],
              ]
            )

            cooker.teleporter.tridentComplex(params)

            if (dstToken.isNative && !dstUseBentoBox) {
              cooker.teleporter.unwrapAndTransfer(dstToken)
            }
          }
        }
      }
    }
    // else {
    //   // same chain operations...
    // }

    if (crossChain) {
      cooker.teleport(srcBridgeToken, dstBridgeToken)
    }

    console.log('attempt cook')
    cooker
      .cook()
      .then((res) => {
        console.log('then cooked', res)
      })
      .catch((err) => {
        console.log('catch err', err)
      })
      .finally(() => {
        setIsWritePending(false)
      })
  }, [
    account,
    contract,
    crossChain,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstToken,
    dstTrade,
    dstUseBentoBox,
    signature,
    srcAmount,
    srcTokenRebase,
    srcBridgeToken,
    srcChainId,
    srcMinimumAmountOut,
    srcToken,
    srcTrade,
    srcUseBentoBox,
  ])

  const isMounted = useIsMounted()

  return (
    <article
      id="sushixswap"
      className={classNames(
        theme.background.primary,
        'flex flex-col mx-auto rounded-2xl relative overflow-hidden min-w-[320px]'
      )}
      style={{ width }}
    >
      <div className="p-3 mx-[2px] grid grid-cols-6 items-center pb-4 font-medium">
        <Typography
          weight={900}
          className={classNames(theme.primary.default, theme.primary.hover, 'flex items-center gap-2')}
        >
          Swap
        </Typography>
        <Caption className="flex justify-center col-span-4" theme={theme} />
        <div className="flex justify-end">
          <WidgetSettingsOverlay theme={theme} />
        </div>
      </div>
      <div className="p-3 pb-0 border-2 border-transparent">
        <CurrencyInput
          value={srcTypedAmount}
          onChange={setSrcTypedAmount}
          onCurrencySelect={setSrcToken}
          onFundSourceSelect={(source) => setSrcUseBentoBox(source === FundSource.BENTOBOX)}
          fundSource={srcUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
          currency={srcToken}
          network={chain[srcChainId]}
          onNetworkSelect={setSrcChainId}
          tokenList={srcTokens}
          theme={theme}
        />
      </div>
      <div className={classNames(theme.background.secondary, 'p-3 m-0.5 rounded-2xl')}>
        <CurrencyInput
          disabled={true}
          value={dstTypedAmount}
          onChange={setDstTypedAmount}
          onCurrencySelect={setDstToken}
          onFundSourceSelect={(source) => setDstUseBentoBox(source === FundSource.BENTOBOX)}
          fundSource={dstUseBentoBox ? FundSource.BENTOBOX : FundSource.WALLET}
          currency={dstToken}
          network={chain[dstChainId]}
          onNetworkSelect={setDstChainId}
          tokenList={dstTokens}
          theme={theme}
        />

        <Rate loading={!!srcAmount && !dstMinimumAmountOut} price={price} theme={theme} />

        <div className="flex gap-2">
          {!account && isMounted ? (
            <Wallet.Button fullWidth color="blue">
              Connect Wallet
            </Wallet.Button>
          ) : activeChain?.id !== srcChainId && isMounted ? (
            <Button fullWidth onClick={() => switchNetwork && switchNetwork(srcChainId)}>
              Switch to {chain[srcChainId].name}
            </Button>
          ) : activeChain?.id == srcChainId && isMounted ? (
            <>
              <Approve
                components={
                  <Approve.Components className="flex gap-4">
                    <Approve.Bentobox
                      className="whitespace-nowrap"
                      fullWidth
                      address={SUSHI_X_SWAP_ADDRESS[srcChainId]}
                      onSignature={setSignature}
                    />
                    <Approve.Token
                      className="whitespace-nowrap"
                      fullWidth
                      amount={srcAmount}
                      address={BENTOBOX_ADDRESS[srcChainId]}
                    />
                  </Approve.Components>
                }
                render={({ approved }) => (
                  <ConfirmationOverlay
                    trigger={({ setOpen }) => (
                      <Button
                        fullWidth
                        variant="filled"
                        color="gradient"
                        disabled={isWritePending || !approved || !srcAmount?.greaterThan(ZERO)}
                        onClick={() => setOpen(true)}
                      >
                        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Swap'}
                      </Button>
                    )}
                  >
                    {({ setOpen }) => (
                      <OverlayContent theme={theme} className="flex flex-col flex-grow !bg-slate-800">
                        <OverlayHeader
                          arrowDirection="bottom"
                          onClose={() => setOpen(false)}
                          title="Confirm Swap"
                          theme={theme}
                        />
                        <div className="h-px bg-slate-200/5 w-full px-0.5" />
                        <div className="!my-0 p-2 rounded-xl grid grid-cols-[150px_auto_150px]">
                          <div className="flex flex-col">
                            <Typography variant="lg" weight={700}>
                              {srcAmount?.toSignificant(6)}{' '}
                              <span className="text-xs text-slate-400">{srcAmount?.currency.symbol}</span>
                            </Typography>
                            <Typography variant="xs" weight={700} className="text-slate-400">
                              $0.00
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between">
                            <ChevronRightIcon width={18} height={18} className="text-slate-500" />
                          </div>
                          <div className="flex flex-col w-full">
                            <Typography variant="lg" weight={700} className="text-right">
                              {dstMinimumAmountOut?.toSignificant(6)}{' '}
                              <span className="text-xs text-slate-400">{dstMinimumAmountOut?.currency.symbol}</span>
                            </Typography>
                            <Typography variant="xs" weight={700} className="text-right text-slate-400">
                              $0.00 <span className="text-[10px] text-green">(+0.00%)</span>
                            </Typography>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 px-3 py-2 bg-slate-700 rounded-xl">
                          <div className="flex items-center justify-between gap-2">
                            <Rate loading={!!srcAmount && !dstMinimumAmountOut} price={price} theme={theme}>
                              {({ toggleInvert, content }) => (
                                <Typography
                                  as="button"
                                  onClick={() => toggleInvert()}
                                  variant="xs"
                                  weight={700}
                                  className="flex items-center gap-1 text-slate-200"
                                >
                                  {content}
                                </Typography>
                              )}
                            </Rate>
                            <Chip
                              label={
                                <div className="flex items-center gap-1">
                                  <GasIcon width={10} />
                                  <Typography variant="xs" weight={700}>
                                    {feeData.data?.formatted.gasPrice &&
                                      JSBI.divide(
                                        JSBI.BigInt(feeData.data?.formatted.gasPrice),
                                        JSBI.BigInt(1e9)
                                      ).toString()}{' '}
                                    Gwei
                                  </Typography>
                                </div>
                              }
                              color="gray"
                            />
                          </div>
                          <div className="w-full h-px my-1 bg-slate-200/5" />
                          <div className="flex justify-between gap-2">
                            <Typography variant="xs" className="text-slate-400">
                              Minimum Received After Slippage
                            </Typography>
                            <Typography variant="xs" weight={700} className="text-slate-200">
                              {dstMinimumAmountOut?.toSignificant(6)} {dstMinimumAmountOut?.currency.symbol}
                            </Typography>
                          </div>
                          <div className="flex justify-between gap-2">
                            <Typography variant="xs" className="text-slate-400">
                              Estimated Processing Time
                            </Typography>
                            <Typography variant="xs" weight={700} className="text-slate-300">
                              ~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[srcChainId] / 60)} minutes
                            </Typography>
                          </div>
                          <Route srcTrade={srcTrade} dstTrade={dstTrade} />
                        </div>
                        <Button fullWidth color="gradient" onClick={execute}>
                          Swap
                        </Button>
                      </OverlayContent>
                    )}
                  </ConfirmationOverlay>
                )}
              />
            </>
          ) : (
            <Button fullWidth color="blue">
              <Loader size="16px" />
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Swap({ chainIds }: { chainIds: number[] }) {
  return (
    <div className="mt-40 space-y-12 mb-60">
      <_Swap theme={theme} />
      {/* <Widget header={<>Swap</>} /> */}
    </div>
  )
}
