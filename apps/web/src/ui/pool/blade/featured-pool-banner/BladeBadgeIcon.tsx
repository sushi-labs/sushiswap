import type { SVGProps } from 'react'

export function BladeBadgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="25"
      height="16"
      viewBox="0 0 25 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="25" height="16" rx="8" fill="#D9D9D9" fill-opacity="0.2" />
      <path
        d="M18.7153 4.77734L17.2074 6.58712H4.58545L6.09335 4.77734H18.7153Z"
        fill="url(#paint0_linear_1153_1802)"
      />
      <path
        d="M20.9944 7.23828L19.4865 9.04805H4.58545L6.09335 7.23828H20.9944Z"
        fill="url(#paint1_linear_1153_1802)"
      />
      <path
        d="M9.62597 7.23828L6.30859 11.2254H17.6825L20.9998 7.23828H9.62597ZM16.2017 9.71654H9.88447L10.6656 8.76528H16.9931L16.2017 9.71654Z"
        fill="url(#paint2_linear_1153_1802)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1153_1802"
          x1="3.00807"
          y1="6.58712"
          x2="13.4459"
          y2="21.3145"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C3F1FB" />
          <stop offset="1" stop-color="#FFC9F1" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1153_1802"
          x1="2.75364"
          y1="9.04805"
          x2="12.5921"
          y2="25.1688"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C3F1FB" />
          <stop offset="1" stop-color="#FFC9F1" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1153_1802"
          x1="4.66854"
          y1="11.2254"
          x2="27.1557"
          y2="26.1992"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C3F1FB" />
          <stop offset="1" stop-color="#FFC9F1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
