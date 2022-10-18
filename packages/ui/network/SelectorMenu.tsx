import { CheckIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { FC } from 'react'

import { classNames, Currency, Typography } from '..'
import { Select } from '../select'

export interface SelectorMenuProps {
  className?: string
  networks: ChainId[]
  selectedNetworks: ChainId[]
  onChange(selectedNetworks: ChainId[]): void
}

export const SelectorMenu: FC<SelectorMenuProps> = ({ networks, selectedNetworks, onChange }) => {
  const value = networks.length === selectedNetworks.length ? [] : selectedNetworks

  return (
    <Select
      value={value}
      onChange={(values: ChainId[]) => onChange(values.length === 0 ? networks : values)}
      button={
        <Select.Button className="ring-offset-slate-900 !bg-slate-700">
          <Typography variant="sm" weight={600} className="text-slate-200">
            Networks
          </Typography>
        </Select.Button>
      }
      multiple
    >
      <Select.Options className="w-fit">
        {networks.map((network) => (
          <Select.Option key={network} value={network} showArrow={false} on>
            <div className="grid grid-cols-[auto_26px] gap-3 items-center w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5">
                  <Currency.Icon disableLink currency={Native.onChain(network)} width={20} height={20} />
                </div>
                <Typography
                  variant="sm"
                  weight={600}
                  className={classNames(
                    selectedNetworks.includes(network) && selectedNetworks.length !== networks.length
                      ? 'text-slate-50'
                      : 'text-slate-400'
                  )}
                >
                  {chains[network].name}
                </Typography>
              </div>
              <div className="flex justify-end">
                {selectedNetworks.includes(network) && selectedNetworks.length !== networks.length ? (
                  <CheckIcon width={20} height={20} className="text-blue" />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Select.Option>
        ))}
      </Select.Options>
    </Select>
  )
}
