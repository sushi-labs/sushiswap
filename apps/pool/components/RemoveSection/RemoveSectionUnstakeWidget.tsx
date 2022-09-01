import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Button, classNames, Currency, DEFAULT_INPUT_UNSTYLED, Input, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Chef, useMasterChef, useTotalSupply } from '@sushiswap/wagmi'
import { FC, Fragment, ReactNode, useMemo } from 'react'

import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'

interface RemoveSectionUnstakeWidget {
  chefType: Chef
  farmId: number
  chainId: ChainId
  value: string
  setValue(value: string): void
  reserve0: Amount<Type>
  reserve1: Amount<Type>
  liquidityToken: Token
  children: ReactNode
  error?: string
}

export const RemoveSectionUnstakeWidget: FC<RemoveSectionUnstakeWidget> = ({
  chefType,
  farmId,
  chainId,
  value,
  setValue,
  liquidityToken,
  reserve1,
  reserve0,
  children,
  error,
}) => {
  const totalSupply = useTotalSupply(liquidityToken)
  const { balance } = useMasterChef({
    chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
  })

  const amount = useMemo(() => {
    return tryParseAmount(value, liquidityToken)
  }, [liquidityToken, value])

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0,
    reserve1,
    totalSupply,
    balance: amount,
  })

  const [value0, value1] = useTokenAmountDollarValues({ chainId, amounts: underlying })

  return useMemo(
    () => (
      <Widget id="stakeLiquidity" maxWidth={400} className="bg-slate-800">
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full pr-4">
                  <div className="flex justify-between items-center">
                    <Widget.Header title="Unstake Liquidity" className="!pb-3" />
                    <div
                      className={classNames(
                        open ? 'rotate-180' : 'rotate-0',
                        'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                      )}
                    >
                      <ChevronDownIcon width={24} height={24} className="group-hover:text-slate-200 text-slate-300" />
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
                    <Typography variant="sm" className="text-slate-400 px-3 pb-5">
                      Unstake your liquidity tokens first if you mean to remove your liquidity position
                    </Typography>
                    <div className="flex flex-col gap-3 p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-grow justify-between items-center">
                          <Input.Numeric
                            onUserInput={setValue}
                            value={value}
                            placeholder="0"
                            variant="unstyled"
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="xs" onClick={() => setValue(balance?.divide(4)?.toExact() || '')}>
                            25%
                          </Button>
                          <Button size="xs" onClick={() => setValue(balance?.divide(2)?.toExact() || '')}>
                            50%
                          </Button>
                          <Button size="xs" onClick={() => setValue(balance?.toExact() || '')}>
                            MAX
                          </Button>
                        </div>
                        <div className="min-w-[56px] -mr-[10px]">
                          <Currency.IconList iconHeight={28} iconWidth={28}>
                            <Currency.Icon currency={reserve0.currency} />
                            <Currency.Icon currency={reserve1.currency} />
                          </Currency.IconList>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 pb-2 justify-between items-center">
                        <Transition
                          appear
                          as={Fragment}
                          show={Boolean(balance)}
                          enter="transition duration-300 origin-center ease-out"
                          enterFrom="transform scale-90 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform opacity-100"
                          leaveTo="transform opacity-0"
                        >
                          <Typography variant="sm" weight={500} className="text-slate-300 hover:text-slate-20">
                            {formatUSD(Number(value0) + Number(value1))}
                          </Typography>
                        </Transition>
                        <Transition
                          appear
                          show={Boolean(balance)}
                          as={Fragment}
                          enter="transition duration-300 origin-center ease-out"
                          enterFrom="transform scale-90 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform opacity-100"
                          leaveTo="transform opacity-0"
                        >
                          <Typography
                            onClick={() => setValue(balance?.toExact() || '')}
                            as="button"
                            variant="sm"
                            weight={500}
                            className="col-span-2 justify-end flex text-slate-300 hover:text-slate-200 truncate"
                          >
                            Balance: {balance?.toSignificant(6)}
                          </Typography>
                        </Transition>
                      </div>
                      {children}
                      {error && (
                        <Typography variant="xs" className="text-center text-red mt-4" weight={500}>
                          {error}
                        </Typography>
                      )}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    ),
    [balance, children, error, reserve0.currency, reserve1.currency, setValue, value, value0, value1]
  )
}
