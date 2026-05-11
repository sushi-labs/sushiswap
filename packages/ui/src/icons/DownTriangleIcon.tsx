import type { IconComponent } from '../types'

export const DownTriangleIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 6 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.00185 0C0.169706 0 -0.298391 0.957081 0.212499 1.61394L1.86429 3.73767C2.26464 4.25241 3.04263 4.25241 3.44299 3.73767L5.09478 1.61394C5.60567 0.957082 5.13757 0 4.30543 0H1.00185Z"
        fill="#EDF0F3"
        fillOpacity="0.35"
        style={{ mixBlendMode: 'plus-lighter' }}
      />
    </svg>
  )
}
