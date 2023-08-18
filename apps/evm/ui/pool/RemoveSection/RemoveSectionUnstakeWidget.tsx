import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { Input } from '@sushiswap/ui/components/input'
import { Widget, WidgetContent, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useTotalSupply } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { FC, Fragment, ReactNode, useMemo, useState } from 'react'

import { usePoolPositionStaked } from '../PoolPositionStakedProvider'

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
                <Disclosure.Button className="w-full">
                  <div className="flex items-center justify-between">
                    <WidgetHeader title="Unstake Liquidity" />
                    <IconButton
                      size="sm"
                      icon={ChevronDownIcon}
                      name="Select"
                      testdata-id="unstake-liquidity-header-button"
                    />
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
                    <div className="py-4 text-sm text-gray-600 dark:text-slate-400">
                      Unstake your liquidity tokens first if you mean to remove your liquidity position
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            id="remove-amount"
                            label="Amount"
                            onUserInput={setValue}
                            value={value}
                            placeholder="0"
                            variant="unstyled"
                            className={classNames(
                              'p-0 bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate font-medium text-left text-base md:text-sm placeholder:font-normal font-medium',
                              '!text-2xl'
                            )}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="xs"
                            variant={value === '50' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.divide(4)?.toExact() || '')}
                            testId="unstake-25"
                          >
                            25%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '50' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.divide(2)?.toExact() || '')}
                            testId="unstake-50"
                          >
                            50%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '75' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.divide(4).multiply(3)?.toExact() || '')}
                            testId="unstake-75"
                          >
                            75%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '100' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.toExact() || '')}
                            testId="unstake-max"
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
                        <Button variant="link" size="sm" onClick={() => setValue(balance?.toExact() || '')}>
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
