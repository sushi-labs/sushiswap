'use client'

import { SearchIcon } from '@heroicons/react-v1/solid'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { NetworkSelector } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useState } from 'react'
import { Chain, ChainId } from 'sushi/chain'
import useSWR from 'swr'

import { TokenTable } from './components/TokenTable'
import { TOKENS_SUPPORTED_CHAIN_IDS } from './config'
import { Token, getTokens } from './lib'

const TokensPage: FC = () => {
  const [filter, setFilter] = useState<string>('')
  const [chainId, setChainId] = useState<
    (typeof TOKENS_SUPPORTED_CHAIN_IDS)[number]
  >(ChainId.ETHEREUM)
  const debouncedFilter = useDebounce(filter, 400)

  const { data: tokens } = useSWR<Token[]>(
    stringify(['tokens', debouncedFilter, chainId]),
    () => getTokens({ chainIds: [chainId], filter: debouncedFilter }),
  )

  // console.log(tokens)

  return (
    <div className="flex flex-col gap-10 md:gap-16">
      <section className="flex flex-col gap-6">
        <div className="flex justify-between gap-3">
          <div
            className={
              'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 pr-4 bg-slate-800 rounded-2xl h-12'
            }
          >
            <div
              className={
                'w-full sm:w-[240px] flex-grow pr-4 transform-all relative flex gap-2 items-center px-4 py-2.5 rounded-2xl'
              }
            >
              <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
                <SearchIcon
                  className="text-slate-500"
                  strokeWidth={2}
                  width={20}
                  height={20}
                />
              </div>
              <input
                placeholder="Search a token"
                className={classNames(
                  'p-0 bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate font-medium text-left text-base md:text-sm placeholder:font-normal font-medium',
                  'flex flex-grow !text-base placeholder:text-sm',
                )}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <NetworkSelector
          networks={TOKENS_SUPPORTED_CHAIN_IDS}
          selected={chainId}
          onSelect={setChainId}
        >
          <Button variant="secondary" className="!font-medium">
            <NetworkIcon chainId={chainId} width={20} height={20} />
            <div>{Chain.from(chainId)?.name}</div>
            <ChevronDownIcon width={24} height={24} />
          </Button>
        </NetworkSelector>

        <TokenTable tokens={tokens || []} />
      </section>
    </div>
  )
}

export default TokensPage
