import { FC } from 'react'

export const BackgroundVector: FC<React.ComponentProps<'svg'>> = ({ ...rest }) => {
  return (
    <svg width="855" height="1059" viewBox="0 0 855 1059" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g opacity="0.8">
        <path
          d="M-82.783 1057.66L735.521 411.665C796.381 363.62 796.381 271.334 735.521 223.289L453.939 0.999877"
          stroke="url(#paint0_linear_226_645)"
        />
        <path
          d="M-155.971 985.306L570.681 411.665C631.541 363.62 631.541 271.334 570.681 223.289L289.099 0.999805"
          stroke="url(#paint1_linear_226_645)"
        />
        <path
          d="M-334.001 985.306L392.651 411.665C453.512 363.62 453.512 271.334 392.652 223.289L111.07 0.999805"
          stroke="url(#paint2_linear_226_645)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_226_645"
          x1="431.85"
          y1="985.306"
          x2="431.85"
          y2="0.998265"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6C7485" stopOpacity="0.29" />
          <stop offset="0.5" stopColor="#6C7485" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_226_645"
          x1="267.01"
          y1="985.306"
          x2="267.01"
          y2="0.999756"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6C7485" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#6C7485" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_226_645"
          x1="88.9811"
          y1="985.306"
          x2="88.9811"
          y2="0.999756"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6C7485" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#6C7485" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
          <stop offset="1" stopColor="#6C7485" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
