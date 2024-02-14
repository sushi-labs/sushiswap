import { RadioGroup } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  FormSection,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkInternal,
  Toggle,
} from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui/components/dots'
import { FeeAmount } from '@sushiswap/v3-sdk'
import React, { FC, memo, useMemo } from 'react'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { Type } from 'sushi/currency'

export const FEE_OPTIONS = [
  {
    value: FeeAmount.LOWEST,
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: FeeAmount.LOW,
    subtitle: 'Best for less volatile pairs.',
  },
  {
    value: FeeAmount.MEDIUM,
    subtitle: 'Best for most pairs.',
  },
  {
    value: FeeAmount.HIGH,
    subtitle: 'Best for volatile pairs.',
  },
]

interface SelectFeeConcentratedWidget {
  feeAmount: FeeAmount | undefined
  setFeeAmount: (fee: FeeAmount) => void
  token0: Type | undefined
  token1: Type | undefined
  title?: string
  disableIfNotExists?: boolean
}

export const SelectFeeConcentratedWidget: FC<SelectFeeConcentratedWidget> =
  memo(function SelectFeeWidget({
    feeAmount,
    setFeeAmount,
    token0,
    token1,
    disableIfNotExists = false,
  }) {
    const { data: pools, isLoading } = usePoolsByTokenPair(
      token0?.wrapped.id,
      token1?.wrapped.id,
    )

    const tvlDistribution = useMemo(() => {
      const tvlDistribution = new Map<
        typeof FEE_OPTIONS[number]['value'],
        number
      >()

      if (!pools) return tvlDistribution

      const totalTvl = pools?.reduce(
        (acc, pool) => acc + Number(pool.totalValueLockedUSD),
        0,
      )

      pools?.forEach((pool) => {
        if (
          !FEE_OPTIONS.find((option) => option.value === Number(pool.feeTier))
        )
          return

        const tvlShare = pool.totalValueLockedUSD / totalTvl
        if (Number.isNaN(tvlShare)) return
        tvlDistribution.set(Number(pool.feeTier), tvlShare)
      })

      return tvlDistribution
    }, [pools])

    return (
      <FormSection
        title="Fee tier"
        description="Some fee tiers work better than others depending on the volatility of your pair. Lower fee tiers generally work better when pairing stable coins. Higher fee tiers generally work better when pairing exotic coins."
      >
        <div className={!token0 || !token1 ? 'opacity-40' : ''}>
          <RadioGroup
            value={feeAmount}
            onChange={setFeeAmount}
            className="grid grid-cols-2 gap-4"
            disabled={!token0 || !token1}
          >
            {FEE_OPTIONS.map((option, i) =>
              disableIfNotExists && !tvlDistribution.get(option.value) ? (
                <HoverCard key={i} openDelay={0} closeDelay={0}>
                  <HoverCardTrigger>
                    <Card className="opacity-40">
                      <CardHeader>
                        <CardTitle>
                          <span className="flex items-center gap-2">
                            <span>{option.value / 10000}% Fees </span>
                            {tvlDistribution.get(option.value) && (
                              <Chip variant="secondary">
                                {isLoading ? (
                                  <Dots />
                                ) : (
                                  `${(
                                    tvlDistribution.get(option.value)! * 100
                                  )?.toFixed(0)}% Selected`
                                )}
                              </Chip>
                            )}
                          </span>
                        </CardTitle>
                        <CardDescription>{option.subtitle}</CardDescription>
                      </CardHeader>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="!p-0">
                    <CardHeader>
                      <CardTitle>Pool doesnt exist yet.</CardTitle>
                      <CardDescription>
                        A pool for this fee tier {`doesn't`} exist yet. <br />{' '}
                        Anyone can create a pool. Want to
                        <br />
                        create this pool first?
                      </CardDescription>
                    </CardHeader>
                    {token0 && token1 ? (
                      <CardFooter>
                        <Button
                          asChild
                          icon={ChevronRightIcon}
                          size="sm"
                          variant="secondary"
                        >
                          <LinkInternal
                            href={`/pool/add?chainId=${
                              token0.chainId
                            }&feeAmount=${option.value}&fromCurrency=${
                              token0.isNative
                                ? 'NATIVE'
                                : token0.wrapped.address
                            }&toCurrency=${
                              token1.isNative
                                ? 'NATIVE'
                                : token1.wrapped.address
                            }`}
                          >
                            Create Pool
                          </LinkInternal>
                        </Button>
                      </CardFooter>
                    ) : null}
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <Toggle
                  pressed={feeAmount === option.value}
                  onClick={() => setFeeAmount(option.value)}
                  asChild
                  key={i}
                  testdata-id={`fee-option-${option.value}`}
                  className="!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <span className="flex items-center gap-2">
                          <span>{option.value / 10000}% Fees </span>
                          {tvlDistribution.get(option.value) && (
                            <Chip variant="secondary">
                              {isLoading ? (
                                <Dots />
                              ) : (
                                `${(
                                  tvlDistribution.get(option.value)! * 100
                                )?.toFixed(0)}% Selected`
                              )}
                            </Chip>
                          )}
                        </span>
                      </CardTitle>
                      <CardDescription>{option.subtitle}</CardDescription>
                    </CardHeader>
                  </Card>
                </Toggle>
              ),
            )}
          </RadioGroup>
        </div>
      </FormSection>
    )
  })
