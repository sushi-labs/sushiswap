import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react-v1/outline'
import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { Input } from '@sushiswap/ui/components/input'
import { Widget, WidgetContent, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useTotalSupply } from '@sushiswap/wagmi'
import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPool } from 'lib/hooks'
import { FC, ReactNode, useMemo } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'

interface AddSectionStakeWidgetProps {
  title?: string
  chainId: number
  value: string
  setValue(value: string): void
  reserve0: Amount<Type> | null
  reserve1: Amount<Type> | null
  liquidityToken: Token
  children: ReactNode
}

export const AddSectionStakeWidget: FC<AddSectionStakeWidgetProps> = ({
  title,
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
}) => {
  const { balance } = usePoolPosition()
  const totalSupply = useTotalSupply(liquidityToken)

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

  return useMemo(
    () => (
      <Widget id="stakeLiquidity" maxWidth="sm" className="bg-white dark:bg-slate-800">
        <WidgetContent>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full">
                  <div className="flex items-center justify-between">
                    <WidgetHeader title={title || '2. Stake Liquidity'} />
                    <IconButton
                      size="sm"
                      icon={ChevronDownIcon}
                      name="Select"
                      testdata-id="stake-liquidity-header-button"
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
                      Stake your liquidity tokens to receive incentive rewards on top of your pool fee rewards
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-grow gap-2">
                        <div className="flex items-center justify-between flex-1 flex-grow">
                          <Input.Numeric
                            id="stake-input"
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
                            variant={value === '25' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.[FundSource.WALLET]?.divide(4)?.toExact() || '')}
                            testId="stake-25"
                          >
                            25%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '50' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.[FundSource.WALLET]?.divide(2)?.toExact() || '')}
                            testId="stake-50"
                          >
                            50%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '75' ? 'default' : 'secondary'}
                            onClick={() =>
                              setValue(balance?.[FundSource.WALLET]?.divide(4).multiply(3)?.toExact() || '')
                            }
                            testId="stake-75"
                          >
                            75%
                          </Button>
                          <Button
                            size="xs"
                            variant={value === '100' ? 'default' : 'secondary'}
                            onClick={() => setValue(balance?.[FundSource.WALLET]?.toExact() || '')}
                            testId="stake-max"
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
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-slate-20">
                          {formatUSD(value0 + value1)}
                        </span>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="link"
                            testId="stake-balance"
                            onClick={() => setValue(balance?.[FundSource.WALLET]?.toExact() || '')}
                          >
                            Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
                          </Button>
                        </div>
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
    ),
    [balance, children, reserve0?.currency, reserve1?.currency, setValue, title, value, value0, value1]
  )
}
