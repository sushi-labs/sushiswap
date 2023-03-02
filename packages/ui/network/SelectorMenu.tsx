import { CheckIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { ChainId, chainName } from '@sushiswap/chain'
import { FC } from 'react'

import { classNames, NetworkIcon, Typography } from '..'
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
          <Typography variant="sm" weight={600} className="flex gap-2 items-center text-slate-200">
            {value.length === 0 ? (
              <>
                <CheckIcon width={20} height={20} className="text-green" /> All Networks
              </>
            ) : (
              <>
                <XCircleIcon
                  onClick={() => onChange(networks)}
                  width={20}
                  height={20}
                  className="hover:text-slate-400 text-slate-500"
                />{' '}
                {value.length} Selected
              </>
            )}
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
                  <NetworkIcon type="circle" chainId={network} width={20} height={20} />
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
                  {chainName[network]}
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
