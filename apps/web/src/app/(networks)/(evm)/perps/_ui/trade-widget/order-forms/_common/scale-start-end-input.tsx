import { useCallback } from 'react'
import { ValueInput } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const ScaleStartEndInput = () => {
  const {
    state: { scaleStartEnd },
    mutate: { setScaleStartEnd },
  } = useAssetState()

  const handleScaleStartChange = useCallback(
    (value: string) => {
      setScaleStartEnd({
        ...scaleStartEnd,
        start: value,
      })
    },
    [setScaleStartEnd, scaleStartEnd],
  )
  const handleScaleEndChange = useCallback(
    (value: string) => {
      setScaleStartEnd({
        ...scaleStartEnd,
        end: value,
      })
    },
    [setScaleStartEnd, scaleStartEnd],
  )

  return (
    <div className="flex flex-col gap-2">
      <ValueInput
        value={scaleStartEnd.start}
        onChange={handleScaleStartChange}
        label="Start (USDC)"
        maxDecimals={1}
        className="!py-0 text-sm !px-2"
      />
      <ValueInput
        value={scaleStartEnd.end}
        onChange={handleScaleEndChange}
        label="End (USDC)"
        maxDecimals={1}
        className="!py-0 text-sm !px-2"
      />
    </div>
  )
}
