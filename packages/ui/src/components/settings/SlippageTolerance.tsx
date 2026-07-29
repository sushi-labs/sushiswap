import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import {
  type SlippageToleranceStorageKey,
  normalizeSlippageTolerance,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { type FC, useCallback, useEffect, useState } from 'react'

import { DEFAULT_SLIPPAGE } from 'sushi/evm'
import { Collapsible } from '../animation'
import { CardDescription, CardHeader, CardTitle } from '../card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPrimitive,
  HoverCardTrigger,
} from '../hover-card'
import { Label } from '../label'
import { Separator } from '../separator'
import { Switch } from '../switch'
import { TextField } from '../text-field'
import { Toggle } from '../toggle'
import { typographyVariants } from '../typography'

const TABS = ['0.1', '0.5', '1.0']

export const SlippageTolerance: FC<{
  options?: {
    storageKey?: SlippageToleranceStorageKey
    defaultValue?: string
    title?: string
  }
  className?: string
  showAutoSelector?: boolean
  theme?: 'default' | 'perps'
}> = ({ options, className, showAutoSelector = true, theme = 'default' }) => {
  const isPerps = theme === 'perps'
  const defaultSlippage = options?.defaultValue ?? DEFAULT_SLIPPAGE
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(
    options?.storageKey,
    options?.defaultValue,
  )
  const [customValue, setCustomValue] = useState(
    slippageTolerance === 'AUTO' ? defaultSlippage : slippageTolerance,
  )

  useEffect(() => {
    if (slippageTolerance !== 'AUTO') {
      setCustomValue(slippageTolerance)
    }
  }, [slippageTolerance])

  const onChange = useCallback(
    (value: string) => {
      setCustomValue(value)
      const validValue = normalizeSlippageTolerance(value)
      if (validValue) {
        setSlippageTolerance(validValue)
      }
    },
    [setSlippageTolerance],
  )

  const isDangerous =
    (!Number.isNaN(+slippageTolerance) && +slippageTolerance >= 5) ||
    (!Number.isNaN(+slippageTolerance) &&
      +slippageTolerance <= 0.05 &&
      +slippageTolerance > 0)

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <div className={classNames(className, 'p-4 rounded-lg')}>
        {showAutoSelector ? (
          <>
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label className={classNames(isPerps && 'text-perps-muted')}>
                  Automatic Slippage Tolerance
                </Label>
                <span
                  className={typographyVariants({
                    variant: 'muted',
                    className: classNames(
                      'text-sm',
                      isPerps && '!text-perps-muted-50',
                    ),
                  })}
                >
                  Turn off automatic slippage tolerance <br /> to adjust the
                  value.
                </span>
              </div>
              <Switch
                checked={slippageTolerance === 'AUTO'}
                onCheckedChange={(checked) =>
                  setSlippageTolerance(checked ? 'AUTO' : defaultSlippage)
                }
                className={classNames(
                  isPerps &&
                    'data-[state=checked]:!bg-perps-blue data-[state=unchecked]:!bg-white/[0.08] focus-visible:!ring-perps-blue',
                )}
                thumbClassName={classNames(
                  isPerps && 'data-[state=unchecked]:!bg-perps-muted-50',
                )}
              />
            </div>
            <div
              className={classNames(
                'my-4 h-px w-full dark:bg-slate-200/5 bg-gray-900/5',
                isPerps && '!bg-white/[0.06]',
              )}
            />
          </>
        ) : null}
        <div className="flex justify-between gap-[60px]">
          <div className="flex flex-col gap-2">
            <Label
              className={classNames(
                'flex items-center gap-1',
                isPerps && 'text-perps-muted',
              )}
            >
              {options?.title || 'Slippage'}{' '}
              <HoverCardTrigger>
                <InformationCircleIcon width={16} height={16} />
              </HoverCardTrigger>
              <HoverCardPrimitive.Portal>
                <HoverCardContent
                  className={classNames(
                    '!p-0 max-w-[320px] z-[1080]',
                    isPerps &&
                      '!border-white/[0.07] !bg-perps-background/95 !text-perps-muted backdrop-blur-2xl',
                  )}
                >
                  <CardHeader>
                    <CardTitle>Slippage</CardTitle>
                    <CardDescription
                      className={classNames(
                        'prose',
                        isPerps && '!text-perps-muted-50',
                      )}
                    >
                      <p>
                        Slippage is the difference between the expected value of
                        output from a trade and the actual value due to asset
                        volatility and liquidity depth. If the actual slippage
                        falls outside of the user-designated range, the
                        transaction will revert.
                      </p>
                      <a
                        className="text-blue hover:underline"
                        target="_blank"
                        href="https://www.sushi.com/academy/articles/what-is-slippage-price-impact"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </CardDescription>
                  </CardHeader>
                </HoverCardContent>
              </HoverCardPrimitive.Portal>
            </Label>
            <span className="text-sm text-red mb-2">
              {+slippageTolerance <= 0.05 && +slippageTolerance >= 0
                ? 'Your transaction may be reverted due to low slippage tolerance'
                : isDangerous
                  ? 'Your transaction may be frontrun due to high slippage tolerance'
                  : undefined}
            </span>
          </div>
          <span
            className={classNames(
              isDangerous ? '!text-red' : 'dark:text-slate-400 text-gray-600',
              isPerps && !isDangerous && '!text-perps-muted-50',
              'text-sm font-semibold',
            )}
          >
            {slippageTolerance === 'AUTO'
              ? `${DEFAULT_SLIPPAGE}%`
              : `${slippageTolerance}%`}
          </span>
        </div>
        <Collapsible open={slippageTolerance !== 'AUTO'}>
          <div
            className={classNames(
              'flex gap-1 items-center border border-accent rounded-xl bg-secondary p-0.5',
              isPerps && '!border-white/[0.06] !bg-white/[0.04]',
            )}
          >
            <RadioGroup value={slippageTolerance} onChange={onChange}>
              <div className="flex gap-1 items-center">
                {TABS.map((tab, i) => (
                  <RadioGroup.Option
                    className={classNames(
                      'h-[40px]',
                      isPerps &&
                        '!text-perps-muted-50 hover:!bg-white/[0.05] data-[state=on]:!bg-perps-blue/15 data-[state=on]:!text-perps-blue',
                    )}
                    key={i}
                    value={tab}
                    as={Toggle}
                    size="sm"
                    pressed={slippageTolerance === tab}
                  >
                    {tab}%
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>

            <Separator
              orientation="vertical"
              className={classNames(
                'min-h-[36px]',
                isPerps && '!bg-white/[0.06]',
              )}
            />
            <TextField
              type="number"
              value={customValue}
              onValueChange={onChange}
              onBlur={() => {
                if (!normalizeSlippageTolerance(customValue)) {
                  setCustomValue(
                    slippageTolerance === 'AUTO'
                      ? DEFAULT_SLIPPAGE
                      : slippageTolerance,
                  )
                }
              }}
              isError={Boolean(
                customValue && !normalizeSlippageTolerance(customValue),
              )}
              placeholder="Custom"
              id="slippage-tolerance"
              maxDecimals={2}
              unit="%"
              className={classNames(
                isPerps &&
                  '!bg-transparent !text-perps-muted placeholder:!text-perps-muted-50',
              )}
              wrapperClassName={classNames(
                isPerps &&
                  '[&>div]:!bg-transparent [&>div]:!text-perps-muted-50',
              )}
            />
          </div>
        </Collapsible>
      </div>
    </HoverCard>
  )
}
