import * as React from 'react'

import { IconComponent } from '../../../types'

export const FuseNaked: IconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="a"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={24}
      y={74}
      width={80}
      height={32}
    >
      <path d="M24.44 74.794h79.35v30.578H24.44V74.794Z" fill="#fff" />
    </mask>
    <g mask="url(#a)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64.038 90.357c-2.796 0-5.394-.591-7.515-1.71L33.686 76.593l-6.844 4.151c-3.252 1.972-3.196 4.996.127 6.75l31.586 16.67c1.534.809 3.495 1.208 5.483 1.208 2.32 0 4.675-.543 6.428-1.605l30.922-18.757c3.252-1.973 3.196-4.997-.127-6.75l-6.567-3.467-21.97 13.328c-2.377 1.44-5.462 2.235-8.686 2.235Z"
        fill="url(#b)"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m101.464 58.304-5.483-2.937-12.769 7.859-2.192 1.348-2.191 1.35-5.977 3.678c-2.384 1.468-5.478 2.276-8.71 2.276-2.803 0-5.408-.602-7.534-1.74l-6.849-3.668-2.266-1.212-2.267-1.214-12.618-6.759-5.76 3.546c-3.26 2.007-3.205 5.082.127 6.866l6.585 3.526 2.267 1.214 2.265 1.214 20.553 11.006c1.537.823 3.505 1.227 5.497 1.227 2.326 0 4.688-.55 6.444-1.631l19.76-12.162 2.192-1.349 2.191-1.349 6.862-4.222c3.261-2.007 3.204-5.083-.127-6.867Z"
      fill="url(#c)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m101.464 40.312-31.67-16.664c-1.538-.81-3.504-1.207-5.498-1.207-2.326 0-4.688.542-6.444 1.604l-31.003 18.75c-3.262 1.972-3.206 4.994.126 6.747l5.483 2.885 2.267 1.193 2.266 1.193 12.618 6.64 2.267 1.191 2.267 1.194 4.502 2.37c1.537.808 3.505 1.205 5.497 1.205 2.326 0 4.688-.542 6.444-1.604l3.71-2.243 2.192-1.326 2.19-1.325 12.77-7.722 2.191-1.325 2.191-1.326 5.761-3.483c3.261-1.972 3.204-4.994-.127-6.747Z"
      fill="url(#d)"
    />
    <defs>
      <linearGradient
        id="b"
        x1={64.115}
        y1={25.108}
        x2={64.115}
        y2={105.373}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3F9BA" />
        <stop offset={1} stopColor="#F6FB8C" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={64.219}
        y1={25.17}
        x2={64.219}
        y2={103.527}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B1FFBF" />
        <stop offset={1} stopColor="#FFF16D" />
      </linearGradient>
      <linearGradient
        id="d"
        x1={64.219}
        y1={22.441}
        x2={64.219}
        y2={103.752}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B3F9BA" />
        <stop offset={1} stopColor="#F6FB8C" />
      </linearGradient>
    </defs>
  </svg>
)
