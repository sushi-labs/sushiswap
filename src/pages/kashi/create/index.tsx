import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, SwitchVerticalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAINLINK_ORACLE_ADDRESS, Currency, KASHI_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import Typography from 'app/components/Typography'
import { CHAINLINK_PRICE_FEED_MAP } from 'app/config/oracles/chainlink'
import { Feature } from 'app/enums'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { e10 } from 'app/functions/math'
import NetworkGuard from 'app/guards/Network'
import { useBentoBoxContract } from 'app/hooks/useContract'
import { SwapLayoutCard } from 'app/layouts/SwapLayout'
import { useActiveWeb3React } from 'app/services/web3'
import { Field } from 'app/state/create/actions'
import { useCreateActionHandlers, useCreateState, useDerivedCreateInfo } from 'app/state/create/hook'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useRouter } from 'next/router'
import React, { Fragment, useCallback } from 'react'

export default function Create() {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const bentoBoxContract = useBentoBoxContract()
  const addTransaction = useTransactionAdder()
  const router = useRouter()
  const { typedValue } = useCreateState()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useCreateActionHandlers()
  const { currencies, inputError } = useDerivedCreateInfo()

  const both = Boolean(currencies[Field.COLLATERAL] && currencies[Field.ASSET])

  const getOracleData = useCallback(
    async (asset: Currency, collateral: Currency) => {
      const oracleData = ''

      // @ts-ignore TYPE NEEDS FIXING
      const mapping = CHAINLINK_PRICE_FEED_MAP[chainId]

      for (const address in mapping) {
        mapping[address].address = address
      }

      let multiply = AddressZero
      let divide = AddressZero

      const multiplyMatches = Object.values(mapping).filter(
        // @ts-ignore TYPE NEEDS FIXING
        (m) => m.from === asset.wrapped.address && m.to === collateral.wrapped.address
      )

      let decimals = 0

      if (multiplyMatches.length) {
        const match = multiplyMatches[0]
        // @ts-ignore TYPE NEEDS FIXING
        multiply = match.address!
        // @ts-ignore TYPE NEEDS FIXING
        decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
      } else {
        const divideMatches = Object.values(mapping).filter(
          // @ts-ignore TYPE NEEDS FIXING
          (m) => m.from === collateral.wrapped.address && m.to === asset.wrapped.address
        )
        if (divideMatches.length) {
          const match = divideMatches[0]
          // @ts-ignore TYPE NEEDS FIXING
          divide = match.address!
          // @ts-ignore TYPE NEEDS FIXING
          decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
        } else {
          // @ts-ignore TYPE NEEDS FIXING
          const mapFrom = Object.values(mapping).filter((m) => m.from === asset.wrapped.address)
          // @ts-ignore TYPE NEEDS FIXING
          const mapTo = Object.values(mapping).filter((m) => m.from === collateral.wrapped.address)
          const match = mapFrom
            .map((mfrom) => ({
              mfrom: mfrom,
              // @ts-ignore TYPE NEEDS FIXING
              mto: mapTo.filter((mto) => mfrom.to === mto.to),
            }))
            .filter((path) => path.mto.length)
          if (match.length) {
            // @ts-ignore TYPE NEEDS FIXING
            multiply = match[0].mfrom.address!
            // @ts-ignore TYPE NEEDS FIXING
            divide = match[0].mto[0].address!
            // @ts-ignore TYPE NEEDS FIXING
            decimals = 18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
          } else {
            return ''
          }
        }
      }

      return defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
    },
    [chainId]
  )

  const handleCreate = async () => {
    try {
      if (!both) return

      // @ts-ignore TYPE NEEDS FIXING
      const oracleData = await getOracleData(currencies[Field.ASSET], currencies[Field.COLLATERAL])

      if (!oracleData) {
        console.log('No path')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      if (!(chainId in CHAINLINK_ORACLE_ADDRESS)) {
        console.log('No chainlink oracle address')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      if (!(chainId in KASHI_ADDRESS)) {
        console.log('No kashi address')
        return
      }

      // @ts-ignore TYPE NEEDS FIXING
      const oracleAddress = CHAINLINK_ORACLE_ADDRESS[chainId]

      const kashiData = defaultAbiCoder.encode(
        ['address', 'address', 'address', 'bytes'],
        [
          // @ts-ignore TYPE NEEDS FIXING
          currencies[Field.COLLATERAL].wrapped.address,
          // @ts-ignore TYPE NEEDS FIXING
          currencies[Field.ASSET].wrapped.address,
          oracleAddress,
          oracleData,
        ]
      )

      console.log([
        // @ts-ignore TYPE NEEDS FIXING
        currencies[Field.COLLATERAL].wrapped.address,
        // @ts-ignore TYPE NEEDS FIXING
        currencies[Field.ASSET].wrapped.address,
        oracleAddress,
        oracleData,
      ])

      const tx = await bentoBoxContract?.deploy(chainId && KASHI_ADDRESS[chainId], kashiData, true)

      addTransaction(tx, {
        // @ts-ignore TYPE NEEDS FIXING
        summary: `Add Kashi market ${currencies[Field.ASSET].symbol}/${currencies[Field.COLLATERAL].symbol} Chainlink`,
      })

      router.push('/lend')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container maxWidth="lg" className="py-4 md:py-12 lg:py-[120px] px-2">
      <SwapLayoutCard>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-2">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {i18n._(t`Create Market`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(
                t`Please select two tokens to be used as asset and collateral respectively that this market will consist of. When creating a market, you have to provide some asset tokens.`
              )}
            </Typography>
          </div>
          <div className="flex flex-col flex-grow gap-1">
            <Typography variant="sm" className="flex items-center">
              {i18n._(t`Asset`)}
            </Typography>
            <SwapAssetPanel
              error={false}
              header={(props) => <SwapAssetPanel.Header {...props} selectLabel={i18n._(t`Select Asset`)} />}
              selected={true}
              currency={currencies[Field.ASSET]}
              value={typedValue}
              onChange={(amount) => onUserInput(Field.ASSET, amount || '')}
              onSelect={(currency) => onCurrencySelection(Field.ASSET, currency)}
            />
          </div>
          <div className="flex justify-center relative lg:mt-[-10px] lg:mb-[-30px]">
            <div onClick={onSwitchTokens} className="rounded-full hover:text-white p-1.5 cursor-pointer">
              <SwitchVerticalIcon width={12} height={12} />
            </div>
          </div>
          <div className="flex flex-col flex-grow gap-1">
            <Typography variant="sm" className="flex items-center">
              {i18n._(t`Collateral`)}
            </Typography>
            <SwapAssetPanel
              error={false}
              header={(props) => <SwapAssetPanel.Header {...props} selectLabel={i18n._(t`Select Collateral`)} />}
              selected={true}
              currency={currencies[Field.COLLATERAL]}
              value={typedValue}
              onChange={(amount) => onUserInput(Field.COLLATERAL, amount || '')}
              onSelect={(currency) => onCurrencySelection(Field.COLLATERAL, currency)}
              hideInput={true}
            />
          </div>
          <div className="flex flex-col flex-grow gap-1">
            <Typography variant="sm" className="flex items-center">
              {i18n._(t`Oracle`)}
            </Typography>
            <div className="opacity-40 pointer-events-none flex items-center justify-between h-full px-4 py-2 border rounded bg-dark-900 border-dark-700 hover:border-dark-600">
              <Menu as="div" className="relative inline-block w-full text-left">
                <Menu.Button className="w-full" disabled>
                  <div className="flex flex-row items-center justify-between">
                    <Typography weight={700} variant="sm">
                      ChainLink
                    </Typography>
                    <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute z-10 w-full mt-2 overflow-auto border rounded shadow-lg bg-dark-900 border-dark-700 hover:border-dark-600"
                  >
                    <Menu.Item>
                      <Typography
                        variant="sm"
                        weight={700}
                        className="text-primary px-3 py-2 cursor-pointer hover:bg-dark-900/40"
                      >
                        ChainLink
                      </Typography>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        <Button color="gradient" onClick={() => handleCreate()} disabled={!both}>
          {inputError || i18n._(t`Create Market`)}
        </Button>
      </SwapLayoutCard>
    </Container>
  )
}

Create.Guard = NetworkGuard(Feature.KASHI)
