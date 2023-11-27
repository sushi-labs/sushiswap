'use client'

import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { CardContent } from '@sushiswap/ui'
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { useState } from 'react'
import { MOCK_DATA } from './bonds-market-page-header'

export const BondsWidget = () => {
  const [input0, onInput0] = useState('')
  const [input1, onInput1] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bond</CardTitle>
        <CardDescription>
          Acquire vested tokens at a discount using the widget below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Web3Input.Currency
            type="INPUT"
            className="border border-accent px-3 py-1.5 !rounded-xl"
            loading={false}
            value={input0}
            onChange={onInput0}
            currency={MOCK_DATA.bondAsset}
            chainId={MOCK_DATA.chainId}
          />
          <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
            <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
              <ArrowDownIcon
                width={16}
                height={16}
                className="text-muted-foreground"
              />
            </div>
          </div>
          <Web3Input.Currency
            type="OUTPUT"
            className="border border-accent px-3 py-1.5 !rounded-xl"
            value={input1}
            onChange={onInput1}
            currency={MOCK_DATA.payoutAsset}
            chainId={MOCK_DATA.chainId}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="default" fullWidth>
          Bond
        </Button>
      </CardFooter>
    </Card>
  )
}
