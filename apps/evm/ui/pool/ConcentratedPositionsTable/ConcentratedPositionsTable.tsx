'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkInternal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { Address } from '@sushiswap/wagmi'
import type { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import React, { FC } from 'react'
import { ChainId } from 'sushi/chain'

import { Manual, Smart } from './Tables'
import type { SteerPosition } from './Tables/Smart/useSteerPositions'

interface ConcentratedPositionsTableProps {
  chainId?: ChainId
  poolAddress?: Address
  onRowClick?(
    row: ConcentratedLiquidityPositionWithV3Pool | SteerPosition,
  ): void
  hideNewPositionButton?: boolean
}

export const ConcentratedPositionsTable: FC<ConcentratedPositionsTableProps> =
  ({ chainId, onRowClick, poolAddress, hideNewPositionButton = false }) => {
    return (
      <Card>
        <Tabs defaultValue="manual">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col gap-6 flex-wrap w-full">
                <span>My Positions</span>
                <div className="flex justify-between items-center w-full flex-wrap flex-row gap-2">
                  <TabsList className="!flex">
                    <TabsTrigger
                      testdata-id="manual-tab"
                      value="manual"
                      className="flex flex-1"
                    >
                      Manual
                    </TabsTrigger>
                    <TabsTrigger
                      testdata-id="smart-tab"
                      value="smart"
                      className="flex flex-1"
                    >
                      Smart
                    </TabsTrigger>
                  </TabsList>
                  {!hideNewPositionButton ? (
                    <div className="flex gap-2">
                      <HoverCard>
                        <HoverCardTrigger>
                          <LinkInternal
                            shallow={true}
                            href={`/pool/${chainId}:${poolAddress}/positions/create/manual`}
                          >
                            <Button
                              variant="outline"
                              icon={PlusIcon}
                              asChild
                              size="sm"
                            >
                              Manual position
                            </Button>
                          </LinkInternal>
                        </HoverCardTrigger>
                        <HoverCardContent className="!p-0">
                          <CardHeader>
                            <CardTitle>Manual</CardTitle>
                            <CardDescription>
                              Create a V3 position manually by setting the range
                              yourself.
                            </CardDescription>
                          </CardHeader>
                        </HoverCardContent>
                      </HoverCard>
                      <HoverCard>
                        <HoverCardTrigger>
                          <LinkInternal
                            shallow={true}
                            href={`/pool/${chainId}:${poolAddress}/smart`}
                          >
                            <Button icon={PlusIcon} asChild size="sm">
                              Smart position
                            </Button>
                          </LinkInternal>
                        </HoverCardTrigger>
                        <HoverCardContent className="!p-0 max-w-[320px]">
                          <CardHeader>
                            <CardTitle>Smart pool</CardTitle>
                            <CardDescription>
                              The Auto-Pool automates the rebalancing of
                              positions, and auto-compounds all associated fees
                              and rewards.
                            </CardDescription>
                          </CardHeader>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <TabsContent value="manual">
            <Manual
              poolAddress={poolAddress}
              chainId={chainId}
              onRowClick={onRowClick}
            />
          </TabsContent>
          <TabsContent value="smart">
            <Smart
              poolAddress={poolAddress}
              chainId={chainId}
              onRowClick={onRowClick}
            />
          </TabsContent>
        </Tabs>
      </Card>
    )
  }
