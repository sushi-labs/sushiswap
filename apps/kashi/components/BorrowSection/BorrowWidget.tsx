import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { formatUSD } from '@sushiswap/format'
import { Button, classNames, Dialog, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Widget } from '@sushiswap/ui/widget'
import { Approve, usePrices, Web3Input } from '@sushiswap/wagmi'
import { getV2RouterContractConfig } from '@sushiswap/wagmi/hooks/useV2Router'
import { FC, useCallback, useState } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'
import { useCustomTokens } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'
import { useBorrowContext } from '../BorrowProvider'

interface BorrowWidget {
  pair: KashiPair
}

export const BorrowWidget: FC<BorrowWidget> = ({ pair }) => {
  const { collateralValue, setCollateralValue, setBorrowValue, borrowValue, collateralAsEntity, borrowAsEntity } =
    useBorrowContext()
  const tokenMap = useTokens(pair.chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const { collateral, asset } = useTokensFromKashiPair(pair)
  const [leverage, setLeverage] = useState<number>(0)
  const [review, setReview] = useState(false)
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const execute = useCallback(() => {}, [])

  return (
    <div className="flex flex-col">
      <Widget id="depositCollateral" maxWidth="md">
        <Widget.Content>
          <Widget.Header title="Deposit Collateral" />
          <Web3Input.Currency
            className="p-3"
            loading={false}
            value={collateralValue}
            onChange={setCollateralValue}
            currency={collateral}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={pair.chainId}
            tokenMap={tokenMap}
          />
        </Widget.Content>
        <Transition
          show={!!collateralValue}
          className="z-10"
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex items-center justify-center -mt-[11px] -mb-[11px]">
            <div className="group bg-slate-700 p-0.5 border border-slate-800/30 ring-1 ring-slate-200/10 transition-all rounded-full">
              <ChevronDownIcon width={16} height={16} className="text-slate-400" />
            </div>
          </div>
        </Transition>
        <Transition
          show={!!collateralValue}
          unmount={false}
          className="transition-[max-height] overflow-hidden border-t border-slate-200/10 bg-slate-800/30"
          enter="duration-300 ease-in-out"
          enterFrom="transform max-h-0"
          enterTo="transform max-h-[380px]"
          leave="transition-[max-height] duration-250 ease-in-out"
          leaveFrom="transform max-h-[380px]"
          leaveTo="transform max-h-0"
        >
          <Widget id="depositCollateral" maxWidth="md" className="shadow-none bg-transparent">
            <Widget.Content>
              <Widget.Header title={`Borrow ${asset.symbol}`} />
              <Web3Input.Currency
                className="p-3"
                loading={false}
                value={borrowValue}
                onChange={setBorrowValue}
                currency={asset}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={pair.chainId}
                tokenMap={tokenMap}
              />
              <div className="p-3 flex flex-col gap-3">
                <Disclosure>
                  {({ open }) => (
                    <div className="flex flex-col gap-2 rounded-xl bg-white bg-opacity-[0.08] px-4 py-2">
                      <Disclosure.Button className="flex justify-between items-center h-[28px]">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Leverage
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="sm" weight={600} className="text-slate-50">
                            {leverage === 0
                              ? '0.00x'
                              : leverage === 1
                              ? '0.50x'
                              : leverage === 2
                              ? '1.00x'
                              : leverage === 3
                              ? '1.5x'
                              : '2.0x'}
                          </Typography>
                          {leverage === 0 && (
                            <div className="bg-white bg-opacity-[0.12] rounded-xl px-3 py-1.5 text-xs font-bold">
                              None
                            </div>
                          )}
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            className={classNames(
                              open ? '!rotate-180' : '',
                              'rotate-0 transition-[transform] duration-300 ease-in-out delay-200 text-slate-300'
                            )}
                          />
                        </div>
                      </Disclosure.Button>
                      <Transition
                        show={open}
                        unmount={false}
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                      >
                        <Disclosure.Panel as="div" className="flex gap-2 justify-end">
                          <button
                            onClick={() => setLeverage(0)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm rounded-lg px-2 py-1"
                          >
                            0.0x
                          </button>
                          <button
                            onClick={() => setLeverage(1)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm rounded-lg px-2 py-1"
                          >
                            0.5x
                          </button>
                          <button
                            onClick={() => setLeverage(2)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            1.0x
                          </button>
                          <button
                            onClick={() => setLeverage(3)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            1.5x
                          </button>
                          <button
                            onClick={() => setLeverage(4)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            2.0x
                          </button>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                <Button
                  color="blue"
                  fullWidth
                  disabled={!collateralValue || !borrowValue}
                  onClick={() => setReview(true)}
                >
                  {!collateralValue || !borrowValue ? 'Enter Amount' : 'Review'}
                </Button>
              </div>
            </Widget.Content>
          </Widget>
        </Transition>
      </Widget>
      <Dialog open={review} onClose={() => setReview(false)}>
        <Dialog.Content className="max-w-sm !pb-4">
          <Dialog.Header border={false} title="Confirm Borrow" onClose={() => setReview(false)} />
          <div className="!my-0 grid grid-cols-12 items-center">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <Typography variant="sm" weight={500} className="text-slate-300">
                Deposit
              </Typography>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {collateralAsEntity?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {collateralAsEntity && (
                      <div className="w-5 h-5">
                        <Icon currency={collateralAsEntity.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {collateralAsEntity?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {collateralAsEntity && prices?.[collateral.wrapped.address]
                  ? formatUSD(collateralAsEntity?.multiply(prices?.[collateral.wrapped.address].asFraction).toFixed(2))
                  : '-'}
              </Typography>
            </div>
            <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
              <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                <ChevronDownIcon width={18} height={18} className="text-slate-200" />
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <Typography variant="sm" weight={500} className="text-slate-300">
                Borrow
              </Typography>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {borrowAsEntity?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {borrowAsEntity && (
                      <div className="w-5 h-5">
                        <Icon currency={borrowAsEntity.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {borrowAsEntity?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {borrowAsEntity && prices?.[asset.wrapped.address]
                  ? formatUSD(borrowAsEntity?.multiply(prices?.[asset.wrapped.address].asFraction).toFixed(2))
                  : '-'}
              </Typography>
            </div>
          </div>
          <Approve
            className="flex-grow !justify-end mt-3"
            components={
              <Approve.Components>
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={collateralAsEntity}
                  address={getV2RouterContractConfig(pair.chainId).addressOrName}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                  Confirm Borrow
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </div>
  )
}
