import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Fee } from '@sushiswap/exchange'
import { Button, classNames, DEFAULT_INPUT_RING, Loader, Select } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { PairState, PoolState, Web3Input } from '@sushiswap/wagmi'
import { Layout } from 'components'
import React, { useEffect, useState } from 'react'

import { AMM_ENABLED_NETWORKS, SUPPORTED_CHAIN_IDS, TRIDENT_ENABLED_NETWORKS } from '../config'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'
import { PoolFinder } from '../systems/PoolFinder/PoolFinder'

const Test = () => {
  const [chainId, setChainId] = useState(ChainId.ETHEREUM)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const [token0, setToken0] = useState<Type | undefined>()
  const [token1, setToken1] = useState<Type | undefined>()

  useEffect(() => {
    setToken0(undefined)
    setToken1(undefined)
  }, [chainId])

  return (
    <Layout className="pb-40">
      <PoolFinder
        components={
          <PoolFinder.Components>
            <PoolFinder.LegacyPool
              chainId={chainId}
              token0={token0}
              token1={token1}
              enabled={AMM_ENABLED_NETWORKS.includes(chainId)}
            />
            <PoolFinder.ConstantProductPool
              chainId={chainId}
              token0={token0}
              token1={token1}
              enabled={TRIDENT_ENABLED_NETWORKS.includes(chainId)}
              fee={Fee.DEFAULT}
              twap={false}
            />
          </PoolFinder.Components>
        }
      >
        {({ pool: [poolState, pool] }) => {
          const title =
            !token0 || !token1 ? (
              'Select Tokens'
            ) : [PairState.LOADING, PoolState.LOADING].includes(poolState) ? (
              <div className="h-[20px]">
                <Loader width={14} />
              </div>
            ) : [PairState.EXISTS, PoolState.EXISTS].includes(poolState) ? (
              'Add Liquidity'
            ) : (
              'Create Pool'
            )

          return (
            <Widget id="createOrAdd" maxWidth={400}>
              <Widget.Content>
                <Widget.Header title={title} />
                <Select
                  button={
                    <Listbox.Button
                      type="button"
                      className={({ open }) =>
                        classNames(
                          DEFAULT_INPUT_RING,
                          open ? 'ring-offset-2 ring-blue' : '',
                          'w-full flex gap-2 items-center h-[54px] items-center rounded-md px-4 ring-offset-slate-700'
                        )
                      }
                      value={chainId}
                    >
                      <span className="text-sm capitalize font-medium truncate">{chains[chainId].name}</span>
                      <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                    </Listbox.Button>
                  }
                  value={chainId}
                  onChange={setChainId}
                >
                  <Select.Options>
                    {SUPPORTED_CHAIN_IDS.map((chainId) => (
                      <Select.Option key={chainId} value={chainId}>
                        {chains[chainId].name}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select>
                <Web3Input.Currency
                  className="p-3"
                  value={input0}
                  onChange={(val) => setTypedAmounts((prev) => ({ ...prev, input0: val }))}
                  currency={token0}
                  onSelect={setToken0}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={chainId}
                  tokenMap={tokenMap}
                />
                <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                  <div className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full">
                    <PlusIcon width={16} height={16} />
                  </div>
                </div>
                <div className="bg-slate-800">
                  <Web3Input.Currency
                    className="p-3 !pb-1"
                    value={input1}
                    onChange={(val) => setTypedAmounts((prev) => ({ ...prev, input1: val }))}
                    currency={token1}
                    onSelect={setToken1}
                    customTokenMap={customTokensMap}
                    onAddToken={addCustomToken}
                    onRemoveToken={removeCustomToken}
                    chainId={chainId}
                    tokenMap={tokenMap}
                  />
                  <div className="p-3">
                    <Button size="md" fullWidth>
                      {title}
                    </Button>
                  </div>
                </div>
              </Widget.Content>
            </Widget>
          )
        }}
      </PoolFinder>
    </Layout>
  )
}

export default Test
