import type { IconComponent } from '../types'

export const InfinityIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 6L7.61091 7.59099C8.5006 8.46967 9.94306 8.46967 10.8327 7.59099C11.7224 6.71231 11.7224 5.28769 10.8327 4.40901C9.94306 3.53033 8.5006 3.53033 7.61091 4.40901L6 6ZM6 6L4.38909 4.40901C3.4994 3.53033 2.05694 3.53033 1.16726 4.40901C0.277579 5.28769 0.277579 6.71231 1.16726 7.59099C2.05694 8.46967 3.4994 8.46967 4.38909 7.59099L6 6Z"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </svg>
  )
}
