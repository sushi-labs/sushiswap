import { RadioGroup } from '@headlessui/react'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { SmartPoolChainId, VaultV1 } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardItem,
  CardTitle,
  Chip,
  Currency,
  FormSection,
  LinkExternal,
  SkeletonText,
  Toggle,
} from '@sushiswap/ui'
import { Dispatch, SetStateAction } from 'react'
import { useV3Pool } from 'src/lib/hooks'
import { Address } from 'sushi'
import { ChainKey } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { formatPercent, formatUSD } from 'sushi/format'
import { APRHoverCard } from './APRHoverCard'

interface SelectSmartPoolStrategyWidgetProps {
  chainId: SmartPoolChainId
  poolAddress: Address
  vaults: VaultV1[]
  vaultIndex: number
  setVaultIndex: Dispatch<SetStateAction<number>>
}

export const SelectSmartPoolStrategyWidget = ({
  chainId,
  poolAddress,
  vaults,
  vaultIndex,
  setVaultIndex,
}: SelectSmartPoolStrategyWidgetProps) => {
  const { data: pool } = useV3Pool({ chainId, address: poolAddress })

  return (
    <FormSection
      title="Strategy"
      description="Sushi has picked the strategy with the highest APR as the default option."
    >
      <RadioGroup
        value={vaultIndex}
        onChange={setVaultIndex}
        className="grid grid-cols-2 gap-4"
      >
        {vaults.map((vault, i) => (
          <RadioGroup.Option key={vault.id} value={i}>
            {({ checked }) => (
              <Toggle
                pressed={checked}
                asChild
                className="!h-full !w-full !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
              >
                <Card>
                  <div className="flex flex-col gap-2">
                    <CardHeader className="gap-2">
                      <CardTitle className="flex gap-1 items-start">
                        <span>{vault.strategy}</span>
                        <LinkExternal
                          href={`/${ChainKey[vault.chainId]}/pool/v3/${
                            vault.poolAddress
                          }/smart/${vault.address}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowUpRightIcon className="w-4 h-4" />
                        </LinkExternal>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Chip variant="pink">V3</Chip>
                        <Chip variant="secondary">{vault.feeTier * 100}%</Chip>
                        {pool?.isIncentivized ? (
                          <Chip variant="green">
                            <div className="flex items-center gap-1">
                              {pool.incentives
                                .filter(
                                  (incentive) => incentive.rewardPerDay > 0,
                                )
                                .map((incentive) => (
                                  <div>
                                    <Currency.Icon
                                      currency={
                                        new Token(incentive.rewardToken)
                                      }
                                      width={12}
                                      height={12}
                                    />
                                  </div>
                                ))}
                              <span className="text-[8px]">🧑‍🌾</span>
                            </div>
                          </Chip>
                        ) : null}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="!gap-2">
                      <CardItem title="TVL:" flex>
                        <span>{formatUSD(vault.reserveUSD)}</span>
                      </CardItem>
                      <CardItem title="APR(1d):" flex>
                        {pool ? (
                          <APRHoverCard pool={pool} smartPoolAPR={vault.apr1d}>
                            <span className="underline decoration-dotted underline-offset-2">
                              {formatPercent(vault.apr1d + pool.incentiveApr)}
                            </span>
                          </APRHoverCard>
                        ) : (
                          <SkeletonText />
                        )}
                      </CardItem>
                    </CardContent>
                  </div>
                </Card>
              </Toggle>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </FormSection>
  )
}
