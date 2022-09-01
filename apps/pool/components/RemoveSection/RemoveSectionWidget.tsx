import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import {
  AppearOnMount,
  Button,
  classNames,
  Currency as UICurrency,
  DEFAULT_INPUT_UNSTYLED,
  Input,
  Typography,
} from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { useBalance, useTotalSupply } from '@sushiswap/wagmi'
import { FC, Fragment, ReactNode, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useTokenAmountDollarValues, useUnderlyingTokenBalanceFromPair } from '../../lib/hooks'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: ChainId
  percentage: string
  liquidityToken: Token
  token0: Type
  token1: Type
  reserve0: Amount<Token> | undefined
  reserve1: Amount<Token> | undefined
  setPercentage(percentage: string): void
  error?: string
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  isFarm,
  chainId,
  percentage,
  setPercentage,
  liquidityToken,
  token0,
  token1,
  reserve0,
  reserve1,
  children,
  error,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { data: balance } = useBalance({ chainId, account: address, currency: liquidityToken })
  const totalSupply = useTotalSupply(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0,
    reserve1,
    totalSupply,
    balance: balance?.[FundSource.WALLET],
  })

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId, amounts: underlying })

  return useMemo(
    () => (
      <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Transition
          show={Boolean(hover && !balance?.[FundSource.WALLET]?.greaterThan(ZERO) && address)}
          as={Fragment}
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
            <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
              No liquidity tokens found {isFarm && ', did you unstake?'}
            </Typography>
          </div>
        </Transition>
        <Widget id="removeLiquidity" maxWidth={400} className="bg-slate-800">
          <Widget.Content>
            <Disclosure defaultOpen={!isFarm}>
              {({ open }) => (
                <>
                  {isFarm && isMounted ? (
                    <Disclosure.Button className="w-full pr-4">
                      <div className="flex justify-between items-center">
                        <Widget.Header title="Remove Liquidity" className="!pb-3 " />
                        <div
                          className={classNames(
                            open ? 'rotate-180' : 'rotate-0',
                            'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                          )}
                        >
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            className="group-hover:text-slate-200 text-slate-300"
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                  ) : (
                    <Widget.Header title="Remove Liquidity" className="!pb-3" />
                  )}
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
                      <div className="flex flex-col gap-3 p-3">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-grow justify-between items-center">
                            <Input.Numeric
                              onUserInput={(val) => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                              value={percentage}
                              placeholder="100%"
                              variant="unstyled"
                              className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                              min="0"
                              type="number"
                              inputMode="numeric"
                            />
                            <Typography variant="h3" weight={500} className="text-slate-400">
                              SLP
                            </Typography>
                          </div>
                          <div className="flex gap-2">
                            <Button size="xs" onClick={() => setPercentage('25')}>
                              25%
                            </Button>
                            <Button size="xs" onClick={() => setPercentage('50')}>
                              50%
                            </Button>
                            <Button size="xs" onClick={() => setPercentage('75')}>
                              75%
                            </Button>
                            <Button size="xs" onClick={() => setPercentage('100')}>
                              MAX
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 pb-2 justify-between items-center">
                          <AppearOnMount show={Boolean(balance?.[FundSource.WALLET])}>
                            <Typography variant="sm" weight={500} className="text-slate-300 hover:text-slate-20">
                              {formatUSD((Number(value0) + Number(value1)) * (+percentage / 100))}
                            </Typography>
                          </AppearOnMount>
                          <AppearOnMount
                            className="col-span-2 flex justify-end"
                            show={Boolean(balance?.[FundSource.WALLET])}
                          >
                            <Typography
                              onClick={() => setPercentage('100')}
                              as="button"
                              variant="sm"
                              weight={500}
                              className="text-slate-300 hover:text-slate-200 truncate"
                            >
                              Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
                            </Typography>
                          </AppearOnMount>
                        </div>
                        <Transition
                          show={Boolean(+percentage > 0 && underlying0 && underlying1)}
                          unmount={false}
                          className="transition-[max-height] overflow-hidden"
                          enter="duration-300 ease-in-out"
                          enterFrom="transform max-h-0"
                          enterTo="transform max-h-[380px]"
                          leave="transition-[max-height] duration-250 ease-in-out"
                          leaveFrom="transform max-h-[380px]"
                          leaveTo="transform max-h-0"
                        >
                          <div className="py-3 pt-5 flex flex-col gap-3 border-t border-slate-200/5">
                            <Typography variant="sm" weight={400} className="text-slate-400 pb-1">
                              You&apos;ll receive
                            </Typography>

                            <div className="flex items-center justify-between">
                              <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                                {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                                <span className="text-slate-400">
                                  <span className="text-slate-50">{underlying0?.toSignificant(6)}</span>{' '}
                                  {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                                    ? Native.onChain(chainId).symbol
                                    : underlying0?.currency.symbol}
                                </span>
                              </Typography>
                              <Typography variant="xs" className="text-slate-400">
                                {formatUSD(Number(value0))}
                              </Typography>
                            </div>
                            <div className="flex items-center justify-between">
                              <Typography variant="sm" weight={500} className="flex gap-2 items-center text-slate-50">
                                {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                                <span className="text-slate-400">
                                  <span className="text-slate-50">{underlying1?.toSignificant(6)}</span>{' '}
                                  {Native.onChain(chainId).wrapped.address === token1.wrapped.address
                                    ? Native.onChain(chainId).symbol
                                    : underlying1?.currency.symbol}
                                </span>
                              </Typography>
                              <Typography variant="xs" className="text-slate-400">
                                {formatUSD(Number(value1))}
                              </Typography>
                            </div>
                          </div>
                        </Transition>
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
      </div>
    ),
    [
      address,
      balance,
      chainId,
      children,
      error,
      hover,
      isFarm,
      isMounted,
      percentage,
      setPercentage,
      token0,
      token1,
      underlying0,
      underlying1,
      value0,
      value1,
    ]
  )
}
