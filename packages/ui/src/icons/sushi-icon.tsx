import React from 'react'

import type { IconComponent } from '../types'

export const SUSHI_ICON_ASPECT_RATIO = 990 / 916

export const SushiIcon: IconComponent = (props) => {
  const id = React.useId()

  return <SushiIconBase gradientId={`sushi-${id}`} {...props} />
}

export interface SushiIconBaseProps extends React.ComponentProps<'svg'> {
  gradientId: string
}

export function SushiIconBase({ gradientId, ...props }: SushiIconBaseProps) {
  return (
    <svg
      viewBox="0 0 37 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M35.9106 21.9483L28.7563 31.9329C27.7146 33.3888 25.6829 34.0301 23.0955 33.8223C19.5007 33.5101 14.7253 31.6034 10.1585 28.3276C8.66926 27.2722 7.26236 26.1057 5.94986 24.838C3.52992 22.4919 1.75127 20.0511 0.798773 17.8747C-0.243003 15.4828 -0.277458 13.3682 0.764319 11.9122L7.93561 1.9276C8.97776 0.471641 10.992 -0.169618 13.5968 0.0382178C17.1916 0.33296 21.9496 2.25711 26.5335 5.51591C31.1007 8.7921 34.4524 12.6922 35.8761 15.9857C35.9991 16.2683 36.108 16.5467 36.2029 16.8211C36.9109 18.8681 36.8294 20.6643 35.9106 21.9483Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M34.764 16.4718C33.3921 13.3343 30.1794 9.64204 25.8037 6.52191C21.445 3.40179 16.913 1.54717 13.492 1.26981C11.4081 1.09636 9.7584 1.47801 8.9252 2.63923L8.89 2.70839C8.10867 3.86997 8.28242 5.51676 9.09858 7.38876C10.4704 10.5436 13.6828 14.2355 18.0419 17.3556C22.4001 20.4758 26.9325 22.3307 30.3531 22.6081C32.4022 22.7638 34.0175 22.3999 34.8681 21.3078L34.9203 21.2213C35.7539 20.0771 35.5802 18.3785 34.764 16.4718ZM28.3563 16.5413C27.9743 17.0783 27.193 17.2347 26.2379 17.1478C24.5185 17.0091 22.2612 16.0731 20.0732 14.5132C17.8851 12.953 16.2702 11.1154 15.593 9.53812C15.2111 8.65426 15.1069 7.87432 15.4889 7.33661C15.8712 6.79927 16.6526 6.64321 17.6247 6.71274C19.3263 6.8688 21.6014 7.78742 23.772 9.34766C25.96 10.9075 27.5749 12.7622 28.2522 14.3398C28.6515 15.2236 28.7556 16.0036 28.3563 16.5413V16.5413Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#EDF0F3"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="12.4508"
          y1="-0.409281"
          x2="24.1875"
          y2="34.2859"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" />
          <stop offset="0.044" stopColor="#49A1DB" />
          <stop offset="0.11841" stopColor="#7D8ACA" />
          <stop offset="0.21562" stopColor="#A279BD" />
          <stop offset="0.29605" stopColor="#BA6FB6" />
          <stop offset="0.37529" stopColor="#C26BB3" />
          <stop offset="0.46788" stopColor="#D563AD" />
          <stop offset="0.57967" stopColor="#E65BA7" />
          <stop offset="0.70861" stopColor="#F156A3" />
          <stop offset="0.82293" stopColor="#F853A1" />
          <stop offset="1" stopColor="#FA52A0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
