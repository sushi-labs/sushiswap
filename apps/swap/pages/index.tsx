import { defaultAbiCoder } from '@ethersproject/abi'
import { Zero } from '@ethersproject/constants'
import chain, { ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, tryParseAmount, USDT } from '@sushiswap/currency'
import { TradeV1, TradeV2, Type as TradeType } from '@sushiswap/exchange'
import { Percent } from '@sushiswap/math'
import { STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { Button, Dots, Input, SushiIcon } from '@sushiswap/ui'
import { SUSHI_X_SWAP_ADDRESS } from 'config'
import { BigNumber, BigNumberish } from 'ethers'
import { ApprovalState, useBentoBoxApprovalCallback, useCurrentBlockTimestampMultichain, useTrade } from 'hooks'
import { useBentoBoxRebase } from 'hooks/useBentoBoxRebases'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { SushiXSwap } from 'SushiXSwap'
import { useAccount, useSigner } from 'wagmi'

const defaultConfig = {
  styles: {
    root: undefined,
    title: undefined,
  },
  classes: {
    root: 'flex flex-col max-w-sm mx-auto p-0.5 bg-slate-700 rounded-xl relative shadow-md shadow-slate-900',
    title: '',
  },
}

interface Config {
  styles: {
    root: CSSProperties | undefined
    title: CSSProperties | undefined
  }
  classes: {
    root: string
    title: string
  }
}
function getComplexPathParams(trade: TradeV2<Currency, Currency, TradeType.EXACT_INPUT>) {
  const initialPathCount = trade.route.legs.filter(
    (leg) => leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
  ).length
  return trade.route.legs.reduce<
    [
      {
        tokenIn: string
        pool: string
        native: boolean
        amount: BigNumberish
        data: string
      }[],
      {
        tokenIn: string
        pool: string
        balancePercentage: BigNumberish
        data: string
      }[]
    ]
  >(
    ([initialPath, percentagePath], leg, i) => {
      const isInitialPath = leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
      if (isInitialPath) {
        return [
          [
            ...initialPath,
            {
              tokenIn: leg.tokenFrom.address,
              pool: leg.poolAddress,
              amount:
                initialPathCount > 1 && i === initialPathCount - 1
                  ? getBigNumber(trade.route.amountIn).sub(
                      initialPath.reduce((previousValue, currentValue) => previousValue.add(currentValue.amount), Zero)
                    )
                  : getBigNumber(trade.route.amountIn * leg.absolutePortion),
              native: false,
              data: defaultAbiCoder.encode(
                ['address', 'address', 'bool'],
                [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[trade.inputAmount.currency.chainId], false]
              ),
            },
          ],
          percentagePath,
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
                [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[trade.inputAmount.currency.chainId], false]
              ),
            },
          ],
        ]
      }
    },
    [[], []]
  )
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

function _Swap({ config = defaultConfig }: { config?: Config }) {
  const { data: account } = useAccount()
  const { data: signer } = useSigner()

  const [srcChainId, setSrcChainId] = useState(ChainId.ARBITRUM)
  const [dstChainId, setDstChainId] = useState(ChainId.OPTIMISM)

  const crossChain = srcChainId !== dstChainId

  // const [dstToken, setDstToken] = useState<Currency>(
  //   new Token({
  //     chainId: dstChainId,
  //     address: '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
  //     decimals: 18,
  //     symbol: 'MIM',
  //     name: 'Magic Internet Money',
  //   })
  // )

  // 0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a

  const [srcToken, setSrcToken] = useState<Currency>(Native.onChain(srcChainId))
  // const [dstToken, setDstToken] = useState<Currency>(Native.onChain(dstChainId))

  // const [srcToken, setSrcToken] = useState<Currency>(USDT[srcChainId])
  const [dstToken, setDstToken] = useState<Currency>(USDT[dstChainId])

  // const [srcBridgeToken, setSrcBridgeToken] = useState<Currency>(USDC[srcChainId])
  // const [dstBridgeToken, setDstBridgeToken] = useState<Currency>(USDT[dstChainId])

  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken = STARGATE_BRIDGE_TOKENS[srcChainId].includes(srcToken.wrapped)
    ? srcToken.wrapped
    : STARGATE_BRIDGE_TOKENS[srcChainId][0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken = STARGATE_BRIDGE_TOKENS[dstChainId].includes(dstToken.wrapped)
    ? dstToken.wrapped
    : STARGATE_BRIDGE_TOKENS[dstChainId][0]

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>('')
  const [dstTypedAmount, setDstTypedAmount] = useState<string>('')

  // const [amountIn, setAmountIn] = useState<Amount<Type>>()
  // const [amountOut, setAmountOut] = useState<Amount<Type>>()

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(false)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(false)

  const [srcSelectorOpen, setSrcSelectorOpen] = useState(false)
  const [dstSelectorOpen, setDstSelectorOpen] = useState(false)

  const { rebase: srcBentoBoxRebase } = useBentoBoxRebase(srcChainId, srcToken)

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

  const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%
  const srcMinimumAmountOut = srcTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)

  // 5bps sg fee
  // const STARGATE_FEE = new Percent(5, 10_000) // .05%
  // const sgFee = srcMinimumAmountOut?.multiply(STARGATE_FEE)
  const srcAmountOutMinusStargateFee = srcMinimumAmountOut?.multiply(new Percent(9_995, 10_000)) // 99.95%

  const dstAmountIn = useMemo(() => {
    return tryParseAmount(srcAmountOutMinusStargateFee?.toFixed(), dstBridgeToken)
  }, [dstBridgeToken, srcAmountOutMinusStargateFee])

  // dstTrade
  const dstTrade = useTrade(dstChainId, TradeType.EXACT_INPUT, dstAmountIn, dstBridgeToken, dstToken)

  const dstMinimumAmountOut = crossChain ? dstTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE) : srcMinimumAmountOut

  console.log('SRC AMOUNT IN', srcAmount?.toFixed())
  console.log('SRC MINIMUM AMOUNT OUT', srcMinimumAmountOut?.toFixed())
  // console.log('SG FEE', sgFee?.toFixed())
  // console.log('SRC MINIMUM AMOUNT OUT MINUS SG FEE', srcAmountOutMinusFee?.toFixed())
  // console.log('DST AMOUNT IN', dstAmountIn?.toFixed())
  // console.log('DST MINIMUM AMOUNT OUT', dstMinimumAmountOut?.toFixed())

  // console.log('src trade', srcTrade, 'dst trade', dstTrade)

  console.log('src trade', srcTrade)

  useEffect(() => {
    setDstTypedAmount(dstMinimumAmountOut?.toFixed() ?? '')
  }, [dstMinimumAmountOut])

  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApprovalCallback(
    srcChainId,
    account?.address,
    SUSHI_X_SWAP_ADDRESS[srcChainId]
  )

  console.log({ crossChain, srcMinimumAmountOut })

  const execute = useCallback(() => {
    console.log(
      !srcChainId,
      !srcAmount,
      !dstChainId,
      !account,
      !account?.address,
      !signer,
      !srcBentoBoxRebase,
      bentoBoxApprovalState !== ApprovalState.APPROVED && !signature
    )

    if (
      !srcChainId ||
      !srcAmount ||
      !dstChainId ||
      !account ||
      !account.address ||
      !signer ||
      !srcBentoBoxRebase ||
      (bentoBoxApprovalState !== ApprovalState.APPROVED && !signature)
    ) {
      return
    }

    // Transfers Scenarios
    // T1: BentoBox - Stargate - BentoBox
    // T2: Wallet - Stargate - Wallet
    // T3: Wallet - Stargate - BentoBox
    // T4: BentoBox - Stargate - Wallet

    // Cross Chain Swap Scenarios
    // S1: BentoBox - Swap - Stargate - Swap - BentoBox
    // S2: Wallet - Swap - Stargate - Swap - Wallet
    // S3: Wallet - Swap - Stargate - Swap - BentoBox
    // S4: BentoBox - Swap - Stargate - Swap - Wallet

    const cooker = new SushiXSwap(srcChainId, dstChainId, account.address, signer)

    if (signature) {
      console.log('cook set master contract address', signature)
      cooker.setMasterContractApproval(signature)
    }

    if (
      crossChain &&
      STARGATE_BRIDGE_TOKENS[srcChainId].includes(srcToken.wrapped) &&
      STARGATE_BRIDGE_TOKENS[dstChainId].includes(dstToken.wrapped)
    ) {
      // T1-T4
      if (srcUseBentoBox && dstUseBentoBox) {
        // T1
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          SUSHI_X_SWAP_ADDRESS[srcChainId],
          srcAmount.quotient.toString()
        )
        cooker.teleporter.dstDepositToBentoBox(dstToken, account.address)
      } else if (!srcUseBentoBox && !dstUseBentoBox) {
        // T2
        // Regular src transfer to pool instead? (this will requite approval of SushiXSwap contract)
        cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          SUSHI_X_SWAP_ADDRESS[srcChainId],
          0,
          srcAmount.toShare(srcBentoBoxRebase).quotient.toString()
        )
        cooker.teleporter.dstWithdrawToken(dstToken, account.address)
      } else if (!srcUseBentoBox && dstUseBentoBox) {
        // T3
        cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          SUSHI_X_SWAP_ADDRESS[srcChainId],
          0,
          srcAmount.toShare(srcBentoBoxRebase).quotient.toString()
        )
        cooker.teleporter.dstDepositToBentoBox(dstToken, account.address)
      } else if (srcUseBentoBox && !dstUseBentoBox) {
        // T4
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          SUSHI_X_SWAP_ADDRESS[srcChainId],
          srcAmount.quotient.toString()
        )
        cooker.teleporter.dstWithdrawToken(dstToken, account.address)
      }
    } else {
      // S1-S4

      // Source Trades...

      if (srcMinimumAmountOut && srcTrade instanceof TradeV1 && srcTrade?.route?.path?.length) {
        if (!srcUseBentoBox) {
          console.log('cook src depoit to bentobox')
          cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
        }

        console.log('cook src transfer from bentobox')
        cooker.srcTransferFromBentoBox(
          srcToken.wrapped.address,
          String(srcTrade?.route?.pairs?.[0]?.liquidityToken?.address),
          0,
          srcAmount.toShare(srcBentoBoxRebase).quotient.toString()
        )

        console.log('cook src legacy swap', [srcAmount.quotient.toString(), srcMinimumAmountOut.quotient.toString()])
        cooker.legacyExactInput(
          srcAmount.toShare(srcBentoBoxRebase).quotient.toString(),
          srcMinimumAmountOut.toShare(srcBentoBoxRebase).quotient.toString(),
          srcTrade.route.path.map((token) => token.address),
          crossChain || dstToken.isNative || !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[srcChainId] : account.address
        )

        if (!crossChain && dstToken.isNative && !dstUseBentoBox) {
          cooker.unwrapAndTransfer(dstToken)
        } else if (!crossChain && dstUseBentoBox) {
          cooker.srcDepositToBentoBox(dstToken)
        }
      }

      if (
        srcChainId &&
        dstChainId &&
        srcAmount &&
        srcMinimumAmountOut &&
        srcTrade instanceof TradeV2 &&
        srcTrade?.route?.legs?.length
      ) {
        const inputTokens = srcTrade.route.legs.map((leg) => leg.tokenFrom.address)

        if (new Set(inputTokens).size === inputTokens.length) {
          console.log('cook trident exact input')
          cooker.srcDepositToBentoBox(srcToken, account.address, srcAmount.quotient.toString())
          cooker.srcTransferFromBentoBox(
            srcToken.wrapped.address,
            srcTrade.route.legs[0].poolAddress,
            0,
            srcAmount.toShare(srcBentoBoxRebase).quotient.toString(),
            false
          )
          cooker.tridentExactInput(
            srcToken,
            srcAmount.toShare(srcBentoBoxRebase).quotient.toString(),
            srcMinimumAmountOut.quotient.toString(),
            srcTrade.route.legs.map((leg, i) => {
              const isLastLeg = i === srcTrade.route.legs.length - 1
              const recipentAddress = isLastLeg
                ? crossChain
                  ? SUSHI_X_SWAP_ADDRESS[srcChainId]
                  : account.address
                : leg.poolAddress
              console.log(recipentAddress)
              return {
                pool: leg.poolAddress,
                data: defaultAbiCoder.encode(
                  ['address', 'address', 'bool'],
                  [leg.tokenFrom.address, recipentAddress, crossChain ? isLastLeg : isLastLeg && dstUseBentoBox]
                ),
              }
            })
          )
        } else if (new Set(inputTokens).size !== inputTokens.length) {
          console.log('cook trident complex')
          cooker.srcDepositToBentoBox(srcToken, SUSHI_X_SWAP_ADDRESS[srcChainId], srcAmount.quotient.toString())
          const initialPathCount = srcTrade.route.legs.filter(
            (leg) => leg.tokenFrom.address === srcToken.wrapped.address
          ).length
          const [initialPath, percentagePath] = srcTrade.route.legs.reduce<
            [
              {
                tokenIn: string
                pool: string
                native: boolean
                amount: BigNumberish
                data: string
              }[],
              {
                tokenIn: string
                pool: string
                balancePercentage: BigNumberish
                data: string
              }[]
            ]
          >(
            ([initialPath, percentagePath], leg, i) => {
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
                ]
              }
            },
            [[], []]
          )
          const output = [
            {
              token: (srcTrade.route.toToken as Currency).wrapped.address,
              to: crossChain ? SUSHI_X_SWAP_ADDRESS[srcChainId] : account.address,
              unwrapBento: crossChain ? crossChain : dstUseBentoBox,
              minAmount: srcMinimumAmountOut.quotient.toString(),
            },
          ]
          cooker.tridentComplex(initialPath, percentagePath, output)
        }
      }

      if (crossChain && STARGATE_BRIDGE_TOKENS[dstChainId].includes(dstToken.wrapped)) {
        // If dst token is stargate bridge token, just do a withdraw
        cooker.teleporter.dstWithdrawToken(dstToken)
      } else if (crossChain) {
        // Else dst token is not one of the stargate bridge tokens

        // Dst trades...
        if (
          srcChainId &&
          dstChainId &&
          srcMinimumAmountOut &&
          dstMinimumAmountOut &&
          dstTrade instanceof TradeV1 &&
          dstTrade?.route?.path?.length
        ) {
          console.log('cook teleport legacy exact in')

          cooker.teleporter.dstWithdrawToken(dstBridgeToken, dstTrade.route.pairs[0].liquidityToken.address)

          cooker.teleporter.legacyExactInput(
            srcMinimumAmountOut.quotient.toString(),
            dstMinimumAmountOut.quotient.toString(),
            dstTrade.route.path.map((token) => token.address),
            dstToken.isNative && !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[dstChainId] : account.address
          )

          if (dstToken.isNative && !dstUseBentoBox) {
            cooker.teleporter.unwrapAndTransfer(dstToken)
          }
        } else if (
          srcChainId &&
          dstChainId &&
          srcMinimumAmountOut &&
          dstTrade instanceof TradeV2 &&
          dstTrade?.route?.legs?.length &&
          dstMinimumAmountOut
        ) {
          const inputTokens = dstTrade.route.legs.map((leg) => leg.tokenFrom.address)

          if (new Set(inputTokens).size === inputTokens.length) {
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
                const recipentAddress = isLastLeg
                  ? dstToken.isNative && !dstUseBentoBox
                    ? SUSHI_X_SWAP_ADDRESS[dstChainId]
                    : account.address
                  : leg.poolAddress
                return {
                  pool: leg.poolAddress,
                  data: defaultAbiCoder.encode(
                    ['address', 'address', 'bool'],
                    [leg.tokenFrom.address, recipentAddress, isLastLeg && !dstUseBentoBox]
                  ),
                }
              })
            )
            if (dstToken.isNative && !dstUseBentoBox) {
              cooker.teleporter.unwrapAndTransfer(dstToken)
            }
          } else if (new Set(inputTokens).size !== inputTokens.length) {
            console.log('cook teleport trident complex')
            cooker.teleporter.dstDepositToBentoBox(
              dstBridgeToken,
              SUSHI_X_SWAP_ADDRESS[dstChainId],
              srcMinimumAmountOut.quotient.toString()
            )
            const initialPathCount = dstTrade.route.legs.filter(
              (leg) => leg.tokenFrom.address === dstBridgeToken.wrapped.address
            ).length
            const [initialPath, percentagePath] = dstTrade.route.legs.reduce<
              [
                {
                  tokenIn: string
                  pool: string
                  native: boolean
                  amount: BigNumberish
                  data: string
                }[],
                {
                  tokenIn: string
                  pool: string
                  balancePercentage: BigNumberish
                  data: string
                }[]
              ]
            >(
              ([initialPath, percentagePath], leg, i) => {
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
                  ]
                }
              },
              [[], []]
            )
            const output = [
              {
                token: dstToken.wrapped.address,
                to: dstToken.isNative && !dstUseBentoBox ? SUSHI_X_SWAP_ADDRESS[dstChainId] : account.address,
                unwrapBento: !dstUseBentoBox,
                minAmount: dstMinimumAmountOut.quotient.toString(),
              },
            ]
            cooker.teleporter.tridentComplex(initialPath, percentagePath, output)

            if (dstToken.isNative && !dstUseBentoBox) {
              cooker.teleporter.unwrapAndTransfer(dstToken)
            }
          }
        }
      }
    }

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
  }, [
    account,
    bentoBoxApprovalState,
    crossChain,
    dstBridgeToken,
    dstChainId,
    dstMinimumAmountOut,
    dstToken,
    dstTrade,
    dstUseBentoBox,
    signature,
    signer,
    srcAmount,
    srcBentoBoxRebase,
    srcBridgeToken,
    srcChainId,
    srcMinimumAmountOut,
    srcToken,
    srcTrade,
    srcUseBentoBox,
  ])

  // exec

  return (
    <>
      <div className={config.classes.root} style={config.styles.root}>
        <div className="p-3 rounded-t-xl">
          <div className="flex justify-between pb-4 font-medium">
            <div className="flex items-center gap-2 font-medium">
              <SushiIcon className="w-5 h-5" /> Swap
            </div>
            <button className="hover:animate-spin-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <button
                className="flex items-center gap-1 py-1 text-xs text-slate-400 hover:text-slate-300"
                onClick={() => setSrcSelectorOpen(true)}
              >
                {chain[srcChainId].name}{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                className="py-1 text-xs text-slate-400 hover:text-slate-300"
                onClick={() => setSrcUseBentoBox((prevState) => !prevState)}
              >
                {srcUseBentoBox ? 'BentoBox' : 'Wallet'}
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                <Input.Numeric
                  className="flex-auto w-full px-0 py-2 overflow-hidden text-xl bg-transparent border-none shadow-none outline-none focus:ring-0 overflow-ellipsis disabled:cursor-not-allowed"
                  value={srcTypedAmount}
                  title="Amount In"
                  onUserInput={(value) => setSrcTypedAmount(value)}
                />
                <button className="flex items-center gap-1 py-2 text-xl text-slate-400 hover:text-slate-300 ">
                  {srcToken.symbol}{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="py-1 text-xs select-none text-slate-400">-</div>
              <button className="py-1 text-xs text-slate-400 hover:text-slate-300">MAX</button>
            </div>
          </div>
        </div>
        <div className="p-3 bg-slate-800 rounded-xl ">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <button
                className="flex items-center gap-1 py-1 text-xs text-slate-500 hover:text-slate-300"
                onClick={() => setSrcSelectorOpen(true)}
              >
                {chain[dstChainId].name}{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                className="py-1 text-xs text-slate-500 hover:text-slate-300"
                onClick={() => setDstUseBentoBox((prevState) => !prevState)}
              >
                {dstUseBentoBox ? 'BentoBox' : 'Wallet'}
              </button>
            </div>
            <div className="flex flex-col">
              <div className="relative flex items-center">
                <Input.Numeric
                  className="flex-auto w-full px-0 py-2 overflow-hidden text-xl bg-transparent border-none shadow-none outline-none focus:ring-0 overflow-ellipsis disabled:cursor-not-allowed"
                  value={dstTypedAmount}
                  title="Amount Out"
                  readOnly
                />
                <button className="flex items-center gap-1 py-2 text-xl text-slate-500 hover:text-slate-300">
                  {dstToken.symbol}{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="py-1 text-xs select-none text-slate-500">-</div>
            <button className="py-1 text-xs text-slate-500 hover:text-slate-300">MAX</button>
          </div>
          <div className="py-2 text-xs text-slate-500">
            {!srcAmount ? (
              'Enter an amount'
            ) : !dstTrade ? (
              <Dots>Fetching best price</Dots>
            ) : (
              <div>
                <div>
                  {`1 ${srcToken.symbol} = ${srcTrade?.executionPrice.asFraction
                    .multiply(dstTrade?.executionPrice)
                    .toSignificant(4)} ${dstToken.symbol}`}
                </div>
              </div>
            )}
          </div>
          {bentoBoxApprovalState === ApprovalState.NOT_APPROVED ? (
            <Button fullWidth color="gradient" className="my-3" onClick={approveBentoBox}>
              Approve BentoBox
            </Button>
          ) : (
            <Button fullWidth color="gradient" className="my-3" onClick={execute}>
              Review swap
            </Button>
          )}

          <div className="flex items-center justify-center cursor-pointer pointer-events-auto text-slate-400 group hover:text-pink">
            <SushiIcon width="1em" height="1em" className="mr-1 group-hover:animate-spin" />{' '}
            <span className="text-xs !text-slate-500 group-hover:!text-slate-300 select-none">
              Powered by the SushiSwap protocol
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Swap({ chainIds, blockNumbers }: { chainIds: number[]; blockNumbers: number[] }) {
  const chainNames = Object.entries(chain)
    .filter(([chainId1]) => chainIds.find((chainId2) => Number(chainId1) === Number(chainId2)))
    .map(([, chain]) => {
      return chain.name
    })
  const blockTimestamps = useCurrentBlockTimestampMultichain(chainIds, blockNumbers)
  const isReady = blockTimestamps.filter((b) => !!b).length >= 2
  return (
    <div className="mt-24 space-y-12">
      <_Swap />
      {/* <Widget /> */}
      <div className="text-center">
        <div>Chain Names: {chainNames.join(',')}</div>
        <div>Block Timestamps: {isReady && <span data-testid="blockTimestamps">{blockTimestamps.join(',')}</span>}</div>
      </div>
    </div>
  )
}
