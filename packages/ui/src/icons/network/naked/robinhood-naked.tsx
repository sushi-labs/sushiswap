import type { NakedNetworkIconComponent } from '../../../types'

export const RobinhoodNaked: NakedNetworkIconComponent = ({
  circle,
  ...props
}) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      width="128"
      height="128"
      rx={circle ? '64' : undefined}
      fill="#CCFF00"
    />
    <path
      fill="#000"
      d="M59.392 42.496L65.024 35.84C69.12 31.232 70.656 29.184 78.336 29.184H86.528C91.648 29.184 93.184 31.744 93.184 38.4C93.184 42.496 92.672 45.568 91.136 49.152L79.872 64.512L79.36 43.52L78.336 42.496H59.392ZM55.808 46.08H72.704L66.56 52.736L54.272 69.632L41.984 92.672L37.888 103.936H34.816L42.496 80.896L43.008 61.952L55.808 46.08ZM74.752 49.664H75.776V70.144L70.656 78.848L66.56 83.968L48.64 89.088L57.344 72.704L74.752 49.664Z"
    />
  </svg>
)
