import { Popover } from '@headlessui/react'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { ChainId, chainName } from '@sushiswap/chain'
import { classNames, DEFAULT_INPUT_UNSTYLED, NetworkIcon, Typography } from '@sushiswap/ui'
import React, { FC, useState } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkSelectorNewProps {
  supportedNetworks?: ChainId[]
}

export const NetworkSelector: FC<NetworkSelectorNewProps> = ({ supportedNetworks = [] }) => {
  const [query, setQuery] = useState('')
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chain) return <></>

  const chainId = chain.id

  const panel = (
    <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-md shadow-black/[0.3] bg-slate-900 border border-slate-200/20">
      <div className="flex gap-2 items-center p-4 pb-3">
        <SearchIcon width={20} height={20} className="text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-full bg-transparent placeholder:font-medium text-base')}
          placeholder="Search networks"
        />
      </div>
      <div className="mx-4 border-b border-slate-200/10" />
      <div className="p-2 max-h-[300px] scroll">
        {supportedNetworks
          .filter((el) => (query ? chainName[el].toLowerCase().includes(query.toLowerCase()) : Boolean))
          .map((el) => (
            <div
              onClick={() => {
                switchNetwork && switchNetwork(el)
              }}
              key={el}
              className={classNames(
                'hover:bg-white/[0.08] px-1 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
              )}
            >
              <div className="flex items-center gap-2">
                <NetworkIcon type="naked" chainId={el} width={22} height={22} />
                <Typography variant="sm" weight={500} className="text-slate-50">
                  {chainName[el]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
                </Typography>
              </div>
              {chain?.id === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
            </div>
          ))}
      </div>
    </Popover.Panel>
  )

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button
              className={classNames(
                DEFAULT_INPUT_UNSTYLED,
                'flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white h-[38px] rounded-xl px-2 pl-3 !font-semibold !text-sm text-slate-200'
              )}
            >
              <NetworkIcon chainId={chainId} width={20} height={20} />
              <div className="hidden sm:block">
                {chainName?.[chainId]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
              </div>
              <ChevronDownIcon
                width={20}
                height={20}
                className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
              />
            </Popover.Button>
            {panel}
          </>
        )
      }}
    </Popover>
  )
}
