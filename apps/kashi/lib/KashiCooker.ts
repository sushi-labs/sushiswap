import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { AddressZero, Zero } from '@ethersproject/constants'
import { PayableOverrides } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/chain'

import { KashiMediumRiskLendingPairV1 } from './KashiPair'

enum Action {
  ADD_ASSET = 1,
  REPAY = 2,
  REMOVE_ASSET = 3,
  REMOVE_COLLATERAL = 4,
  BORROW = 5,
  GET_REPAY_SHARE = 6,
  GET_REPAY_PART = 7,
  ACCRUE = 8,

  // Functions that don't need accrue to be called
  ADD_COLLATERAL = 10,
  UPDATE_EXCHANGE_RATE = 11,

  // Function on BentoBox
  BENTO_DEPOSIT = 20,
  BENTO_WITHDRAW = 21,
  BENTO_TRANSFER = 22,
  BENTO_TRANSFER_MULTIPLE = 23,
  BENTO_SETAPPROVAL = 24,

  // Any external call (except to BentoBox)
  CALL = 30,
}

import { Amount, Currency, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { KashiPairMediumRiskV1 as KashiPairMediumRiskV1Contract } from '@sushiswap/kashi/typechain'
import { PromiseOrValue } from '@sushiswap/kashi/typechain/common'
import { calculateGasMargin } from '@sushiswap/wagmi'
import { Signature } from 'ethers'
import { UserRejectedRequestError } from 'wagmi'

export class BentoBoxCooker<T> {
  add: (action: Action, data: string, value: BigNumberish) => T
  constructor(add: (action: Action, data: string, value: BigNumberish) => T) {
    this.add = add
  }
  transfer(token: string, to: string, share: BigNumber): T {
    return this.add(
      Action.BENTO_TRANSFER,
      defaultAbiCoder.encode(['address', 'address', 'int256'], [token, to, share]),
      0
    )
  }

  deposit(token: string, to: string, amount: BigNumberish, share: BigNumberish): T {
    return this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(['address', 'address', 'int256', 'int256'], [token, to, amount, share]),
      amount
    )
  }
}

export default class KashiCooker {
  private readonly account: string
  private readonly chainId: number
  private readonly contract: KashiPairMediumRiskV1Contract
  private readonly pair: KashiMediumRiskLendingPairV1

  private bentoBoxCooker: BentoBoxCooker<KashiCooker>

  private actions: Action[]
  private values: BigNumber[]
  private datas: string[]

  constructor({
    account,
    chainId,
    contract,
    pair,
  }: {
    account: string
    chainId: ChainId
    contract: KashiPairMediumRiskV1Contract
    pair: KashiMediumRiskLendingPairV1
  }) {
    this.pair = pair
    this.account = account || AddressZero
    this.contract = contract
    this.chainId = chainId

    this.actions = []
    this.values = []
    this.datas = []

    this.bentoBoxCooker = new BentoBoxCooker(this.add)
  }

  add(action: Action, data: string, value: BigNumberish = Zero): KashiCooker {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
    return this
  }

  setMasterContractApproval({ v, r, s }: Signature): void {
    this.add(
      Action.BENTO_SETAPPROVAL,
      defaultAbiCoder.encode(
        ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.account, this.pair.masterContract, true, v, r, s]
      )
    )
  }

  updateExchangeRate(mustUpdate = false, minRate = Zero, maxRate = Zero): KashiCooker {
    return this.add(
      Action.UPDATE_EXCHANGE_RATE,
      defaultAbiCoder.encode(['bool', 'uint256', 'uint256'], [mustUpdate, minRate, maxRate])
    )
  }

  bentoBoxTransfer(token: string, to: string, share: BigNumber): KashiCooker {
    return this.add(Action.BENTO_TRANSFER, defaultAbiCoder.encode(['address', 'address', 'int256'], [token, to, share]))
  }

  bentoBoxTransferCollateral(to: string, share: BigNumber): KashiCooker {
    return this.bentoBoxTransfer(this.pair.collateral.wrapped.address, to, share)
  }

  bentoBoxTransferAsset(to: string, share: BigNumber): KashiCooker {
    return this.bentoBoxTransfer(this.pair.asset.wrapped.address, to, share)
  }

  bentoBoxDeposit(token: string, to: string, share: BigNumber): KashiCooker {
    const useNative = this.pair.asset.wrapped.address === WNATIVE_ADDRESS[this.chainId]
    return this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(['address', 'address', 'int256', 'int256'], [token, to, 0, share]),
      useNative ? share : Zero
    )
  }

  addCollateral(amount: BigNumber): KashiCooker {
    const useNative = this.pair.collateral.wrapped.address === WNATIVE_ADDRESS[this.chainId]

    this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.wrapped.address, this.account, amount, Zero]
      ),
      useNative ? amount : Zero
    )
    const share: BigNumber = BigNumber.from(-2)
    this.add(Action.ADD_COLLATERAL, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))
    return this
  }

  addAsset(amount: Amount<Currency>): KashiCooker {
    const useNative = this.pair.asset.wrapped.address === WNATIVE_ADDRESS[this.chainId]

    this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.asset.wrapped.address, this.account, amount.quotient.toString(), Zero]
      ),
      useNative ? amount.quotient.toString() : Zero
    )
    const share: BigNumber = BigNumber.from(-2)

    this.add(Action.ADD_ASSET, defaultAbiCoder.encode(['int256', 'address', 'bool'], [share, this.account, false]))

    return this
  }

  removeAsset(fraction: BigNumber, toBento: boolean): KashiCooker {
    this.add(Action.REMOVE_ASSET, defaultAbiCoder.encode(['int256', 'address'], [fraction, this.account]))
    if (!toBento) {
      const useNative = this.pair.asset.wrapped.address === WNATIVE_ADDRESS[this.chainId]
      this.add(
        Action.BENTO_WITHDRAW,
        defaultAbiCoder.encode(
          ['address', 'address', 'int256', 'int256'],
          [useNative ? AddressZero : this.pair.asset.wrapped.address, this.account, Zero, -1]
        )
      )
    }
    return this
  }

  action(
    address: string,
    value: BigNumberish,
    data: string,
    useValue1: boolean,
    useValue2: boolean,
    returnValues: number
  ): void {
    this.add(
      Action.CALL,
      defaultAbiCoder.encode(
        ['address', 'bytes', 'bool', 'bool', 'uint8'],
        [address, data, useValue1, useValue2, returnValues]
      ),
      value
    )
  }

  async cook({ overrides }: { overrides?: PayableOverrides & { from?: PromiseOrValue<string> } } = {}) {
    try {
      const estimatedGas = await this.contract.estimateGas.cook(this.actions, this.values, this.datas, {
        ...overrides,
        value: this.values.reduce((a, b) => a.add(b), Zero),
      })
      return this.contract.cook(this.actions, this.values, this.datas, {
        ...overrides,
        gasLimit: calculateGasMargin(estimatedGas),
        value: this.values.reduce((a, b) => a.add(b), Zero),
      })
    } catch (error) {
      if (error instanceof UserRejectedRequestError) return
      console.error('KashiCooker Error: ', error)
    }
  }
}
