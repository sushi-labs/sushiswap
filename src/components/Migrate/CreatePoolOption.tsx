import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Fee } from '@sushiswap/trident-sdk'
import Checkbox from 'app/components/Checkbox'
import { AvailablePoolConfig, deDupe } from 'app/components/Migrate/migrate-utils'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

interface OptionProps {
  selectedPoolConfig?: AvailablePoolConfig
  allPoolConfigs: AvailablePoolConfig[]
  onClick: (poolToCreate: AvailablePoolConfig) => void
}

function availableTwapsForFee(configs: AvailablePoolConfig[], fee: Fee) {
  return configs
    .filter((config) => config.fee === fee)
    .map((config) => config.twap)
    .filter(deDupe)
}

const setTwapOption = (
  configs: AvailablePoolConfig[],
  selected: AvailablePoolConfig,
  setter: OptionProps['onClick']
) => {
  const bools = availableTwapsForFee(configs, selected.fee)
  if (bools.length === 2) setter({ ...selected, twap: !selected.twap })
}

const setFeeTier = (
  enable: boolean,
  fee: Fee,
  currentlySetTwap: boolean,
  configs: AvailablePoolConfig[],
  setter: OptionProps['onClick']
) => {
  /* Like a radio button, cannot disable only choose other options */
  if (!enable) return
  const bools = availableTwapsForFee(configs, fee)
  if (bools.length === 2) setter({ fee, twap: currentlySetTwap })
  if (bools.length === 1) setter({ fee, twap: bools[0] })
}

export const CreatePoolOption: FC<OptionProps> = ({ selectedPoolConfig, allPoolConfigs, onClick: setFunc }) => {
  const { i18n } = useLingui()

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 bg-dark-800 rounded p-4 m-3',
        !selectedPoolConfig && 'hover:bg-dark-700 hover:cursor-pointer',
        selectedPoolConfig && 'border-2 border-blue p-3.5'
      )}
      onClick={() => !selectedPoolConfig && setFunc(allPoolConfigs[0])}
    >
      <div>
        {i18n._(t`Create Pool`)} {!selectedPoolConfig && '→'}
      </div>
      {selectedPoolConfig && (
        <>
          <div>{i18n._(t`Fee tier`)}</div>
          {allPoolConfigs
            .map((pool) => pool.fee)
            .filter(deDupe)
            .map((fee) => (
              <div className="flex items-center gap-2" key={fee}>
                <Checkbox
                  checked={fee == selectedPoolConfig.fee}
                  set={(enable) => {
                    setFeeTier(enable, fee, selectedPoolConfig.twap, allPoolConfigs, setFunc)
                  }}
                />
                <span className="text-xs">{fee / 100}%</span>
              </div>
            ))}
          <div>{i18n._(t`TWAP`)}</div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedPoolConfig.twap}
              set={() => setTwapOption(allPoolConfigs, selectedPoolConfig, setFunc)}
            />
            <span className="text-xs">{i18n._(t`Yes create an oracle`)}</span>
          </div>
        </>
      )}
    </div>
  )
}
