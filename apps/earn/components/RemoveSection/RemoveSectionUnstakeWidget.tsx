import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { classNames, DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui'
import { Widget, WidgetHeader, WidgetContent } from '@sushiswap/ui/future/components/widget'
import { useTotalSupply } from '@sushiswap/wagmi'
import { FC, Fragment, ReactNode, useMemo, useState } from 'react'
import { Currency } from '@sushiswap/ui/future/components/currency'

import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from '../../lib/hooks'
import { usePoolPositionStaked } from '../PoolPositionStakedProvider'
import { Button } from '@sushiswap/ui/future/components/button'

interface RemoveSectionUnstakeWidget {
  chainId: ChainId
  value: string
  setValue(value: string): void
  reserve0: Amount<Type> | null
  reserve1: Amount<Type> | null
  liquidityToken: Token
  children: ReactNode
}

export const RemoveSectionUnstakeWidget: FC<RemoveSectionUnstakeWidget> = ({
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
}) => {
  const [hover, setHover] = useState(false)
  const totalSupply = useTotalSupply(liquidityToken)
  const { balance } = usePoolPositionStaked()

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0,
    reserve1,
    totalSupply,
    balance: amount,
  })

  const [value0, value1] = useTokenAmountDollarValues({
    chainId,
    amounts: underlying,
  })

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean(hover && !balance?.greaterThan(ZERO))}
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <span className="text-xs font-semibold bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No staked tokens found
          </span>
        </div>
      </Transition>
      <Widget id="stakeLiquidity" maxWidth="sm" className="bg-white dark:bg-slate-800">
        <WidgetContent>
          <Disclosure defaultOpen={balance?.greaterThan(ZERO)}>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full pr-4" testdata-id="unstake-liquidity-header">
                  <div className="flex items-center justify-between">
                    <WidgetHeader title="Unstake Liquidity" className="!pb-3" />
                    <div
                      className={classNames(
                        open ? 'rotate-180' : 'rotate-0',
                        'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                      )}
                    >
                      <ChevronDownIcon
                        width={24}
                        height={24}
                        className="text-gray-700 hover:text-gray-800 dark:group-hover:text-slate-200 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </Disclosure.Button>
                <Transition
                  unmount={false}
                  className="transition-[max-height] overflow-hidden"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                >
                  <Disclosure.Panel unmount={false}>
                    <div className="text-sm px-3 pb-5 dark:text-slate-400 text-slate-600">
                      Unstake your liquidity tokens first if you mean to remove your liquidity position
                    </div>
                    <div className="flex flex-col gap-3 p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            onUserInput={setValue}
                            value={value}
                            placeholder="0"
                            variant="unstyled"
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setValue(balance?.divide(4)?.toExact() || '')}
                            testdata-id="unstake-25-button"
                          >
                            25%
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setValue(balance?.divide(2)?.toExact() || '')}
                            testdata-id="unstake-50-button"
                          >
                            50%
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setValue(balance?.toExact() || '')}
                            testdata-id="unstake-max-button"
                          >
                            MAX
                          </Button>
                        </div>
                        <div className="min-w-[56px] -mr-[10px]">
                          {reserve0 && reserve1 && (
                            <Currency.IconList iconHeight={28} iconWidth={28}>
                              <Currency.Icon currency={reserve0?.currency} />
                              <Currency.Icon currency={reserve1?.currency} />
                            </Currency.IconList>
                          )}
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-2 pb-2">
                        <span className="text-sm font-medium text-slate-300 hover:text-slate-20">
                          {formatUSD(value0 + value1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setValue(balance?.toExact() || '')}
                          className="!px-0"
                        >
                          Balance: {balance?.toSignificant(6)}
                        </Button>
                      </div>
                      {children}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </WidgetContent>
      </Widget>
    </div>
  )
}
