import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { Trade, TradeType, Version as TradeVersion } from '@sushiswap/amm'
import { Amount, Currency, Native, Share, Token } from '@sushiswap/currency'
import {
  isStargateBridgeToken,
  STARGATE_BRIDGE_TOKENS,
  STARGATE_CHAIN_ID,
  STARGATE_POOL_ID,
  StargateChainId,
} from '@sushiswap/stargate'
import { getBigNumber } from '@sushiswap/tines'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { ContractTransaction } from 'ethers'
import { formatBytes32String } from 'ethers/lib/utils'
import { SushiXSwap as SushiXSwapContract } from '@sushiswap/wagmi'
import { Address } from '@sushiswap/wagmi'
import { HexString } from '@sushiswap/types'
import { readContract } from '@sushiswap/wagmi/actions'
import { SushiXSwapChainId } from '@sushiswap/sushixswap'

export type Complex = [
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
  }[],
  {
    token: string
    to: string
    unwrapBento: boolean
    minAmount: BigNumberish
  }[]
]

export enum Action {
  // Master contract approval
  SET_MASTER_CONTRACT_APPROVAL = 0,

  // Src Actions
  SRC_DEPOSIT_TO_BENTOBOX = 1,
  SRC_DEPOSIT = 11,
  SRC_TRANSFER_FROM_BENTOBOX = 2,

  // Dst Actions
  DST_DEPOSIT_TO_BENTOBOX = 3,
  DST_WITHDRAW = 4,
  DST_WITHDRAW_FROM_BENTOBOX = 5,

  // Unwrap (to native)
  UNWRAP_AND_TRANSFER = 6,

  // Legacy AMM
  LEGACY_EXACT_INPUT = 7,

  // Trident AMM
  TRIDENT_EXACT_INPUT = 8,
  TRIDENT_COMPLEX = 9,

  // Stargate teleport
  STARGATE_TELEPORT = 10,
}

export interface Cooker {
  readonly actions: Action[]
  readonly values: BigNumber[]
  readonly datas: Address[]
  add(action: Action, data: string, value: BigNumberish): void
}

export abstract class Cooker implements Cooker {
  readonly actions: Action[] = []
  readonly values: BigNumber[] = []
  readonly datas: Address[] = []
  readonly chainId: StargateChainId
  readonly debug: boolean
  readonly masterContract: Address
  readonly user: string
  constructor({
    chainId,
    debug = false,
    masterContract,
    user,
  }: {
    chainId: StargateChainId
    debug?: boolean
    masterContract: Address
    user: string
  }) {
    this.chainId = chainId
    this.debug = debug
    this.masterContract = masterContract
    this.user = user
  }
  add(action: Action, data: Address, value: BigNumberish = Zero): void {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
  }

  srcDepositToBentoBox(
    currency: Currency,
    recipient = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    if (this.debug)
      console.debug('cook src depoit to bentobox', {
        currency,
        recipient,
        amount,
        share,
      })
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [currency.isToken ? currency.address : AddressZero, recipient, BigNumber.from(amount), BigNumber.from(share)]
    )

    const value = currency.isNative ? amount : Zero

    this.add(Action.SRC_DEPOSIT_TO_BENTOBOX, data, value)
  }

  srcTransferFromBentoBox(
    token: Currency,
    to: string,
    amount: BigNumberish,
    share: BigNumberish = Zero,
    unwrap: boolean
  ): void {
    if (this.debug)
      console.debug('cook src transfer from bentobox', {
        token,
        to,
        amount,
        share,
        unwrap,
      })
    this.add(
      Action.SRC_TRANSFER_FROM_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256', 'bool'],
        [token.wrapped.address, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
      ) as HexString
    )
  }

  dstDepositToBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    this.add(
      Action.DST_DEPOSIT_TO_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256'],
        [token.isToken ? token.address : AddressZero, to, BigNumber.from(amount), BigNumber.from(share)]
      ),
      token.isNative ? amount : Zero
    )
  }

  dstWithdraw(token: Currency, to: string = this.user, amount = Zero): void {
    this.add(
      Action.DST_WITHDRAW,
      defaultAbiCoder.encode(['address', 'address', 'uint256'], [token.wrapped.address, to, amount]) as HexString
    )
  }

  dstWithdrawFromBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero,
    unwrap: boolean
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'bool'],
      [token.isToken ? token.address : AddressZero, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
    )
    const value = token.isNative ? amount : Zero
    this.add(Action.DST_WITHDRAW_FROM_BENTOBOX, data, value)
  }

  legacyExactInput(
    trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    recipient: string = this.user
  ): void {
    this.add(
      Action.LEGACY_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address'],
        [
          BigNumber.from(amountIn),
          BigNumber.from(amountOutMin),
          trade.route.legs.reduce<string[]>(
            (previousValue, currentValue) => [...previousValue, currentValue.tokenTo.address],
            [trade.route.legs[0].tokenFrom.address]
          ),
          recipient,
        ]
      ) as HexString
    )
  }

  tridentExactInput(
    trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>,
    to: string,
    shareIn: BigNumberish = Zero,
    shareOutMinimum: BigNumberish,
    unwrapBento: boolean
  ): void {
    this.add(
      Action.TRIDENT_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['tuple(address, uint256, uint256, tuple(address pool, bytes data)[])'],
        [
          [
            trade.inputAmount.currency.wrapped.address,
            BigNumber.from(shareIn),
            BigNumber.from(shareOutMinimum),
            trade.route.legs.map((leg, i) => {
              const isLastLeg = i === trade.route.legs.length - 1
              // console.log({
              //   pool: leg.poolAddress,
              //   data: [
              //     leg.tokenFrom.address,
              //     isLastLeg ? to : trade.route.legs[i + 1].poolAddress,
              //     isLastLeg && unwrapBento,
              //   ],
              // })
              return {
                pool: leg.poolAddress,
                data: defaultAbiCoder.encode(
                  ['address', 'address', 'bool'],
                  [
                    leg.tokenFrom.address,
                    isLastLeg ? to : trade.route.legs[i + 1].poolAddress,
                    isLastLeg && unwrapBento,
                  ]
                ),
              }
            }),
          ],
        ]
      ) as HexString
    )
  }

  tridentComplex(
    trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>,
    to: string,
    minAmount: BigNumberish,
    unwrapBento: boolean
  ): void {
    const initialPathCount = trade.route.legs.filter(
      (leg) => leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
    ).length
    this.add(
      Action.TRIDENT_COMPLEX,
      defaultAbiCoder.encode(
        [
          'tuple(tuple(address tokenIn, address pool, bool native, uint256 amount, bytes data)[], tuple(address tokenIn, address pool, uint64 balancePercentage, bytes data)[], tuple(address token, address to, bool unwrapBento, uint256 minAmount)[])',
        ],
        [
          trade.route.legs.reduce<Complex>(
            ([initialPath, percentagePath, output], leg, i) => {
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
                          ? trade.route.amountInBN.sub(
                              initialPath.reduce(
                                (previousValue, currentValue) => previousValue.add(currentValue.amount),
                                Zero
                              )
                            )
                          : getBigNumber(trade.route.amountIn * leg.absolutePortion),
                      native: false,
                      data: defaultAbiCoder.encode(
                        ['address', 'address', 'bool'],
                        [
                          leg.tokenFrom.address,
                          getSushiXSwapContractConfig(trade.inputAmount.currency.chainId as SushiXSwapChainId).address,
                          false,
                        ]
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
                        [
                          leg.tokenFrom.address,
                          getSushiXSwapContractConfig(trade.inputAmount.currency.chainId as SushiXSwapChainId).address,
                          false,
                        ]
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
                  token: trade.outputAmount.currency.wrapped.address,
                  to,
                  unwrapBento,
                  minAmount,
                },
              ],
            ]
          ),
        ]
      ) as HexString
    )
  }

  unwrapAndTransfer(token: Currency, to: string = this.user): void {
    this.add(
      Action.UNWRAP_AND_TRANSFER,
      defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to]) as HexString
    )
  }
}

export class SrcCooker extends Cooker {
  setMasterContractApproval(signature: Signature): void {
    if (this.debug) console.log('cook set master contract address', signature)
    this.add(
      Action.SET_MASTER_CONTRACT_APPROVAL,
      defaultAbiCoder.encode(
        ['address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.user, true, signature.v, signature.r, signature.s]
      ) as HexString
    )
  }

  legacyExactInput(
    trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>,
    amountIn: BigNumberish,
    amountOutMinimum: BigNumberish,
    recipient: string = this.user
  ): void {
    if (this.debug) console.debug('cook src legacy exact input')
    super.legacyExactInput(trade, amountIn, amountOutMinimum, recipient)
  }

  tridentExactInput(
    trade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>,
    to: string,
    shareIn: BigNumberish,
    shareOutMinimum: BigNumberish,
    unwrapBento: boolean
  ): void {
    if (this.debug) console.debug('cook src trident exact input')
    super.tridentExactInput(trade, to, shareIn, shareOutMinimum, unwrapBento)
  }
}

export class DstCooker extends Cooker {}

export interface Adapter {
  teleport(): void
}

export class StargateAdapter implements Adapter {
  teleport() {
    //
  }
}
// export class AnycallAdapter implements Adapter {}
// export class SocketAdapter implements Adapter {}

// SushiXSwap
export class SushiXSwap {
  readonly adapter: Adapter = new StargateAdapter()

  readonly srcCooker: SrcCooker

  readonly dstCooker: DstCooker

  readonly contract: SushiXSwapContract

  readonly crossChain: boolean

  readonly srcChainId: StargateChainId
  readonly dstChainId: StargateChainId

  readonly srcToken: Currency
  readonly dstToken: Currency

  readonly srcTrade:
    | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
    | undefined

  readonly dstTrade:
    | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
    | undefined

  readonly srcUseBentoBox: boolean
  readonly dstUseBentoBox: boolean

  readonly user: string
  readonly debug: boolean

  constructor({
    srcToken,
    dstToken,
    srcTrade,
    dstTrade,
    srcUseBentoBox = false,
    dstUseBentoBox = false,
    user,
    contract,
    debug = false,
  }: {
    srcToken: Currency
    dstToken: Currency
    srcTrade:
      | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
      | undefined
    dstTrade:
      | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT, TradeVersion.V1 | TradeVersion.V2>
      | undefined
    srcUseBentoBox: boolean
    dstUseBentoBox: boolean
    user: string
    contract: SushiXSwapContract
    debug?: boolean
  }) {
    this.srcToken = srcToken
    this.dstToken = dstToken

    this.srcUseBentoBox = srcUseBentoBox
    this.dstUseBentoBox = dstUseBentoBox

    this.srcChainId = this.srcToken.chainId as StargateChainId
    this.dstChainId = this.dstToken.chainId as StargateChainId

    this.srcTrade = srcTrade
    this.dstTrade = dstTrade

    this.crossChain = this.srcChainId !== this.dstChainId

    this.contract = contract

    this.user = user
    this.debug = debug

    this.srcCooker = new SrcCooker({
      chainId: this.srcChainId,
      debug,
      masterContract: getSushiXSwapContractConfig(this.srcToken.chainId as SushiXSwapChainId).address,
      user,
    })

    this.dstCooker = new DstCooker({
      chainId: this.dstChainId,
      debug,
      masterContract: getSushiXSwapContractConfig(this.dstToken.chainId as SushiXSwapChainId).address,
      user,
    })
  }

  // Transfers Scenarios
  // T1: BentoBox - Stargate - BentoBox
  // T2: Wallet - Stargate - Wallet
  // T3: Wallet - Stargate - BentoBox
  // T4: BentoBox - Stargate - Wallet
  transfer(amountIn: Amount<Currency>, shareIn: Share<Currency>): void {
    // T1-T4
    if (!this.srcUseBentoBox) {
      this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, 0, shareIn.quotient.toString())
    }
    this.srcCooker.srcTransferFromBentoBox(
      this.srcToken,
      this.srcCooker.masterContract,
      0,
      shareIn.quotient.toString(),
      true
    )
    this.dstCooker[this.dstUseBentoBox ? 'dstDepositToBentoBox' : 'dstWithdraw'](this.dstToken)
  }

  // Regular Swap Scenarios
  // S1: BentoBox - Swap - BentoBox
  // S2: Wallet - Swap - Wallet
  // S3: Wallet - Swap - BentoBox
  // S4: BentoBox - Swap - Wallet
  swap(
    amountIn: Amount<Currency>,
    shareIn: Share<Currency>,
    minimumAmountOut: Amount<Currency>,
    minimumShareOut: Share<Currency>
  ): void {
    // S1-S4
    if (this.srcTrade && this.srcTrade.isV1()) {
      if (!this.srcUseBentoBox) {
        this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, amountIn.quotient.toString(), 0)
      }
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken,
        this.srcCooker.masterContract,
        0,
        shareIn.quotient.toString(),
        true
      )
      this.srcCooker.legacyExactInput(
        this.srcTrade,
        0,
        minimumAmountOut.quotient.toString(),
        this.dstToken.isNative || this.dstUseBentoBox ? this.srcCooker.masterContract : this.user
      )
      if (this.dstUseBentoBox) {
        this.srcCooker.dstDepositToBentoBox(this.dstToken.wrapped)
      }
    } else if (this.srcTrade && this.srcTrade.isV2() && this.srcTrade.isSingle()) {
      if (!this.srcUseBentoBox) {
        this.srcCooker.srcDepositToBentoBox(
          this.srcToken,
          this.srcTrade.route.legs[0].poolAddress,
          amountIn.quotient.toString(),
          0
        )
      } else {
        this.srcCooker.srcTransferFromBentoBox(
          this.srcToken,
          this.srcTrade.route.legs[0].poolAddress,
          0,
          shareIn.quotient.toString(),
          false
        )
      }
      this.srcCooker.tridentExactInput(
        this.srcTrade,
        this.dstToken.isNative && !this.dstUseBentoBox ? this.srcCooker.masterContract : this.user,
        shareIn.quotient.toString(),
        minimumShareOut.quotient.toString(),
        (this.dstToken.isNative && !this.dstUseBentoBox) || !this.dstUseBentoBox
      )
    } else if (this.srcTrade && this.srcTrade.isV2() && this.srcTrade.isComplex()) {
      if (!this.srcUseBentoBox) {
        this.srcCooker.srcDepositToBentoBox(
          this.srcToken,
          this.srcCooker.masterContract,
          amountIn.quotient.toString(),
          0
        )
      } else {
        this.srcCooker.srcTransferFromBentoBox(
          this.srcToken,
          this.srcCooker.masterContract,
          0,
          shareIn.quotient.toString(),
          false
        )
      }
      this.srcCooker.tridentComplex(
        this.srcTrade,
        this.dstToken.isNative && !this.dstUseBentoBox ? this.srcCooker.masterContract : this.user,
        minimumShareOut.quotient.toString(),
        (this.dstToken.isNative && !this.dstUseBentoBox) || !this.dstUseBentoBox
      )
    }
    if (this.dstToken.isNative && !this.dstUseBentoBox) {
      this.srcCooker.unwrapAndTransfer(this.dstToken)
    }
  }

  // Cross Chain Swap Scenarios
  // X1: BentoBox - Swap - Stargate - Swap - BentoBox
  // X2: Wallet - Swap - Stargate - Swap - Wallet
  // X3: Wallet - Swap - Stargate - Swap - BentoBox
  // X4: BentoBox - Swap - Stargate - Swap - Wallet
  crossChainSwap({
    srcAmount,
    srcShare,
    srcMinimumAmountOut,
    srcMinimumShareOut,
    dstMinimumAmountOut,
    dstMinimumShareOut,
  }: {
    srcAmount: Amount<Currency>
    srcShare: Share<Currency>
    srcMinimumAmountOut?: Amount<Currency>
    srcMinimumShareOut?: Share<Currency>
    dstMinimumAmountOut: Amount<Currency>
    dstMinimumShareOut: Share<Currency>
  }) {
    // X1-X4
    // Src operations...
    if (isStargateBridgeToken(this.srcToken)) {
      // If cross chain & src token is stargate bridge token, there's no need for a src trade
      // so deposit to bentobox (if neccasasry) and transfer shares to SushiXSwap Router
      if (!this.srcUseBentoBox) {
        this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, 0, srcShare.quotient.toString())
      }
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken,
        this.srcCooker.masterContract,
        0,
        srcShare.quotient.toString(),
        true
      )
    } else if (this.srcTrade && this.srcTrade.isV1() && this.srcTrade.route.legs.length && srcMinimumAmountOut) {
      if (!this.srcUseBentoBox) {
        this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, srcAmount.quotient.toString(), 0)
      }
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken,
        this.srcCooker.masterContract,
        0,
        srcShare.quotient.toString(),
        true
      )
      this.srcCooker.legacyExactInput(
        this.srcTrade,
        0,
        srcMinimumAmountOut.quotient.toString(),
        this.srcCooker.masterContract
      )
    } else if (
      this.srcTrade &&
      this.srcTrade.isV2() &&
      this.srcTrade.route.legs.length &&
      srcMinimumAmountOut &&
      srcMinimumShareOut
    ) {
      if (this.srcTrade.isSingle()) {
        console.debug('cook trident exact input')
        if (!this.srcUseBentoBox) {
          this.srcCooker.srcDepositToBentoBox(
            this.srcToken,
            this.srcTrade.route.legs[0].poolAddress,
            srcAmount.quotient.toString(),
            0
          )
        } else {
          this.srcCooker.srcTransferFromBentoBox(
            this.srcToken,
            this.srcTrade.route.legs[0].poolAddress,
            0,
            srcShare.quotient.toString(),
            false
          )
        }
        this.srcCooker.tridentExactInput(
          this.srcTrade,
          this.srcCooker.masterContract,
          srcShare.quotient.toString(),
          srcMinimumShareOut.quotient.toString(),
          true
        )
      } else if (this.srcTrade.isComplex()) {
        console.debug('cook trident complex')
        if (!this.srcUseBentoBox) {
          this.srcCooker.srcDepositToBentoBox(
            this.srcToken,
            this.srcCooker.masterContract,
            srcAmount.quotient.toString(),
            0
          )
        } else {
          this.srcCooker.srcTransferFromBentoBox(
            this.srcToken,
            this.srcCooker.masterContract,
            0,
            srcShare.quotient.toString(),
            false
          )
        }
        this.srcCooker.tridentComplex(
          this.srcTrade,
          this.srcCooker.masterContract,
          srcMinimumShareOut.quotient.toString(),
          true
        )
      }
    }

    // Dst operations...
    if (isStargateBridgeToken(this.dstToken)) {
      // If cross chain & dst token is stargate bridge token, there's no need for a dst trade
      // so either deposit to the users bentboxbox or withdraw to users wallet
      this.dstCooker[this.dstUseBentoBox ? 'dstDepositToBentoBox' : 'dstWithdraw'](this.dstToken)
    } else if (this.dstTrade && this.dstTrade.isV1() && this.dstTrade.route.legs.length) {
      console.debug('cook teleport legacy exact in')
      this.dstCooker.legacyExactInput(
        this.dstTrade,
        0,
        dstMinimumAmountOut.quotient.toString(),
        this.dstToken.isNative || this.dstUseBentoBox ? this.dstCooker.masterContract : this.user
      )

      if (this.dstUseBentoBox) {
        this.dstCooker.dstDepositToBentoBox(this.dstToken.wrapped)
      }

      if (this.dstToken.isNative && !this.dstUseBentoBox) {
        this.dstCooker.unwrapAndTransfer(this.dstToken)
      }
    } else if (this.dstTrade && this.dstTrade.isV2() && this.dstTrade.route.legs.length) {
      if (this.dstTrade.isSingle()) {
        console.debug('dst cook teleport trident exact input')
        this.dstCooker.tridentExactInput(
          this.dstTrade,
          this.dstToken.isNative && !this.dstUseBentoBox ? this.dstCooker.masterContract : this.user,
          0,
          dstMinimumShareOut.quotient.toString(),
          (this.dstToken.isNative && !this.dstUseBentoBox) || !this.dstUseBentoBox
        )
        if (this.dstToken.isNative && !this.dstUseBentoBox) {
          this.dstCooker.unwrapAndTransfer(this.dstToken)
        }
      } else if (this.dstTrade.isComplex()) {
        console.debug('dst cook teleport trident complex')
        this.dstCooker.dstDepositToBentoBox(this.dstTrade.inputAmount.currency, this.dstCooker.masterContract)
        this.dstCooker.tridentComplex(
          this.dstTrade,
          this.dstToken.isNative && !this.dstUseBentoBox ? this.dstCooker.masterContract : this.user,
          dstMinimumShareOut.quotient.toString(),
          (this.dstToken.isNative && !this.dstUseBentoBox) || !this.dstUseBentoBox
        )

        if (this.dstToken.isNative && !this.dstUseBentoBox) {
          this.dstCooker.unwrapAndTransfer(this.dstToken)
        }

        // If any excess input tokens remain, withdraw from bentobox
        this.dstCooker.dstWithdrawFromBentoBox(
          this.dstTrade.inputAmount.currency,
          this.user,
          0,
          0,
          !this.dstUseBentoBox
        )
      }
    }
  }

  teleport(
    srcBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.srcChainId][0],
    dstBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.dstChainId][0],
    gasSpent = 1000000,
    id: string,
    amountMin: Amount<Currency>,
    dustAmount: Amount<Currency> = Amount.fromRawAmount(Native.onChain(this.dstChainId), 0)
  ): void {
    // uint16 dstChainId; // stargate dst chain id
    // address token; // token getting bridged
    // uint256 srcPoolId; // stargate src pool id
    // uint256 dstPoolId; // stargate dst pool id
    // uint256 amount; // amount to bridge
    // uint256 amountMin; // amount to bridge minimum
    // uint256 dustAmount; // native token to be received on dst chain
    // address receiver; // sushiXswap on dst chain
    // address to; // receiver bridge token incase of transaction reverts on dst chain
    // uint256 gas; // extra gas to be sent for dst chain operations
    // bytes32 srcContext; // random bytes32 as source context
    const data = defaultAbiCoder.encode(
      [
        'uint16',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'address',
        'uint256',
        'bytes32',
        'uint8[]',
        'uint256[]',
        'bytes[]',
      ],
      [
        STARGATE_CHAIN_ID[this.dstCooker.chainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcCooker.chainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstCooker.chainId][dstBridgeToken.address],
        0,
        amountMin.quotient.toString(),
        dustAmount.quotient.toString(),
        this.dstCooker.masterContract,
        this.user,
        gasSpent,
        formatBytes32String(id),
        this.dstCooker.actions,
        this.dstCooker.values.map((value) => BigNumber.from(value)),
        this.dstCooker.datas,
      ]
    ) as HexString

    if (this.debug) {
      console.debug('cook teleport', [
        STARGATE_CHAIN_ID[this.dstCooker.chainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcCooker.chainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstCooker.chainId][dstBridgeToken.address],
        0,
        0,
        0,
        this.dstCooker.masterContract,
        this.user,
        gasSpent,
        id,
        this.dstCooker.actions,
        this.dstCooker.values.map((value) => BigNumber.from(value)),
        this.dstCooker.datas,
      ])
    }

    this.srcCooker.add(Action.STARGATE_TELEPORT, data)
  }

  async getFee(gasSpent = 1000000) {
    return this.crossChain
      ? await readContract({
          ...getSushiXSwapContractConfig(this.srcChainId),
          chainId: this.srcChainId,
          functionName: 'getFee',
          args: [
            STARGATE_CHAIN_ID[this.dstCooker.chainId],
            1,
            this.dstCooker.masterContract,
            BigNumber.from(gasSpent),
            BigNumber.from(0),
            defaultAbiCoder.encode(
              ['address', 'uint8[]', 'uint256[]', 'bytes[]'],
              [this.user, this.dstCooker.actions, this.dstCooker.values, this.dstCooker.datas]
            ) as HexString,
          ],
        })
      : [Zero, Zero]
  }

  async cook(gasSpent = 1000000): Promise<ContractTransaction | undefined> {
    if (!this.contract) {
      return
    }

    if (!this.srcCooker.actions.length) {
      return
    }

    if (this.crossChain && !this.dstCooker.actions.length) {
      return
    }

    // Add more validation, e.g. if teleport action is given, ensure src & dst chain are different

    if (this.debug) {
      console.debug(
        [this.srcCooker.actions, this.srcCooker.values, this.srcCooker.datas],
        [this.dstCooker.actions, this.dstCooker.values, this.dstCooker.datas]
      )
    }

    try {
      // console.log('Before fee')

      const [fee] = await this.getFee(gasSpent)

      // console.log(`Successful Fee`, fee)

      const value = this.srcCooker.values.reduce((a, b) => a.add(b), fee)
      return this.contract.cook(this.srcCooker.actions, this.srcCooker.values, this.srcCooker.datas, {
        value,
      })
    } catch (error) {
      console.error('SushiXSwap Fee Error', error)
    }
  }
}
