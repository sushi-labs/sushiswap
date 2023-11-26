import React, { FC, useCallback, useState } from 'react'
import { ContentBlock } from '../ContentBlock'
import { Collapsible, classNames } from '@sushiswap/ui'
import { useIsMounted } from '@sushiswap/hooks'
import { DEFAULT_INPUT_UNSTYLED, Input } from '@sushiswap/ui/future/components/input'
import { Button } from '@sushiswap/ui/future/components/button'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

interface SelectPricesWidget {
  showStartPrice?: boolean
  switchTokens?(): void
}

export const SelectPricesWidget: FC<SelectPricesWidget> = ({ showStartPrice = true, switchTokens }) => {
  const isMounted = useIsMounted()
  const [invert, setInvert] = useState(false)
  return <div className="flex flex-col gap-6"></div>
  // return (
  //   <ContentBlock
  //     title={
  //       <>
  //         Between which <span className="text-gray-900 dark:text-white">prices</span> do you want to provide liquidity?
  //       </>
  //     }
  //   >
  //     <Collapsible open={Boolean()}>
  //       <div className="p-6 font-medium bg-blue/10 text-blue rounded-xl">
  //         This pool must be initialized before you can add liquidity.{' '}
  //         {showStartPrice
  //           ? 'To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. '
  //           : ''}
  //         Gas fees will be higher than usual due to the initialization transaction.
  //       </div>
  //     </Collapsible>
  //     <div className="bg-white dark:bg-white/[0.02] rounded-xl flex flex-col gap-4 p-4">
  //       {isMounted && showStartPrice && (
  //         <div className="flex flex-col gap-3">
  //           {
  //             <div className="relative flex items-center w-full gap-3 pb-2">
  //               <Input.Text
  //                 hideCloseButton={true}
  //                 className="!bg-gray-100 dark:!bg-slate-800 !w-full pr-[120px]"
  //                 label="Start price"
  //                 value={''}
  //                 onChange={() => {}}
  //                 id="start-price-input"
  //                 caption="Your pool needs a starting price somewhere between the min. and max. price"
  //               />
  //               <div className="absolute top-0 flex items-center right-4 bottom-7">
  //                 <div className="text-xs font-medium text-gray-500 whitespace-nowrap dark:text-slate-400">''</div>
  //               </div>
  //             </div>
  //           }
  //           {}
  //         </div>
  //       )}
  //       <div className="flex flex-col gap-3">
  //         <div className="flex items-center justify-between gap-2">
  //           <div className="flex justify-end lg:hidden">
  //             {
  //               <div
  //                 onClick={() => setInvert((prev) => !prev)}
  //                 role="button"
  //                 className="text-xs flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
  //               >
  //                 <div className="flex items-baseline gap-1.5">
  //                   <span className="text-xs font-normal">$</span>
  //                 </div>
  //               </div>
  //             }
  //           </div>
  //           {switchTokens ? (
  //             <div className="flex gap-2 rounded-xl bg-gray-100 dark:bg-white/[0.02] p-1">
  //               <Button
  //                 onClick={switchTokens}
  //                 variant={'' ? 'outlined' : 'empty'}
  //                 color={'' ? 'blue' : 'default'}
  //                 size="xs"
  //               ></Button>
  //               <Button
  //                 onClick={switchTokens}
  //                 variant={'' ? 'empty' : 'outlined'}
  //                 color={'' ? 'default' : 'blue'}
  //                 size="xs"
  //               ></Button>
  //             </div>
  //           ) : (
  //             <div />
  //           )}
  //           {
  //             <Button size="xs" variant="empty" color="blue" onClick={() => {}}>
  //               Full Range
  //             </Button>
  //           }
  //         </div>
  //         <div className="flex gap-2">
  //           <PriceBlock
  //             id={'min-price'}
  //             label="Min Price"
  //             value={''}
  //             onUserInput={() => {}}
  //             decrement={() => {}}
  //             increment={() => {}}
  //             decrementDisabled={() => {}}
  //             incrementDisabled={() => {}}
  //           />
  //           <PriceBlock
  //             id={'max-price'}
  //             label="Max Price"
  //             value={''}
  //             onUserInput={() => {}}
  //             decrement={() => {}}
  //             increment={() => {}}
  //             decrementDisabled={() => {}}
  //             incrementDisabled={() => {}}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </ContentBlock>
  // )
}

interface PriceBlockProps {
  id?: string
  label: string
  value: string
  onUserInput(val: string): void
  locked?: boolean
  incrementDisabled?: boolean
  decrementDisabled?: boolean
  increment(): string
  decrement(): string
}

export const PriceBlock: FC<PriceBlockProps> = ({
  id,
  locked,
  label,
  value,
  onUserInput,
  incrementDisabled,
  increment,
  decrementDisabled,
  decrement,
}) => {
  const isMounted = useIsMounted()
  const [active, setActive] = useState(false)

  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])
  return (
    <div
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      className={classNames(
        active ? 'ring-2 ring-blue' : '',
        'flex flex-col gap-2 w-full bg-gray-100 dark:bg-white/[0.04] rounded-lg p-3'
      )}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Input.Numeric
            variant="unstyled"
            testdata-id={`${id}-input`}
            value={localValue}
            onUserInput={setLocalValue}
            disabled={locked}
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'without-ring !text-3xl !px-0 !pt-1 !pb-2 shadow-none')}
            tabIndex={0}
          />
          {isMounted && <p className="text-sm font-medium text-gray-500 dark:text-slate-500"></p>}
        </div>
        <div className="flex flex-col gap-2">
          <button
            disabled={incrementDisabled}
            onClick={handleIncrement}
            className={classNames(
              incrementDisabled ? 'opacity-40' : 'hover:bg-gray-300 dark:hover:bg-slate-600',
              'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full'
            )}
            tabIndex={-1}
          >
            <PlusIcon width={12} height={12} />
          </button>
          <button
            disabled={decrementDisabled}
            onClick={handleDecrement}
            className={classNames(
              decrementDisabled ? 'opacity-40' : 'hover:bg-gray-300 dark:hover:bg-slate-600',
              'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full'
            )}
            tabIndex={-1}
          >
            <MinusIcon width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
