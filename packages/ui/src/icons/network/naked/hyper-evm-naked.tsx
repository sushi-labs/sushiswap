import type { NakedNetworkIconComponent } from '../../../types'

export const HyperEVMNaked: NakedNetworkIconComponent = ({
  circle,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 144 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {circle}
      <path
        d="M129.6 71.76c0 38.085-23.307 50.306-35.587 39.424-10.109-8.873-13.116-27.622-28.32-29.547-19.298-2.428-20.968 23.27-33.667 23.27-14.786 0-17.626-21.513-17.626-32.561 0-11.301 3.174-26.703 15.789-26.703 14.703 0 15.538 22.015 33.917 20.843C82.4 65.23 82.734 42.296 94.598 32.502c10.358-8.454 35.002.67 35.002 39.258"
        fill="#aef8e4"
      />
    </svg>
  )
}
