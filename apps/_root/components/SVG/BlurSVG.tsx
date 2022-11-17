import React from 'react'

export const BlurSVG = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 309 309">
      <g filter="url(#filter0_f_1529_1918)">
        <circle cx="154.5" cy="154.5" r="114.5" fill="url(#paint0_radial_1529_1918)" fillOpacity="0.8"></circle>
      </g>
      <defs>
        <filter
          id="filter0_f_1529_1918"
          width="309"
          height="309"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_1529_1918" stdDeviation="20"></feGaussianBlur>
        </filter>
        <radialGradient
          id="paint0_radial_1529_1918"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(90 0 154.5) scale(114.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE5A75"></stop>
          <stop offset="0.504" stopColor="#FEAC68"></stop>
          <stop offset="0.792" stopColor="#FEAC68" stopOpacity="0.21"></stop>
          <stop offset="1" stopColor="#FEAC68" stopOpacity="0"></stop>
        </radialGradient>
      </defs>
    </svg>
  )
}
