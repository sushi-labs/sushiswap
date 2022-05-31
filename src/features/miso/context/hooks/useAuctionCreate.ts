import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { CHAIN_KEY, Percent } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { AuctionCreationFormInputFormatted } from 'app/features/miso/AuctionCreationForm'
import { NATIVE_PAYMENT_TOKEN } from 'app/features/miso/context/constants'
import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import { useLiquidityLauncherTemplateMap } from 'app/features/miso/context/hooks/useLiquidityLauncherTemplateMap'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import {
  AuctionCreationWizardInputFormatted,
  AuctionTemplate,
  LiquidityLauncherTemplate,
  TokenSetup,
} from 'app/features/miso/context/types'
import { useContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { addMinutes, getUnixTime } from 'date-fns'
import { useCallback } from 'react'
const useAuctionCreate = () => {
  const { chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { map: auctionTemplateMap } = useAuctionTemplateMap()
  const { map: tokenTemplateMap } = useTokenTemplateMap()
  const { map: launcherTemplateMap } = useLiquidityLauncherTemplateMap()
  const marketFactory = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOMarket.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOMarket.abi : undefined
  )
  const tokenFactory = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.abi : undefined
  )
  const launcherFactory = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOLauncher.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOLauncher.abi : undefined
  )
  const recipeContract = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.AuctionCreation.abi : undefined
  )

  const subscribe = useCallback(
    (event: string, cb) => {
      if (!marketFactory) return

      marketFactory.on(event, cb)
    },
    [marketFactory]
  )

  const unsubscribe = useCallback(
    (event: string, cb) => {
      if (!marketFactory) return

      marketFactory.off(event, cb)
    },
    [marketFactory]
  )

  const _prepareWizardAuctionData = useCallback((types, data) => {
    types.splice(types.length - 3, 3)
    data.splice(data.length - 3, 3)
    types.splice(0, 2)
    data.splice(0, 2)

    return [types, data]
  }, [])

  const _dutchAuctionData = useCallback(
    (data: AuctionCreationFormInputFormatted, marketFactoryAddress: string, wizard: boolean = false) => {
      if (!data.startPrice || !data.endPrice) throw new Error('Invalid inputs')
      const _types = [
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
      ]

      const now = Math.floor(Date.now() / 1000)
      const startDate = getUnixTime(data.startDate)
      const endDate = getUnixTime(data.endDate)

      const _data = [
        marketFactoryAddress,
        data.auctionToken.address,
        data.tokenAmount.quotient.toString(),
        now > startDate ? getUnixTime(addMinutes(now, 5)) : startDate,
        now > endDate ? getUnixTime(addMinutes(now, 30)) : endDate,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.startPrice.numerator.toString(),
        data.endPrice.numerator.toString(),
        account,
        data.pointListAddress,
        account,
      ]

      if (wizard) {
        const [a, b] = _prepareWizardAuctionData(_types, _data)
        return defaultAbiCoder.encode(a, b)
      }

      return defaultAbiCoder.encode(_types, _data)
    },
    [_prepareWizardAuctionData, account]
  )

  const _batchAuctionData = useCallback(
    (data, marketFactoryAddress: string, wizard: boolean = false) => {
      if (!data.minimumRaised) throw new Error('Invalid inputs')
      const _types = [
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
      ]

      const now = Math.floor(Date.now() / 1000)
      const startDate = getUnixTime(data.startDate)
      const endDate = getUnixTime(data.endDate)

      const _data = [
        marketFactoryAddress,
        data.auctionToken.address,
        data.tokenAmount.quotient.toString(),
        now > startDate ? getUnixTime(addMinutes(now, 5)) : startDate,
        now > endDate ? getUnixTime(addMinutes(now, 30)) : endDate,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.minimumRaised.quotient.toString(),
        account,
        data.pointListAddress,
        account,
      ]

      if (wizard) {
        const [a, b] = _prepareWizardAuctionData(_types, _data)
        return defaultAbiCoder.encode(a, b)
      }

      return defaultAbiCoder.encode(_types, _data)
    },
    [_prepareWizardAuctionData, account]
  )

  const _crowdsaleAuctionData = useCallback(
    (data, marketFactoryAddress: string, wizard: boolean = false) => {
      if (!data.fixedPrice || !data.minimumTarget) throw new Error('Invalid inputs')
      const _types = [
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
      ]

      const now = Math.floor(Date.now() / 1000)
      const startDate = getUnixTime(data.startDate)
      const endDate = getUnixTime(data.endDate)

      const _data = [
        marketFactoryAddress,
        data.auctionToken.address,
        data.paymentCurrency.isNative ? NATIVE_PAYMENT_TOKEN : data.paymentCurrency.wrapped.address,
        data.tokenAmount.quotient.toString(),
        now > startDate ? getUnixTime(addMinutes(now, 5)) : startDate,
        now > endDate ? getUnixTime(addMinutes(now, 30)) : endDate,
        data.fixedPrice.numerator.toString(),
        data.minimumTarget.quotient.toString(),
        account,
        data.pointListAddress,
        account,
      ]

      if (wizard) {
        const [a, b] = _prepareWizardAuctionData(_types, _data)
        return defaultAbiCoder.encode(a, b)
      }

      return defaultAbiCoder.encode(_types, _data)
    },
    [_prepareWizardAuctionData, account]
  )

  const getAuctionData = useCallback(
    (data, marketFactoryAddress: string, wizard: boolean = false) => {
      if (data.auctionType === AuctionTemplate.DUTCH_AUCTION)
        return _dutchAuctionData(data, marketFactoryAddress, wizard)
      if (data.auctionType === AuctionTemplate.BATCH_AUCTION)
        return _batchAuctionData(data, marketFactoryAddress, wizard)
      if (data.auctionType === AuctionTemplate.CROWDSALE)
        return _crowdsaleAuctionData(data, marketFactoryAddress, wizard)

      throw new Error('Unknown auction type')
    },
    [_batchAuctionData, _crowdsaleAuctionData, _dutchAuctionData]
  )

  const init = useCallback(
    async (data: AuctionCreationFormInputFormatted) => {
      const marketFactoryAddress = auctionTemplateMap?.[data.auctionType]?.address
      if (!marketFactory) throw new Error('Contract not initialized')
      if (!marketFactoryAddress) throw new Error('Market factory address not found')
      if (!account) throw new Error('Wallet not connected')

      // Get auction type template ID first
      const templateId = await marketFactory.getTemplateId(marketFactoryAddress)
      const tx = await marketFactory.createMarket(
        templateId,
        data.auctionToken.address,
        data.tokenAmount.quotient.toString(),
        AddressZero,
        getAuctionData(data, marketFactory.address)
      )

      addTransaction(tx, { summary: 'Create Auction' })

      return tx
    },
    [account, addTransaction, auctionTemplateMap, marketFactory, getAuctionData]
  )

  const initWizard = useCallback(
    async (data: AuctionCreationWizardInputFormatted) => {
      const marketFactoryAddress = auctionTemplateMap?.[data.auctionType]?.address
      const tokenFactoryAddress = tokenTemplateMap?.[data.tokenType]?.address
      const listFactoryAddress = launcherTemplateMap?.[LiquidityLauncherTemplate.PostAuctionLauncher]?.address

      if (!launcherFactory) throw new Error('Launcher factory contract not initialized')
      if (!tokenFactory) throw new Error('Token factory contract not initialized')
      if (!marketFactory) throw new Error('Market factory contract not initialized')
      if (!recipeContract) throw new Error('Recipe contract not initialized')
      if (!marketFactoryAddress) throw new Error('Market factory address not found')
      if (!tokenFactoryAddress) throw new Error('Token factory address not found')
      if (!account) throw new Error('Wallet not connected')

      // Get template IDs first
      const marketTemplateId = await marketFactory.getTemplateId(marketFactoryAddress)
      const tokenTemplateId = await tokenFactory.getTemplateId(tokenFactoryAddress)
      const launcherTemplateId = await launcherFactory.getTemplateId(listFactoryAddress)
      const tokenFactoryData = defaultAbiCoder.encode(
        ['bool', 'address', 'uint256', 'string', 'string', 'uint256'],
        [
          data.tokenSetupType === TokenSetup.PROVIDE,
          data.tokenSetupType === TokenSetup.PROVIDE ? data.tokenAddress : AddressZero,
          tokenTemplateId,
          data.tokenSetupType === TokenSetup.PROVIDE ? '0x0' : data.tokenName,
          data.tokenSetupType === TokenSetup.PROVIDE ? '0x0' : data.tokenSymbol,
          data.tokenSetupType === TokenSetup.PROVIDE
            ? data.tokenAmount
                .add(data.tokenAmount.multiply(new Percent(data.liqPercentage, 10000)))
                .quotient.toString()
            : data.tokenSupply?.quotient.toString(),
        ]
      )
      const marketFactoryData = defaultAbiCoder.encode(
        ['uint256', 'bytes'],
        [marketTemplateId, getAuctionData(data, marketFactory.address, true)]
      )
      const launcherFactoryData = defaultAbiCoder.encode(
        ['uint256', 'uint256', 'uint256'],
        [launcherTemplateId, data.liqPercentage, data.liqLockTime]
      )

      const tx = await recipeContract.prepareMiso(
        tokenFactoryData,
        data.accounts,
        data.amounts,
        marketFactoryData,
        launcherFactoryData
      )

      addTransaction(tx, { summary: 'Create Auction' })

      return tx
    },
    [
      account,
      addTransaction,
      auctionTemplateMap,
      getAuctionData,
      launcherFactory,
      launcherTemplateMap,
      marketFactory,
      recipeContract,
      tokenFactory,
      tokenTemplateMap,
    ]
  )

  return {
    subscribe,
    unsubscribe,
    init,
    initWizard,
  }
}

export default useAuctionCreate
