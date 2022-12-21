import { RadioGroup } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/outline'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { Fee } from '@sushiswap/amm'
import chains from '@sushiswap/chain'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, Currency, IconButton, NetworkIcon } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { PoolFinderType, TokenSelector, TokenSelectorProps } from '@sushiswap/wagmi'
import React, { FC, memo, useCallback, useState } from 'react'

import { SUPPORTED_CHAIN_IDS, TRIDENT_ENABLED_NETWORKS } from '../../config'
import { useAddPositionActions, useAddPositionState } from '../AddPositionProvider'

const FEE_OPTIONS = [
  { value: Fee.LOW, title: '0.01%', subtitle: 'Best for stable pairs' },
  { value: Fee.MEDIUM, title: '0.05%', subtitle: 'Best for less volatile pairs' },
  { value: Fee.DEFAULT, title: '0.3%', subtitle: 'Best for most pairs' },
  { value: Fee.HIGH, title: '1.0%', subtitle: 'Best for volatile pairs' },
]

const POOL_OPTIONS = [
  {
    value: PoolFinderType.Classic,
    title: 'Classic',
    subtitle: 'Suitable for regular pairs',
  },
  {
    value: PoolFinderType.Stable,
    title: 'Stable',
    subtitle: 'Suitable for stable pairs',
  },
  {
    value: PoolFinderType.ConcentratedLiquidity,
    title: 'Concentrated Liquidity',
    subtitle: 'Suitable for capital efficiency',
  },
]

type SelectPoolDetailsWidgetProps = Pick<
  TokenSelectorProps,
  'customTokenMap' | 'tokenMap' | 'onAddToken' | 'onRemoveToken'
>

export const SelectPoolDetailsWidget: FC<SelectPoolDetailsWidgetProps> = memo(function SelectPoolDetailsWidget({
  customTokenMap,
  tokenMap,
  onAddToken,
  onRemoveToken,
}) {
  const { chainId, poolType, fee, token0, token1 } = useAddPositionState()
  const { setChainId, setPoolType, setFee, setToken1, setToken0 } = useAddPositionActions()

  const [open0, setOpen0] = useState(false)
  const [open1, setOpen1] = useState(false)
  const close0 = useCallback(() => setOpen0(false), [])
  const close1 = useCallback(() => setOpen1(false), [])

  return (
    <Widget id="selectPoolType" maxWidth={400} className="!bg-slate-800">
      <Widget.Content>
        <div className="flex flex-col gap-8 p-4">
          <RadioGroup value={chainId} onChange={setChainId} className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Network</span>
              <span className="text-[10px] uppercase font-bold text-white">{chains[chainId].name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_CHAIN_IDS.map((el) => (
                <RadioGroup.Option
                  key={el}
                  as={IconButton}
                  description={chains[el].name}
                  value={el}
                  className={({ checked }) =>
                    classNames(
                      'rounded-full p-2 cursor-pointer',
                      `${
                        checked
                          ? 'ring-2 ring-blue bg-blue/20 shadow-md shadow-blue/50'
                          : 'ring-0 hover:ring-2 hover:ring-slate-200/20'
                      }`
                    )
                  }
                >
                  <NetworkIcon type="circle" chainId={el} width={22} height={22} />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tokens</span>
            <div className="flex gap-2 items-center">
              <Button
                fullWidth
                {...(token0 && { startIcon: <Currency.Icon currency={token0} width={24} height={24} /> })}
                className={classNames('!font-semibold justify-between', token0 ? '!bg-slate-700' : '')}
                endIcon={<ChevronDownIcon width={20} height={20} />}
                onClick={() => setOpen0(true)}
              >
                {token0?.symbol ?? `Token A`}
              </Button>
              <div className="flex items-center">
                <PlusIcon width={16} height={16} className="text-slate-500" />
              </div>
              <Button
                fullWidth
                {...(token1 && { startIcon: <Currency.Icon currency={token1} width={24} height={24} /> })}
                className={classNames('!font-semibold justify-between', token1 ? '!bg-slate-700' : '')}
                endIcon={<ChevronDownIcon width={20} height={20} />}
                onClick={() => setOpen1(true)}
              >
                {token1?.symbol ?? `Token B`}
              </Button>
            </div>
            <TokenSelector
              id="select-pool-tokens-widget-token0"
              variant="dialog"
              onClose={close0}
              open={open0}
              fundSource={FundSource.WALLET}
              chainId={chainId}
              currency={token0}
              onSelect={setToken0}
              onAddToken={onAddToken}
              onRemoveToken={onRemoveToken}
              tokenMap={tokenMap}
              customTokenMap={customTokenMap}
              includeNative={true}
            />
            <TokenSelector
              id="select-pool-tokens-widget-token1"
              variant="dialog"
              onClose={close1}
              open={open1}
              fundSource={FundSource.WALLET}
              chainId={chainId}
              currency={token1}
              onSelect={setToken1}
              onAddToken={onAddToken}
              onRemoveToken={onRemoveToken}
              tokenMap={tokenMap}
              customTokenMap={customTokenMap}
              includeNative={true}
            />
          </div>
          <div className="h-px bg-slate-200/10 w-full" />
          <RadioGroup value={poolType} onChange={setPoolType} className="flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Type</span>
            <div className="grid grid-cols-2 gap-2">
              {POOL_OPTIONS.filter((el) =>
                TRIDENT_ENABLED_NETWORKS.includes(chainId) ? true : el.value === PoolFinderType.Classic
              ).map(({ value, title, subtitle }) => (
                <RadioGroup.Option
                  key={value}
                  value={value}
                  className={({ checked }) =>
                    classNames(
                      'rounded-lg p-2 cursor-pointer border',
                      `${
                        checked
                          ? 'ring-1 ring-blue shadow-md shadow-blue/50 border-blue'
                          : 'ring-0 hover:ring-1 hover:ring-slate-200/10 border-slate-200/10'
                      }`
                    )
                  }
                >
                  {({ checked }) => (
                    <div className="relative">
                      {checked && (
                        <div className="absolute right-0 bg-blue rounded-full p-0.5">
                          <CheckIcon width={12} height={12} />
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-semibold text-slate-50">{title}</p>
                        <p className="text-[10px] font-medium text-slate-300">{subtitle}</p>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <RadioGroup value={fee} onChange={setFee} className="flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fee</span>
            <div className="grid grid-cols-2 gap-2">
              {FEE_OPTIONS.filter((el) =>
                TRIDENT_ENABLED_NETWORKS.includes(chainId) ? true : el.value === Fee.DEFAULT
              ).map(({ value, title, subtitle }) => (
                <RadioGroup.Option
                  key={value}
                  value={value}
                  className={({ checked }) =>
                    classNames(
                      'rounded-lg p-2 cursor-pointer border',
                      `${
                        checked
                          ? 'ring-1 ring-blue shadow-md shadow-blue/50 border-blue'
                          : 'ring-0 hover:ring-1 hover:ring-slate-200/10 border-slate-200/10'
                      }`
                    )
                  }
                >
                  {({ checked }) => (
                    <div className="relative">
                      {checked && (
                        <div className="absolute right-0 bg-blue rounded-full p-0.5">
                          <CheckIcon width={12} height={12} />
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <p className="text-xs font-semibold text-slate-50">{title}</p>
                        <p className="text-[10px] font-medium text-slate-300">{subtitle}</p>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </Widget.Content>
    </Widget>
  )
})
