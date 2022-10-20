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

import { getAddress } from '@ethersproject/address'
import { Amount, Currency, Share, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { KashiPairMediumRiskV1 as KashiPairMediumRiskV1Contract } from '@sushiswap/kashi/typechain'
import { PromiseOrValue } from '@sushiswap/kashi/typechain/common'
import { calculateGasMargin } from '@sushiswap/wagmi'
import { Signature } from 'ethers'
import { UserRejectedRequestError } from 'wagmi'

// Not really neccasary here, but could be a nice pattern for SushiXSwap
export class BentoBoxCooker<T> {
  private readonly add: (action: Action, data: string, value: BigNumberish) => T
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
  //   private readonly bentoBoxCooker: BentoBoxCooker<KashiCooker>
  private readonly actions: Action[]
  private readonly values: BigNumber[]
  private readonly datas: string[]
  // Use first return value
  private readonly USE_VALUE1 = BigNumber.from(-1)
  // Use second return value
  private readonly USE_VALUE2 = BigNumber.from(-2)

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
    this.chainId = chainId
    this.account = getAddress(account)
    this.contract = contract
    this.pair = pair

    this.actions = []
    this.values = []
    this.datas = []
    // this.bentoBoxCooker = new BentoBoxCooker(this.add)
  }

  add(action: Action, data: string, value: BigNumberish = Zero): KashiCooker {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
    return this
  }

  setMasterContractApproval({ v, r, s }: Signature): KashiCooker {
    return this.add(
      Action.BENTO_SETAPPROVAL,
      defaultAbiCoder.encode(
        ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.account, this.pair.masterContract, true, v, r, s]
      )
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

  bentoBoxDeposit(to: string, amount: Amount<Currency>, share: Share<Currency>): KashiCooker {
    return this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [
          amount.currency.isNative ? AddressZero : amount.currency.address,
          to,
          amount.quotient.toString(),
          share.quotient.toString(),
        ]
      ),
      amount.currency.isNative ? amount.quotient.toString() : Zero
    )
  }

  bentoBoxWithdraw(to: string, amount: Amount<Currency>, share: Share<Currency>): KashiCooker {
    return this.add(
      Action.BENTO_WITHDRAW,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [
          amount.currency.isNative ? AddressZero : amount.currency.address,
          to,
          amount.quotient.toString(),
          share.quotient.toString(),
        ]
      )
    )
  }

  updateExchangeRate(mustUpdate = false, minRate = Zero, maxRate = Zero): KashiCooker {
    return this.add(
      Action.UPDATE_EXCHANGE_RATE,
      defaultAbiCoder.encode(['bool', 'uint256', 'uint256'], [mustUpdate, minRate, maxRate])
    )
  }

  addAsset(
    amount: Amount<Currency>,
    share: Share<Currency> = Share.fromRawShare(this.pair.asset),
    to: string = this.account,
    skim = false
  ): KashiCooker {
    this.bentoBoxDeposit(to, amount, share)
    this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [
          amount.currency.isNative ? AddressZero : amount.currency.address,
          to,
          amount.quotient.toString(),
          share.quotient.toString(),
        ]
      ),
      amount.currency.isNative ? amount.quotient.toString() : Zero
    )
    return this.add(
      Action.ADD_ASSET,
      defaultAbiCoder.encode(['int256', 'address', 'bool'], [this.USE_VALUE2, to, skim])
    )
  }

  removeAssetToBentoBox(fraction: BigNumber, to: string = this.account): KashiCooker {
    return this.add(Action.REMOVE_ASSET, defaultAbiCoder.encode(['int256', 'address'], [fraction, to]))
  }

  removeAssetToWallet(fraction: BigNumber, to: string = this.account): KashiCooker {
    this.removeAssetToBentoBox(fraction, to)
    const useNative = this.pair.asset.wrapped.address === WNATIVE_ADDRESS[this.chainId]
    return this.add(
      Action.BENTO_WITHDRAW,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.asset.wrapped.address, to, Zero, this.USE_VALUE1]
      )
    )
  }

  addCollateralFromBentoBox(amount: Amount<Currency>, to = this.account, skim = false): KashiCooker {
    return this.add(
      Action.ADD_COLLATERAL,
      defaultAbiCoder.encode(['int256', 'address', 'bool'], [amount.quotient.toString(), to, skim])
    )
  }

  addCollateralFromWallet(amount: Amount<Currency>, to = this.account, skim = false): KashiCooker {
    const useNative = this.pair.collateral.wrapped.address === WNATIVE_ADDRESS[this.chainId]
    this.add(
      Action.BENTO_DEPOSIT,
      defaultAbiCoder.encode(
        ['address', 'address', 'int256', 'int256'],
        [useNative ? AddressZero : this.pair.collateral.wrapped.address, to, amount.quotient.toString(), Zero]
      ),
      useNative ? amount.quotient.toString() : Zero
    )
    return this.add(
      Action.ADD_COLLATERAL,
      defaultAbiCoder.encode(['int256', 'address', 'bool'], [this.USE_VALUE2, to, skim])
    )
  }

  call(
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
