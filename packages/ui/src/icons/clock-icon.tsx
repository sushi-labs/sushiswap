import type { IconComponent } from '../types'

export const ClockIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11ZM6.5 4C6.5 3.72386 6.27614 3.5 6 3.5C5.72386 3.5 5.5 3.72386 5.5 4V6C5.5 6.13261 5.55268 6.25979 5.64645 6.35355L6.89645 7.60355C7.09171 7.79882 7.40829 7.79882 7.60355 7.60355C7.79882 7.40829 7.79882 7.09171 7.60355 6.89645L6.5 5.79289V4Z"
        fill="currentColor"
      />
    </svg>
  )
}
