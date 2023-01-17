'use client'

import { Popover } from '@headlessui/react'
import { ArrowTrendingUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { chainName } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui13/components/button'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui13/components/networkselector'
import { Tooltip } from '@sushiswap/ui13/components/Tooltip'
import { AppType } from '@sushiswap/ui13/types'
import React, { useCallback, useMemo, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { usePrice } from '@sushiswap/react-query'
import { Amount, Price, Token, tryParseAmount } from '@sushiswap/currency'
import { useBreakpoint } from '@sushiswap/ui13/lib/useBreakpoint'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'

export const WidgetTitle = () => {
  const [invert, setInvert] = useState(false)
  const { appType, network0, network1, token1, token0, tokensLoading } = useSwapState()
  const { setNetwork1, setNetwork0 } = useSwapActions()
  const { data: prices0 } = usePrice({ chainId: network0, address: token0?.wrapped.address })
  const { data: prices1 } = usePrice({ chainId: network1, address: token1?.wrapped.address })
  const { isSm } = useBreakpoint('sm')

  const [inputUSD, outputUSD, price] = useMemo(() => {
    if (!prices0 || !prices1) {
      return ['0.00', '0.00', '0.00']
    }

    const token0Price = prices0 ? tryParseAmount('1', token0)?.multiply(prices0) : undefined
    const token1Price = prices1 ? tryParseAmount('1', token1)?.multiply(prices1) : undefined
    const dummy0 = new Token({ address: token0.wrapped.address, chainId: 1, decimals: token0.decimals })
    const dummy1 = new Token({ address: token1.wrapped.address, chainId: 1, decimals: token1.decimals })

    let price
    if (token0Price && token1Price) {
      price = new Price({
        baseAmount: Amount.fromRawAmount(dummy0, token0Price.quotient.toString()),
        quoteAmount: Amount.fromRawAmount(dummy1, token1Price.quotient.toString()),
      })
    }

    return [
      token0Price?.toSignificant(6) ?? '0.00',
      token1Price?.toSignificant(6) ?? '0.00',
      price ? (invert ? price.invert().toSignificant(4) : price.toSignificant(4)) : '0.00',
    ]
  }, [invert, prices0, prices1, token0, token1])

  const handleSelect0 = useCallback<NetworkSelectorOnSelectCallback>(
    (el, close) => {
      setNetwork0(el)
      close()
    },
    [setNetwork0]
  )

  const handleSelect1 = useCallback<NetworkSelectorOnSelectCallback>(
    (el, close) => {
      setNetwork1(el)
      close()
    },
    [setNetwork1]
  )

  return (
    <div className="flex flex-col gap-2 mb-4 sm:mt-10 mt-2">
      {tokensLoading ? (
        <>
          <Skeleton.Text fontSize="text-2xl" className="w-1/3" />
          <Skeleton.Text fontSize="text-2xl" className="w-2/4" />
        </>
      ) : appType === AppType.Swap ? (
        <>
          <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-medium text-gray-900 dark:text-slate-50 leading-[36px] sm:leading-[44px]">
            Sell <span className="font-semibold">{token0.symbol}</span>
          </h1>
          <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-medium text-gray-900 dark:text-slate-50 leading-[36px] sm:leading-[44px]">
            {' '}
            Receive <span className="font-semibold">{token1.symbol}</span>
          </h1>
        </>
      ) : (
        <>
          <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-medium text-gray-900 dark:text-slate-50 max-h-[36px] sm:max-h-[44px]">
            Sell <span className="font-semibold">{token0.symbol}</span> on
            <NetworkSelector
              networks={SUPPORTED_CHAIN_IDS}
              variant="dialog"
              selected={network0}
              onSelect={handleSelect0}
            >
              <Tooltip description={chainName[network0]} transitionDelay={300}>
                <Popover.Button
                  as={Button}
                  variant={isSm ? 'outlined' : 'empty'}
                  color="blue"
                  size="lg"
                  className="!px-3"
                >
                  <NetworkIcon chainId={network0} width={32} height={32} />
                  <ChevronDownIcon width={36} height={36} />
                </Popover.Button>
              </Tooltip>
            </NetworkSelector>
          </h1>
          <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-medium text-gray-900 dark:text-slate-50 max-h-[36px] sm:max-h-[44px]">
            Receive <span className="font-semibold">{token1.symbol}</span> on
            <NetworkSelector
              variant="dialog"
              networks={SUPPORTED_CHAIN_IDS}
              selected={network1}
              onSelect={handleSelect1}
            >
              <Tooltip description={chainName[network1]} transitionDelay={300}>
                <Popover.Button
                  as={Button}
                  variant={isSm ? 'outlined' : 'empty'}
                  color="blue"
                  size="lg"
                  className="!px-3"
                >
                  <NetworkIcon chainId={network1} width={32} height={32} />
                  <ChevronDownIcon width={36} height={36} />
                </Popover.Button>
              </Tooltip>
            </NetworkSelector>
          </h1>
        </>
      )}
      {tokensLoading ? (
        <Skeleton.Text fontSize="text-sm" className="w-2/4" />
      ) : (
        <button
          onClick={() => setInvert((invert) => !invert)}
          className="text-sm flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          <ArrowTrendingUpIcon width={16} height={16} />
          <span className="flex items-baseline gap-1">
            1 {invert ? token0.symbol : token1.symbol}{' '}
            <span className="font-normal text-xs">(${invert ? inputUSD : outputUSD})</span> = {price}{' '}
            {invert ? token1.symbol : token0.symbol}{' '}
            <span className="font-normal text-xs">(${invert ? outputUSD : inputUSD})</span>
          </span>
        </button>
      )}
    </div>
  )
}
