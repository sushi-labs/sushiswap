import { CheckboxSetting } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const ReduceOnly = () => {
  const {
    state: { reduceOnly },
    mutate: { setReduceOnly },
  } = useAssetState()

  return (
    <CheckboxSetting
      label="Reduce Only"
      value={reduceOnly}
      onChange={setReduceOnly}
    />
  )
}
