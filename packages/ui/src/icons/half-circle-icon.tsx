import type { IconComponent } from '../types'

export const HalfCircleIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.125 0a10.126 10.126 0 1 1 0 20.251 10.126 10.126 0 0 1 0-20.251Zm0 17.719V2.53a7.594 7.594 0 1 0 0 15.188Z"
        fill="currentColor"
      />
    </svg>
  )
}
