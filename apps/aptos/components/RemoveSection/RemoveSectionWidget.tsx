import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Disclosure, Transition } from '@headlessui/react'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { formatUSD } from '@sushiswap/format'
import { useIsMounted } from '@sushiswap/hooks'
import { AppearOnMount, DEFAULT_INPUT_UNSTYLED, Typography, Widget, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { Input } from '@sushiswap/ui/future/components/input'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Icon } from 'components/Icon'
import { FC, Fragment, ReactNode, useState } from 'react'
import { Token } from 'utils/tokenType'
import useStablePrice from 'utils/useStablePrice'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  percentage: string
  setPercentage(percentage: string): void
  children: ReactNode
  token0: Token
  token1: Token
  balance: number
  reserve0: string | undefined
  reserve1: string | undefined
  totalSupply: string | undefined
  token0MinMinimum: string
  token1MinMinimum: string
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  isFarm,
  percentage,
  setPercentage,
  children,
  token0,
  token1,
  balance,
  reserve0,
  reserve1,
  totalSupply,
  token0MinMinimum,
  token1MinMinimum,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { account } = useWallet()

  const token0Price = useStablePrice({ currency: token0 })
  const token1Price = useStablePrice({ currency: token1 })

  const positionPrice = reserve0 && reserve1 && token0Price && token1Price && totalSupply
                        ?
                          (Number(reserve0) * token0Price + Number(reserve1) * token1Price)
                            * (balance / Number(totalSupply))
                        :
                          undefined
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean(hover && (!(balance > 0) || !account?.address))}
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
            No liquidity tokens found
          </Typography>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth={400} className="bg-white dark:bg-slate-800">
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted ? (
                  <Widget.Header title="Remove Liquidity" className="!pb-3">
                    <div className="flex gap-3">
                      <SettingsOverlay
                        options={{
                          slippageTolerance: {
                            storageKey: 'removeLiquidity',
                            defaultValue: '0.5',
                            title: 'Remove Liquidity Slippage',
                          },
                        }}
                        modules={[SettingsModule.CustomTokens, SettingsModule.SlippageTolerance]}
                      >
                        {({ setOpen }) => (
                          <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                            <Cog8ToothIcon width={24} height={24} />
                          </Button>
                        )}
                      </SettingsOverlay>
                      <Disclosure.Button className="w-full pr-0.5">
                        <div className="flex items-center justify-between">
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
                    </div>
                  </Widget.Header>
                ) : (
                  <Widget.Header title="Remove Liquidity" className="!pb-3">
                    <div className="flex gap-3">
                      <SettingsOverlay
                        options={{
                          slippageTolerance: {
                            storageKey: 'removeLiquidity',
                            defaultValue: '0.5',
                            title: 'Remove Liquidity Slippage',
                          },
                        }}
                        modules={[SettingsModule.SlippageTolerance]}
                      >
                        {({ setOpen }) => (
                          <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                            <Cog8ToothIcon width={24} height={24} />
                          </Button>
                        )}
                      </SettingsOverlay>
                      {''}
                    </div>
                  </Widget.Header>
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
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            onUserInput={(val) => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                            value={percentage}
                            placeholder="100%"
                            variant="unstyled"
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="xs"
                            onClick={() => setPercentage('25')}
                            testdata-id="remove-liquidity-25-button"
                          >
                            25%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('50')}
                            testdata-id="remove-liquidity-50-button"
                          >
                            50%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('75')}
                            testdata-id="remove-liquidity-75-button"
                          >
                            75%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('100')}
                            testdata-id="remove-liquidity-max-button"
                          >
                            MAX
                          </Button>
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-3 pb-2">
                        <AppearOnMount show={true}>
                          <Typography variant="sm" weight={500} className="text-gray-900 dark:text-slate-300">
                            {positionPrice ? formatUSD(positionPrice) : <Skeleton.Text fontSize='text-sm' className='!w-10' />}
                          </Typography>
                        </AppearOnMount>
                        <AppearOnMount className="flex justify-end col-span-2" show={true}>
                          <Typography
                            onClick={() => setPercentage('100')}
                            as="button"
                            variant="sm"
                            weight={500}
                            className="text-gray-700 truncate hover:text-gray-800 dark:text-slate-300 dark:hover:text-slate-200"
                          >
                            Balance: {balance}
                          </Typography>
                        </AppearOnMount>
                      </div>
                      <Transition
                        show={Boolean(+percentage > 0)}
                        unmount={false}
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                      >
                        <div className="flex flex-col gap-3 py-3 pt-5 border-t border-slate-200/5">
                          <Typography variant="sm" weight={400} className="pb-1 text-gray-600 dark:text-slate-400">
                            You&apos;ll receive at least:
                          </Typography>
                          <div className="flex items-center justify-between">
                            <Typography
                              variant="sm"
                              weight={500}
                              className="flex items-center gap-2 text-gray-900 dark:text-slate-50"
                            >
                              {token0 && <Icon currency={token0} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">{token0MinMinimum}</span>{' '}
                                {token0.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-gray-600 dark:text-slate-400">
                              {
                                token0Price
                                  ? formatUSD(token0Price * Number(token0MinMinimum))
                                  : <Skeleton.Text fontSize='text-xs' className='!w-10' />
                              }
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between">
                            <Typography
                              variant="sm"
                              weight={500}
                              className="flex items-center gap-2 text-gray-900 dark:text-slate-50"
                            >
                              {token1 && <Icon currency={token1} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">{token1MinMinimum}</span>{' '}
                                {token1.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-gray-600 dark:text-slate-400">
                              {
                                token1Price
                                  ? formatUSD(token1Price * Number(token1MinMinimum))
                                  : <Skeleton.Text fontSize='text-xs' className='!w-10' />
                              }
                            </Typography>
                          </div>
                        </div>
                      </Transition>
                      {children}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    </div>
  )
}
