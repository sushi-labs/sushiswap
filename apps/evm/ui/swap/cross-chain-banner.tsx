'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { Switch } from '@sushiswap/ui/components/switch'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useCallback, useState, useTransition } from 'react'

export const CrossChainBanner: FC = () => {
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [checked, setChecked] = useState(pathname === '/swap/cross-chain')
  const { push } = useRouter()

  const handleChange = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        if (checked) push('/swap/cross-chain')
        else push('/swap')
      })
    },
    [push]
  )

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl">
      <div className="flex flex-col bg-gradient-to-r from-blue/[0.15] to-pink/[0.15] hover:from-blue/20 hover:to-pink/20 saturate-[2] dark:saturate-[1] p-6 rounded-xl">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col">
            <h1 className="flex gap-1.5 items-center font-semibold text-gray-900 dark:text-slate-50">
              <span className="flex gap-1.5 items-center bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text tracking-tighter">
                Cross Chain
              </span>
              <Explainer iconProps={{ className: 'text-gray-400' }}>
                <div className="flex flex-col gap-3">
                  <span className="text-gray-900 dark:text-slate-50 font-semibold">Cross-chain Swap</span>
                  <span className="text-gray-500 dark:text-slate-400">
                    Swap your funds on one network and swap them into a token on a different network
                  </span>
                  <a
                    target="_blank"
                    className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center font-medium"
                    href="https://www.sushi.com/academy/articles/sushi-xswap-a-crosschain-dex"
                    rel="noreferrer"
                  >
                    Learn more <ChevronRightIcon width={12} height={12} />
                  </a>
                </div>
              </Explainer>
            </h1>
            <span className="text-sm text-muted-foreground">Swap tokens from one network to another.</span>
          </div>
          <div className="flex justify-end flex-grow">
            <Switch checked={checked} onCheckedChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
