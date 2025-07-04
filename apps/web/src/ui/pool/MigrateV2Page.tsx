'use client'

import { RadioGroup } from '@headlessui/react'
import type { V2Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DialogProvider,
  FormSection,
  Separator,
  Toggle,
} from '@sushiswap/ui'
import React, { type FC, useState } from 'react'
import { isSushiSwapV4ChainId } from 'src/lib/pool/v4'
import { MigrateV3 } from './MigrateV3'
import { MigrateV4 } from './MigrateV4'

export const MigrateV2Page: FC<{ pool: V2Pool }> = ({ pool }) => {
  const [protocol, setProtocol] = useState<'SUSHISWAP_V3' | 'SUSHISWAP_V4'>(
    'SUSHISWAP_V3',
  )

  return (
    <DialogProvider>
      <Card>
        <CardHeader>
          <CardTitle>Migrate position</CardTitle>
          <CardDescription>
            Migrate your V2 position to a concentrated liquidity position to
            improve your capital efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormSection
            title="Protocol"
            description="Select whether to migrate your position to SushiSwap V3 or SushiSwap V4."
          >
            <RadioGroup
              value={protocol}
              onChange={setProtocol}
              className="grid grid-cols-2 gap-4"
            >
              <Toggle
                pressed={protocol === 'SUSHISWAP_V3'}
                onClick={() => setProtocol('SUSHISWAP_V3')}
                asChild
                testdata-id={`protocol-option-SUSHISWAP_V3`}
                className="!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <span className="flex flex-wrap items-center gap-2">
                        <span>SushiSwap V3</span>
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Concentrated liquidity and improved capital efficiency.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Toggle>
              <Toggle
                pressed={protocol === 'SUSHISWAP_V4'}
                onClick={() => setProtocol('SUSHISWAP_V4')}
                asChild
                testdata-id={`protocol-option-SUSHISWAP_V4`}
                className="!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
                disabled={!isSushiSwapV4ChainId(pool.chainId)}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <span className="flex flex-wrap items-center gap-2">
                        <span>SushiSwap V4</span>
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Customizable hooks and lower gas fees with improved
                      flexibility.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Toggle>
            </RadioGroup>
          </FormSection>
        </CardContent>
        <div className="pb-4">
          <Separator />
        </div>

        {protocol === 'SUSHISWAP_V4' ? (
          <MigrateV4 pool={pool} />
        ) : (
          <MigrateV3 pool={pool} />
        )}
      </Card>
    </DialogProvider>
  )
}
