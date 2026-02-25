import { useCallback } from 'react'
import { ValueInput } from '~evm/perps/_ui/_common/value-input'
import { useAssetState } from '../../asset-state-provider'

export const ScaleTotalOrdersInput = () => {
  const {
    state: { totalOrders },
    mutate: { setTotalOrders },
  } = useAssetState()

  const handleTotalOrders = useCallback(
    (value: string) => {
      const _value = value.replaceAll('.', '')
      setTotalOrders(_value)
    },
    [setTotalOrders],
  )

  const handleTotalOrdersBlur = useCallback(() => {
    //min num of orders is 2, max is 100
    if (Number(totalOrders) < 2) {
      setTotalOrders('2')
    } else if (Number(totalOrders) > 100) {
      setTotalOrders('100')
    }
  }, [setTotalOrders, totalOrders])

  return (
    <ValueInput
      value={totalOrders}
      onChange={handleTotalOrders}
      onBlur={handleTotalOrdersBlur}
      label="Total Orders"
      maxDecimals={0}
      className="!py-0 text-sm !px-2"
    />
  )
}
