import { useId } from 'react'
import type { IconComponent } from '../../../types'

export const KadenaCircle: IconComponent = (props) => {
  const id = useId() 

  const patternId = `pattern_${id}_kadena`
  const imageId = `image_${id}_kadena`

  
  return(
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <rect width="22" height="22" fill={`url(#${patternId})`} />
    <defs>
      <pattern
        id={`${patternId}`}
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref={`#${imageId}`}
          transform="translate(-0.00390625) scale(0.0078125)"
        />
      </pattern>
      <image
        id={`${imageId}`}
        width="129"
        height="128"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
)}
