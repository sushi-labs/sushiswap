import { useCallback } from 'react'
import { ValueInput } from '~evm/perps/_ui/_common/value-input'
import { useAssetState } from '../../asset-state-provider'

export const ScaleSizeSkewInput = () => {
  const {
    state: { sizeSkew },
    mutate: { setSizeSkew },
  } = useAssetState()

  const handleSizeSkewBlur = useCallback(() => {
    //min skew is 0.01, max is 100
    if (Number(sizeSkew) < 0.01) {
      setSizeSkew('0.01')
    } else if (Number(sizeSkew) > 100) {
      setSizeSkew('100')
    }
  }, [setSizeSkew, sizeSkew])

  return (
    <ValueInput
      value={sizeSkew}
      onChange={setSizeSkew}
      onBlur={handleSizeSkewBlur}
      label="Size Skew"
      maxDecimals={2}
      className="!py-0 text-sm !px-2"
    />
  )
}
