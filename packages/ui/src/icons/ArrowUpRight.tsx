import type { IconComponent } from '../types'

export const ArrowUpRight: IconComponent = (props) => {
  return (
    <svg
      {...props}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.4 1H7M7 1V4.6M7 1L1 7"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
