import type { IconProps } from '@sushiswap/ui'

type FavoriteIconProps = IconProps & { isSelected?: boolean }

export const FavoriteIcon = ({ isSelected, ...props }: FavoriteIconProps) => {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.82 0.996831C6.94607 0.734393 7.32216 0.734394 7.44823 0.996832L9.09797 4.43099C9.14871 4.53661 9.24979 4.60956 9.3666 4.62485L13.1645 5.12214C13.4547 5.16014 13.5709 5.51542 13.3586 5.71562L10.5803 8.33532C10.4949 8.41589 10.4563 8.53393 10.4777 8.649L11.1752 12.3905C11.2285 12.6764 10.9243 12.896 10.667 12.7573L7.30014 10.9422C7.19659 10.8864 7.07164 10.8864 6.96809 10.9422L3.60127 12.7573C3.34398 12.896 3.03972 12.6764 3.09303 12.3905L3.79051 8.649C3.81196 8.53393 3.77335 8.41589 3.6879 8.33532L0.909607 5.71562C0.697291 5.51542 0.813506 5.16014 1.10374 5.12214L4.90163 4.62485C5.01843 4.60956 5.11952 4.53661 5.17026 4.43099L6.82 0.996831Z"
        stroke={isSelected ? '#349BFE' : '#EDF0F3'}
        fill={isSelected ? '#349BFE' : 'transparent'}
        strokeOpacity="0.5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
