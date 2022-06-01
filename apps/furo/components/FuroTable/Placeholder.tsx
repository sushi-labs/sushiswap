import React from 'react'

export const Placeholder = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg {...props} viewBox="0 0 540 383" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.08" filter="url(#filter0_f_92_2752)">
        <ellipse cx="270" cy="191.812" rx="170" ry="91" fill="#BFBFBF" />
      </g>
      <rect x="71" y="119.312" width="260" height="109" rx="7.5" fill="currentColor" className="text-slate-800" />
      <rect x="99.5" y="142.812" width="106" height="13" rx="2" fill="currentColor" className="text-slate-700" />
      <rect x="99.5" y="167.312" width="184" height="13" rx="2" fill="currentColor" className="text-slate-700" />
      <rect x="99.5" y="191.812" width="160" height="13" rx="2" fill="currentColor" className="text-slate-700" />
      <rect x="71" y="119.312" width="260" height="109" rx="7.5" stroke="#202231" />
      <g filter="url(#filter1_d_92_2752)">
        <rect x="217.5" y="173.812" width="261" height="110" rx="8" fill="currentColor" className="text-slate-800" />
        <rect x="246.5" y="197.812" width="106" height="13" rx="2" fill="currentColor" className="text-slate-700" />
        <rect x="246.5" y="222.312" width="184" height="13" rx="2" fill="currentColor" className="text-slate-700" />
        <rect x="246.5" y="246.812" width="160" height="13" rx="2" fill="currentColor" className="text-slate-700" />
      </g>
      <defs>
        <filter
          id="filter1_d_92_2752"
          x="211.5"
          y="170.812"
          width="273"
          height="122"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_92_2752" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
