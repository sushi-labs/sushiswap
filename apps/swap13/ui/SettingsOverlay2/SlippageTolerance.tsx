import { useSetSlippageTolerance, useSlippageTolerance } from '@sushiswap/react-query'
import { FormInputNumeric } from '@sushiswap/ui13/components/form/FormInputNumeric'
import { WaterIcon } from '@sushiswap/ui13/components/icons/WaterIcon'
import { List } from '@sushiswap/ui13/components/list/List'
import { Tab } from '@sushiswap/ui13/components/tabs'
import React, { FC, useCallback } from 'react'

export const SlippageTolerance: FC = () => {
  const { data: slippageTolerance } = useSlippageTolerance()
  const { mutate: updateSlippageTolerance } = useSetSlippageTolerance()

  const onChange = useCallback(
    (value: number) => {
      if (value === 0) {
        updateSlippageTolerance({ value: 'AUTO' })
      }
    },
    [updateSlippageTolerance]
  )

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      title="Slippage tolerance"
      icon={WaterIcon}
      iconProps={{ width: 20, height: 20 }}
      subtitle={
        <div className="flex flex-col gap-4">
          <p>
            Slippage is the difference between the expected value of output from a trade and the actual value due to
            asset volatility and liquidity depth. If the actual slippage falls outside of the user-designated range, the
            transaction will revert.
          </p>
          <Tab.Group defaultIndex={slippageTolerance === 'AUTO' ? 0 : 1} onChange={onChange}>
            <Tab.List>
              <Tab>Auto</Tab>
              <Tab>Custom</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel />
              <Tab.Panel className="pb-1">
                <FormInputNumeric
                  className="bg-gray-100 dark:bg-slate-700"
                  label="Slippage percentage"
                  placeholder="1.0"
                  value={slippageTolerance === 'AUTO' ? '' : slippageTolerance}
                  onChange={(value) => updateSlippageTolerance({ value })}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      }
    />
  )
}
