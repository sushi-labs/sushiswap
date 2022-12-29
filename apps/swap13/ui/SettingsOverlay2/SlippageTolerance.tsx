import { QrCodeIcon } from '@heroicons/react/24/outline'
import { useSetSlippageTolerance } from '@sushiswap/react-query/src/hooks/settings/useSetSlippageTolerance'
import { useSlippageTolerance } from '@sushiswap/react-query/src/hooks/settings/useSlippageTolerance'
import { List } from '@sushiswap/ui13/components/list/List'
import Switch from '@sushiswap/ui13/components/Switch'
import React, { FC } from 'react'

interface SlippageToleranceProps {
  account?: string
}

export const SlippageTolerance: FC<SlippageToleranceProps> = ({ account }) => {
  const { data: slippageTolerance } = useSlippageTolerance({ account })
  const { mutate: updateSlippageTolerance } = useSetSlippageTolerance({ account })

  return (
    <List.Item
      className="!bg-transparent cursor-default"
      as="div"
      title="Slippage Tolerance"
      icon={QrCodeIcon}
      iconProps={{ width: 20, height: 20 }}
      subtitle={
        <>
          Slippage is the difference between the expected value of output from a trade and the actual value due to asset
          volatility and liquidity depth. If the actual slippage falls outside of the user-designated range, the
          transaction will revert.
        </>
      }
      value={
        <div className="flex items-center flex-col">
          <Switch
            checked={slippageTolerance ?? false}
            onChange={(checked) => updateSlippageTolerance({ value: checked })}
          />
        </div>
      }
    />
  )
}
