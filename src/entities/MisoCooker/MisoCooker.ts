import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import {
  AddAction,
  CreateLiquidityLauncherAction,
  CreateMarketBatchAction,
  CreateMarketCrowdsaleAction,
  CreateMarketDutchAction,
  CreateTokenAction,
  DeployPointlistAction,
  MisoCookerAction,
} from 'app/entities/MisoCooker/types'
import { NATIVE_PAYMENT_TOKEN } from 'app/features/miso/context/constants'

export default class KashiCooker {
  private actions: MisoCookerAction[]
  private values: BigNumber[]
  private data: string[]

  constructor() {
    this.actions = []
    this.values = []
    this.data = []
  }

  add: AddAction = ({ action, data, value = 0 }) => {
    this.actions.push(action)
    this.data.push(data)
    this.values.push(BigNumber.from(value))
  }

  createToken: CreateTokenAction = ({ templateId, tokenData, integratorFeeAccount }) => {
    this.add({
      action: MisoCookerAction.CREATE_TOKEN,
      data: defaultAbiCoder.encode(
        ['uint256', 'address', 'bytes'],
        [
          templateId,
          integratorFeeAccount,
          defaultAbiCoder.encode(
            ['uint256', 'string', 'string', 'uint256'],
            [tokenData.templateId, tokenData.tokenName, tokenData.tokenSymbol, tokenData.tokenSupply]
          ),
        ]
      ),
    })

    return this
  }

  deployPointList: DeployPointlistAction = ({ listOwner, accounts, amounts }) => {
    this.add({
      action: MisoCookerAction.DEPLOY_POINT_LIST,
      data: defaultAbiCoder.encode(['address', 'address[]', 'uint256[]'], [listOwner, accounts, amounts]),
    })

    return this
  }

  createMarketDutch: CreateMarketDutchAction = ({ templateId, integratorFeeAccount, auctionData, tokenSupply }) => {
    this.add({
      action: MisoCookerAction.CREATE_MARKET_DUTCH,
      data: defaultAbiCoder.encode(
        ['uint256', 'address', 'uint256', 'address', 'bytes'],
        [
          templateId,
          '',
          tokenSupply,
          integratorFeeAccount,
          defaultAbiCoder.encode(
            [
              'address',
              'address',
              'uint256',
              'uint256',
              'uint256',
              'address',
              'uint256',
              'uint256',
              'address',
              'address',
              'address',
            ],
            [
              auctionData.marketFactoryAddress,
              auctionData.auctionTokenAddress,
              auctionData.tokenAmount.quotient.toString(),
              auctionData.startDate.getTime() / 1000,
              auctionData.endDate.getTime() / 1000,
              auctionData.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : auctionData.paymentCurrency.wrapped.address,
              auctionData.startPrice.numerator.toString(),
              auctionData.endPrice.numerator.toString(),
              auctionData.account,
              auctionData.pointListAddress,
              auctionData.account,
            ]
          ),
        ]
      ),
    })

    return this
  }

  createMarketCrowdsale: CreateMarketCrowdsaleAction = ({
    templateId,
    integratorFeeAccount,
    tokenSupply,
    auctionData,
  }) => {
    this.add({
      action: MisoCookerAction.CREATE_MARKET_CROWDSALE,
      data: defaultAbiCoder.encode(
        ['uint256', 'address', 'uint256', 'address', 'bytes'],
        [
          templateId,
          '',
          tokenSupply,
          integratorFeeAccount,
          defaultAbiCoder.encode(
            [
              'address',
              'address',
              'address',
              'uint256',
              'uint256',
              'uint256',
              'uint256',
              'uint256',
              'address',
              'address',
              'address',
            ],
            [
              auctionData.marketFactoryAddress,
              auctionData.auctionTokenAddress,
              auctionData.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : auctionData.paymentCurrency.wrapped.address,
              auctionData.tokenAmount.quotient.toString(),
              auctionData.startDate.getTime() / 1000,
              auctionData.endDate.getTime() / 1000,
              auctionData.fixedPrice.numerator.toString(),
              auctionData.minimumTarget.quotient.toString(),
              auctionData.account,
              auctionData.pointListAddress,
              auctionData.account,
            ]
          ),
        ]
      ),
    })

    return this
  }

  createMarketBatch: CreateMarketBatchAction = ({ templateId, tokenSupply, integratorFeeAccount, auctionData }) => {
    this.add({
      action: MisoCookerAction.CREATE_MARKET_BATCH,
      data: defaultAbiCoder.encode(
        ['uint256', 'address', 'uint256', 'address', 'bytes'],
        [
          templateId,
          '',
          tokenSupply,
          integratorFeeAccount,
          defaultAbiCoder.encode(
            [
              'address',
              'address',
              'uint256',
              'uint256',
              'uint256',
              'address',
              'uint256',
              'address',
              'address',
              'address',
            ],
            [
              auctionData.marketFactoryAddress,
              auctionData.auctionTokenAddress,
              auctionData.tokenAmount.quotient.toString(),
              auctionData.startDate.getTime() / 1000,
              auctionData.endDate.getTime() / 1000,
              auctionData.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : auctionData.paymentCurrency.wrapped.address,
              auctionData.minimumRaised.quotient.toString(),
              auctionData.account,
              auctionData.pointListAddress,
              auctionData.account,
            ]
          ),
        ]
      ),
    })

    return this
  }

  createLiquidityLauncher: CreateLiquidityLauncherAction = ({
    templateId,
    integratorFeeAccount,
    launcherData,
    auctionTokenAddress,
    tokenSupply,
  }) => {
    this.add({
      action: MisoCookerAction.LIQUIDITY_LAUNCHER,
      data: defaultAbiCoder.encode(
        ['uint256', 'address', 'uint256', 'address', 'bytes'],
        [
          templateId,
          auctionTokenAddress ? auctionTokenAddress : AddressZero,
          tokenSupply,
          integratorFeeAccount,
          defaultAbiCoder.encode(
            ['uint256', 'uint256', 'uint256'],
            [launcherData.launcherTemplateId, launcherData.liqPercentage, launcherData.liqLockTime]
          ),
        ]
      ),
    })

    return this
  }
}
