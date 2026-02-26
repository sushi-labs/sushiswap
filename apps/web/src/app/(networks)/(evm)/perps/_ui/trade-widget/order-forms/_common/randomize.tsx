import { CheckboxSetting } from '~evm/perps/_ui/_common/checkbox-setting'
import { useAssetState } from '../../asset-state-provider'

export const Randomize = () => {
  const {
    state: { twapRandomize },
    mutate: { setTwapRandomize },
  } = useAssetState()

  return (
    <CheckboxSetting
      label="Randomize"
      value={twapRandomize}
      onChange={setTwapRandomize}
    />
  )
}
