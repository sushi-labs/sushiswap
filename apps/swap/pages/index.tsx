import { defaultAbiCoder } from '@ethersproject/abi'
import chain from '@sushiswap/chain'
import { Amount, Native, tryParseAmount, Type, USDC } from '@sushiswap/currency'
import { TradeV1, TradeV2, Type as TradeType } from '@sushiswap/exchange'
import { useIsMounted } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { Button, Dots, Input, SushiIcon } from '@sushiswap/ui'
import { SUSHI_X_SWAP_ADDRESS } from 'config'
import { ApprovalState, useBentoBoxApprovalCallback, useCurrentBlockTimestampMultichain, useTrade } from 'hooks'
import { useBentoBoxRebase } from 'hooks/useBentoBoxRebases'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import { Action, SushiXSwap } from 'SushiXSwap'
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

function Widget({ config = defaultConfig }: { config?: Config }) {
  const { data: account } = useAccount()
  const { data: signer } = useSigner()

  const [srcChainId, setSrcChainId] = useState(42161)
  const [dstChainId, setDstChainId] = useState(10)

  const crossChain = srcChainId !== dstChainId

  const [srcToken, setSrcToken] = useState<Type>(Native.onChain(srcChainId))
  const [dstToken, setDstToken] = useState<Type>(Native.onChain(dstChainId))

  const [srcTypedAmount, setSrcTypedAmount] = useState<string>('')
  const [dstTypedAmount, setDstTypedAmount] = useState<string>('')

  // const [amountIn, setAmountIn] = useState<Amount<Type>>()
  // const [amountOut, setAmountOut] = useState<Amount<Type>>()

  const [srcUseBentoBox, setSrcUseBentoBox] = useState(false)
  const [dstUseBentoBox, setDstUseBentoBox] = useState(false)

  const [srcSelectorOpen, setSrcSelectorOpen] = useState(false)
  const [dstSelectorOpen, setDstSelectorOpen] = useState(false)

  const { rebase: srcBentoBoxRebase } = useBentoBoxRebase(srcChainId, srcToken)

  // const srcTokens = useTokens(srcChainId)
  // const dstTokens = useTokens(dstChainId)

  // const srcProvier = useProvider<JsonRpcProvider>({ chainId: srcChainId })
  // const srcBlock = useLatestBlock(srcProvier)

  // const dstProvier = useProvider<JsonRpcProvider>({ chainId: dstChainId })
  // const dstBlock = useLatestBlock(dstProvier)

  // console.log({
  //   srcTokens: Object.values(srcTokens).map((t) => t),
  //   dstTokens: Object.values(dstTokens).map((t) => t),
  // })

  // const srcCombinations = useCurrencyCombinations(srcChainId, srcToken, USDC[srcChainId])

  const srcAmount = useMemo<Amount<Type> | undefined>(() => {
    return tryParseAmount(srcTypedAmount, srcToken)
  }, [srcToken, srcTypedAmount])

  // srcTrade
  const srcTrade = useTrade(srcChainId, TradeType.EXACT_INPUT, srcAmount, srcToken, USDC[srcChainId])

  const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%
  const srcMinimumAmountOut = srcTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE)

  // 5bps sg fee
  const STARGATE_FEE = new Percent(5, 10_000) // .05%
  const sgFee = srcMinimumAmountOut?.multiply(STARGATE_FEE)
  const srcAmountOutMinusFee = srcMinimumAmountOut?.multiply(new Percent(9_995, 10_000)) // 99.95%

  const dstAmountIn = useMemo(() => {
    return tryParseAmount(srcAmountOutMinusFee?.toFixed(), USDC[dstChainId])
  }, [dstChainId, srcAmountOutMinusFee])

  // dstTrade
  const dstTrade = useTrade(dstChainId, TradeType.EXACT_INPUT, dstAmountIn, USDC[dstChainId], dstToken)

  const dstMinimumAmountOut = crossChain ? dstTrade?.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE) : srcMinimumAmountOut

  // console.log('SRC AMOUNT IN', srcAmount?.toFixed())
  // console.log('SRC MINIMUM AMOUNT OUT', srcMinimumAmountOut?.toFixed())
  // console.log('SG FEE', sgFee?.toFixed())
  // console.log('SRC MINIMUM AMOUNT OUT MINUS SG FEE', srcAmountOutMinusFee?.toFixed())
  // console.log('DST AMOUNT IN', dstAmountIn?.toFixed())
  // console.log('DST MINIMUM AMOUNT OUT', dstMinimumAmountOut?.toFixed())

  // console.log('src trade', srcTrade, 'dst trade', dstTrade)

  useEffect(() => {
    setDstTypedAmount(dstMinimumAmountOut?.toFixed() ?? '')
  }, [dstMinimumAmountOut])

  const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApprovalCallback(
    srcChainId,
    account?.address,
    SUSHI_X_SWAP_ADDRESS[srcChainId]
  )

  const execute = useCallback(() => {
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

    const cooker = new SushiXSwap(srcChainId, account.address, signer)

    if (signature) {
      console.log('cook set master contract address')
      cooker.setMasterContractApproval(signature)
    }
    // console.log('srcCurrencyAmount', srcCurrencyAmount.quotient.toString())

    cooker.srcDepositToBentoBox(srcToken, srcAmount.quotient.toString())

    if (srcMinimumAmountOut && srcTrade instanceof TradeV1 && srcTrade?.route?.path?.length) {
      // console.log('cook src transfer from bentobox')
      cooker.srcTransferFromBentoBox(
        srcToken.wrapped.address,
        String(srcTrade?.route?.pairs?.[0]?.liquidityToken?.address),
        0,
        srcAmount.toShare(srcBentoBoxRebase).quotient.toString()
      )
      console.log('cook src legacy swap')
      cooker.legacyExactInput(
        srcAmount.quotient.toString(),
        srcMinimumAmountOut.quotient.toString(),
        srcTrade.route.path.map((token) => token.address),
        SUSHI_X_SWAP_ADDRESS[srcChainId]
      )
    }

    // if (
    //   srcChainId &&
    //   dstChainId &&
    //   srcMinimumAmountOut &&
    //   dstMinimumAmountOut &&
    //   dstTrade?.trade instanceof TradeV1 &&
    //   dstTrade?.trade?.route?.path?.length
    // ) {
    //   console.log('cook teleport and swap to v1')
    //   cooker.teleport(
    //     srcChainId,
    //     dstChainId,
    //     [3, 5],
    //     [0, 0],
    //     [
    //       cooker.encodeWithdraw(USDC_ADDRESS[dstChainId], dstTrade.trade.route.pairs[0].liquidityToken.address),
    //       cooker.encodeLegacySwap(
    //         dstChainId,
    //         srcMinimumAmountOut.quotient.toString(),
    //         dstMinimumAmountOut.quotient.toString(),
    //         dstTrade.trade.route.path.map((token) => token.address),
    //       ),
    //     ],
    //   )
    // }

    if (
      srcChainId &&
      dstChainId &&
      srcMinimumAmountOut &&
      dstTrade instanceof TradeV2 &&
      dstTrade?.route?.legs?.length &&
      dstMinimumAmountOut
    ) {
      console.log('cook teleport and swap to trident')

      cooker.teleport(
        srcChainId,
        dstChainId,
        [Action.DST_DEPOSIT_TO_BENTOBOX, Action.TRIDENT_EXACT_INPUT, Action.UNWRAP_AND_TRANSFER],
        [0, 0, 0],
        [
          cooker.encodeDepositToBentoBox(
            USDC[dstChainId],
            dstTrade.route.legs[0].poolAddress,
            srcMinimumAmountOut.quotient.toString()
          ),
          cooker.encodeTridentExactInput(
            USDC[dstChainId],
            srcMinimumAmountOut.quotient.toString(),
            dstMinimumAmountOut.quotient.toString(),
            [
              {
                pool: dstTrade.route.legs[0].poolAddress,
                data: defaultAbiCoder.encode(
                  ['address', 'address', 'bool'],
                  [dstTrade.route.legs[0].tokenFrom.address, SUSHI_X_SWAP_ADDRESS[dstChainId], true]
                ),
              },
            ]
          ),
          cooker.encodeUnwrapAndTransfer(dstToken, account.address),
        ]
      )
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
    dstChainId,
    dstMinimumAmountOut,
    dstToken,
    dstTrade,
    signature,
    signer,
    srcAmount,
    srcBentoBoxRebase,
    srcChainId,
    srcMinimumAmountOut,
    srcToken,
    srcTrade,
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
  const isMounted = useIsMounted()
  const isReady = blockTimestamps.filter((b) => !!b).length >= 2
  return (
    <div className="mt-24 space-y-12">
      {isMounted && <Widget />}

      <div className="text-center">
        <div>Chain Names: {chainNames.join(',')}</div>
        <div>Block Timestamps: {isReady && <span data-testid="blockTimestamps">{blockTimestamps.join(',')}</span>}</div>
      </div>
    </div>
  )
}
