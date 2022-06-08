import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { STARGATE_BRIDGE_TOKENS, STARGATE_CHAIN_ID, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { SushiXSwap as SushiXSwapContract } from '@sushiswap/sushixswap/typechain'
import { SUSHI_X_SWAP_ADDRESS } from 'config'

import { Complex } from './getComplexParams'

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

export class StargateAdapter {}
export class AnycallAdapter {}
export class SocketAdapter {}

export abstract class Cooker {
  readonly actions: Action[] = []
  readonly values: BigNumber[] = []
  readonly datas: string[] = []
  readonly user: string
  readonly debug: boolean
  constructor({ user, debug = false }: { user: string; debug?: boolean }) {
    this.user = user
    this.debug = debug
  }
  add(action: Action, data: string, value: BigNumberish = Zero): void {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
  }
}

// SushiXSwap
export class SushiXSwap extends Cooker {
  readonly contract: SushiXSwapContract

  readonly crossChain: boolean

  readonly srcChainId: number
  readonly dstChainId: number

  readonly srcToken: Currency
  readonly dstToken: Currency

  readonly srcUseBentoBox: boolean
  readonly dstUseBentoBox: boolean

  readonly srcMasterContract: string
  readonly dstMasterContract: string

  teleporter: Teleporter

  constructor({
    srcToken,
    dstToken,
    srcUseBentoBox = false,
    dstUseBentoBox = false,
    user,
    contract,
    debug = false,
  }: {
    srcToken: Currency
    dstToken: Currency
    srcUseBentoBox: boolean
    dstUseBentoBox: boolean
    user: string
    contract: SushiXSwapContract
    debug?: boolean
  }) {
    super({ user, debug })

    this.srcToken = srcToken
    this.dstToken = dstToken

    this.srcUseBentoBox = srcUseBentoBox
    this.dstUseBentoBox = dstUseBentoBox

    this.srcChainId = this.srcToken.chainId
    this.dstChainId = this.dstToken.chainId

    this.crossChain = this.srcChainId !== this.dstChainId

    this.contract = contract

    this.srcMasterContract = SUSHI_X_SWAP_ADDRESS[this.srcToken.chainId]
    this.dstMasterContract = SUSHI_X_SWAP_ADDRESS[this.dstToken.chainId]

    this.teleporter = new Teleporter(user)
  }

  // Transfers Scenarios
  // T1: BentoBox - Stargate - BentoBox
  // T2: Wallet - Stargate - Wallet
  // T3: Wallet - Stargate - BentoBox
  // T4: BentoBox - Stargate - Wallet
  stargateTransfer(amountIn: Amount<Currency>, shareIn: Amount<Currency>): void {
    // T1-T4
    if (this.srcUseBentoBox && this.dstUseBentoBox) {
      // T1
      console.log(`cook stargate transfer from bentobox on chain ${this.srcChainId} to bentobox on ${this.dstChainId}`)
      this.srcTransferFromBentoBox(this.srcToken.wrapped.address, this.srcMasterContract, amountIn.quotient.toString())
      this.teleporter.dstDepositToBentoBox(this.dstToken, this.user)
    } else if (!this.srcUseBentoBox && !this.dstUseBentoBox) {
      // T2
      // Regular src transfer to pool instead? (this will requite approval of SushiXSwap contract)
      console.log(`cook stargate transfer from wallet on chain ${this.srcChainId} to wallet on ${this.dstChainId}`)
      this.srcDepositToBentoBox(this.srcToken, this.user, amountIn.quotient.toString())
      this.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcMasterContract,
        0,
        shareIn.quotient.toString()
      )
      this.teleporter.dstWithdraw(this.dstToken, this.user)
    } else if (!this.srcUseBentoBox && this.dstUseBentoBox) {
      // T3
      console.log(`cook stargate transfer from wallet on chain ${this.srcChainId} to bentobox on ${this.dstChainId}`)
      this.srcDepositToBentoBox(this.srcToken, this.user, amountIn.quotient.toString())
      this.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcMasterContract,
        0,
        shareIn.quotient.toString()
      )
      this.teleporter.dstDepositToBentoBox(this.dstToken, this.user)
    } else if (this.srcUseBentoBox && !this.dstUseBentoBox) {
      // T4
      console.log(`cook stargate transfer from bentobox on chain ${this.srcChainId} to wallet on ${this.dstChainId}`)
      this.srcTransferFromBentoBox(this.srcToken.wrapped.address, this.srcMasterContract, amountIn.quotient.toString())
      this.teleporter.dstWithdraw(this.dstToken, this.user)
    }
  }

  setMasterContractApproval(signature: Signature): void {
    this.add(
      Action.SET_MASTER_CONTRACT_APPROVAL,
      defaultAbiCoder.encode(
        ['address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.user, true, signature.v, signature.r, signature.s]
      )
    )
  }

  srcDepositToBentoBox(
    token: Currency,
    recipient = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, recipient, BigNumber.from(amount), BigNumber.from(share)]
    )

    const value = token.isNative ? amount : Zero

    this.add(Action.SRC_DEPOSIT_TO_BENTOBOX, data, value)
  }

  dstDepositToBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const value = token.isNative ? amount : Zero
    this.add(
      Action.DST_DEPOSIT_TO_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256'],
        [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
      ),
      value
    )
  }

  dstWithdrawFromwBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
    )
    const value = token.isNative ? amount : Zero
    this.add(Action.DST_WITHDRAW_FROM_BENTOBOX, data, value)
  }

  srcTransferFromBentoBox(
    from: string,
    to: string,
    amount: BigNumberish,
    share: BigNumberish = Zero,
    unwrap = true
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'bool'],
      [from, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
    )
    this.add(Action.SRC_TRANSFER_FROM_BENTOBOX, data)
  }

  dstWithdraw(token: Currency, to: string = this.user, amount = Zero): void {
    this.add(
      Action.DST_WITHDRAW,
      defaultAbiCoder.encode(['address', 'address', 'uint256'], [token.wrapped.address, to, amount])
    )
  }

  legacyExactInput(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    recipient: string = this.user
  ): void {
    this.add(
      Action.LEGACY_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address'],
        [BigNumber.from(amountIn), BigNumber.from(amountOutMin), path, recipient]
      )
    )
  }

  tridentExactInput(
    tokenIn: Currency,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: {
      pool: string
      data: string
    }[]
  ): void {
    this.add(
      Action.TRIDENT_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['tuple(address, uint256, uint256, tuple(address pool, bytes data)[])'],
        [[tokenIn.wrapped.address, BigNumber.from(amountIn), BigNumber.from(amountOutMin), path]]
      )
    )
  }

  tridentComplex(params: Complex): void {
    this.add(
      Action.TRIDENT_COMPLEX,
      defaultAbiCoder.encode(
        [
          'tuple(tuple(address tokenIn, address pool, bool native, uint256 amount, bytes data)[], tuple(address tokenIn, address pool, uint64 balancePercentage, bytes data)[], tuple(address token, address to, bool unwrapBento, uint256 minAmount)[])',
        ],
        [params]
      )
    )
  }

  teleport(
    srcBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.srcChainId][0],
    dstBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.dstChainId][0]
  ): void {
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
        'uint8[]',
        'uint256[]',
        'bytes[]',
      ],
      [
        STARGATE_CHAIN_ID[this.dstChainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcChainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstChainId][dstBridgeToken.address],
        0,
        0,
        0,
        this.dstMasterContract,
        this.user,
        500000,
        this.teleporter.actions,
        this.teleporter.values.map((value) => BigNumber.from(value)),
        this.teleporter.datas,
      ]
    )

    if (this.debug) {
      console.debug('cook teleport', [
        STARGATE_CHAIN_ID[this.dstChainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcChainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstChainId][dstBridgeToken.address],
        0,
        0,
        0,
        this.dstMasterContract,
        this.user,
        500000,
        this.teleporter.actions,
        this.teleporter.values.map((value) => BigNumber.from(value)),
        this.teleporter.datas,
      ])
    }

    this.add(Action.STARGATE_TELEPORT, data)
  }

  encodeUnwrapAndTransfer(token: Currency, to: string = this.user): string {
    return defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to])
  }

  unwrapAndTransfer(token: Currency, to: string = this.user): void {
    this.add(Action.UNWRAP_AND_TRANSFER, this.encodeUnwrapAndTransfer(token, to))
  }

  async cook() {
    if (!this.contract) {
      return
    }

    if (!this.actions.length) {
      return
    }

    if (this.crossChain && !this.teleporter.actions.length) {
      return
    }

    // Add more validation, e.g. if teleport action is given, ensure src & dst chain are different

    if (this.debug) {
      console.debug([this.actions, this.values, this.datas], this.teleporter)
    }

    try {
      console.log('Before fee')

      const [fee] = this.crossChain
        ? await this.contract.getFee(
            STARGATE_CHAIN_ID[this.dstChainId],
            1,
            this.dstMasterContract,
            500000,
            0,
            defaultAbiCoder.encode(
              ['address', 'uint8[]', 'uint256[]', 'bytes[]'],
              [this.user, this.teleporter.actions, this.teleporter.values, this.teleporter.datas]
            )
          )
        : [Zero, Zero]

      console.log(`Successful Fee`, fee)

      try {
        const tx = await this.contract.cook(this.actions, this.values, this.datas, {
          value: this.values.reduce((a, b) => a.add(b), fee),
        })
        console.log(`Successful Cook Transaction`, tx)
      } catch (error) {
        console.error('SushiXSwap Cook Error', error)
      }
    } catch (error) {
      console.error('SushiXSwap Fee Error', error)
    }
  }
}

export class Teleporter extends Cooker {
  constructor(user: string) {
    super(user)
  }
  dstWithdraw(token: Currency, to: string = this.user, amount: BigNumberish = Zero): void {
    this.add(
      Action.DST_WITHDRAW,
      defaultAbiCoder.encode(['address', 'address', 'uint256'], [token.wrapped.address, to, BigNumber.from(amount)])
    )
  }
  dstDepositToBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const value = token.isNative ? amount : Zero
    this.add(
      Action.DST_DEPOSIT_TO_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256'],
        [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
      ),
      value
    )
  }
  legacyExactInput(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    recipient: string = this.user
  ): void {
    this.add(
      Action.LEGACY_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address'],
        [BigNumber.from(amountIn), BigNumber.from(amountOutMin), path, recipient]
      )
    )
  }
  tridentExactInput(
    tokenIn: Currency,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: {
      pool: string
      data: string
    }[]
  ): void {
    console.log({ tokenIn, amountIn, amountOutMin, path })
    this.add(
      Action.TRIDENT_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['tuple(address, uint256, uint256, tuple(address pool, bytes data)[])'],
        [[tokenIn.wrapped.address, BigNumber.from(amountIn), BigNumber.from(amountOutMin), path]]
      )
    )
  }
  tridentComplex(params: Complex): void {
    this.add(
      Action.TRIDENT_COMPLEX,
      defaultAbiCoder.encode(
        [
          'tuple(tuple(address tokenIn, address pool, bool native, uint256 amount, bytes data)[], tuple(address tokenIn, address pool, uint64 balancePercentage, bytes data)[], tuple(address token, address to, bool unwrapBento, uint256 minAmount)[])',
        ],
        [params]
      )
    )
  }
  unwrapAndTransfer(token: Currency, to: string = this.user): void {
    this.add(Action.UNWRAP_AND_TRANSFER, defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to]))
  }
}
