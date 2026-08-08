import type { IconComponent } from '../types'

export const SafeIcon: IconComponent = (props) => {
  const strokeWidth = 4

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.625 56.625L13 61.25H20L21.5 56.625"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.5 56.625L44 61.25H51L52.375 56.625"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="2.875"
        width="54"
        height="53.75"
        rx="4.125"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M52.25 14.375V11.75C52.25 10.645 51.355 9.75 50.25 9.75H13.875C12.77 9.75 11.875 10.645 11.875 11.75V47.875C11.875 48.98 12.77 49.875 13.875 49.875H50.25C51.355 49.875 52.25 48.98 52.25 47.875V45.25"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52.25 24.125V35.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <rect
        x="49.5"
        y="14.375"
        width="5.375"
        height="9.75"
        rx="1.75"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <rect
        x="49.5"
        y="35.5"
        width="5.375"
        height="9.75"
        rx="1.75"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="32"
        cy="29.75"
        r="13.125"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="32"
        cy="29.75"
        r="6.75"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M32 17.625V19.25"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M32 40.25V41.875"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M19.875 29.75H21.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M42.5 29.75H44.125"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M23.375 21.125L24.625 22.375"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M39.375 37.125L40.625 38.375"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M40.625 21.125L39.375 22.375"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M24.625 37.125L23.375 38.375"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
