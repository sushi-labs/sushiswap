import type { SVGProps } from 'react'

export const TabCheckIcon = (
  props: SVGProps<SVGSVGElement> & { color?: string },
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="url(#a)"
      fillRule="evenodd"
      d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm9.43 4.28 5.757-7.197-1.04-.832-4.91 6.134L5.76 9.488l-.853 1.024 4.522 3.768Z"
      clipRule="evenodd"
    />
    <path
      fill={props.color ?? '#1AC87F'}
      fillRule="evenodd"
      d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm9.43 4.28 5.757-7.197-1.04-.832-4.91 6.134L5.76 9.488l-.853 1.024 4.522 3.768Z"
      clipRule="evenodd"
    />
    <defs>
      <linearGradient
        id="a"
        x1={-2.333}
        x2={42.364}
        y1={28.109}
        y2={32.617}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B0F1FF" />
        <stop offset={1} stopColor="#FA65D4" />
      </linearGradient>
    </defs>
  </svg>
)
