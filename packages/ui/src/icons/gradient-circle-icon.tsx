import type { IconComponent } from '../types'

export const GradientCircleIcon: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="30"
        height="30"
        rx="15"
        fill="url(#paint0_linear_13084_19043)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_13084_19043"
          x1="-2.30769"
          y1="4.25715e-07"
          x2="35.0955"
          y2="9.13387"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
      </defs>
    </svg>
  )
}
