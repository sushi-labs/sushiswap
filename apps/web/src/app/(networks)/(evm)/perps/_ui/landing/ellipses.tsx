import type { IconComponent } from '@sushiswap/ui'

export const Ellipses = () => {
  return (
    <>
      <EllipseMiddleTopLeft className="fixed z-[-1] top-12 -left-48 w-[30vw] h-[60vh] text-black dark:text-white/60" />
      <EllipiseUpperTopLeft className="fixed z-[-1] -top-32 -left-20 w-[40vw] h-[55vh] text-black dark:text-white/60" />
      <EllipseTopRight className="fixed z-[-1] -top-[150%] translate-y-[150%] -right-[30%] -translate-x-[30%] w-[40vw] h-[80vh] text-black dark:text-white/60" />
      <EllipseTopMiddle className="fixed z-[-1] -top-[20%] left-[20%] w-[35vw] h-[60vh] text-black dark:text-white/60" />
      <EllipseBottomMiddle className="fixed z-[-1]-bottom-[25%] translate-y-[25%] -translate-x-[35%] left-[35%] w-[40vw] h-[80vh] text-black dark:text-white/60" />
      <EllipseBottomRight className="fixed z-[-1] -bottom-[20%] translate-y-[20%] -right-[10%] translate-x-[10%] w-[30vw] h-[60vh] text-black dark:text-white/60" />
    </>
  )
}

const EllipseTopRight: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 1114 1257"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_12)">
        <ellipse
          cx="556.898"
          cy="628.266"
          rx="170.576"
          ry="498.863"
          transform="rotate(-38.0284 556.898 628.266)"
          fill="currentColor"
          fillOpacity="0.07"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_12"
          x="-9.15527e-05"
          y="3.05176e-05"
          width="1113.8"
          height="1256.53"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="110.7"
            result="effect1_foregroundBlur_1_12"
          />
        </filter>
      </defs>
    </svg>
  )
}

const EllipseBottomRight: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 885 991"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_65)">
        <ellipse
          cx="442.176"
          cy="495.016"
          rx="87.0264"
          ry="340.557"
          transform="rotate(-38.0284 442.176 495.016)"
          fill="currentColor"
          fillOpacity="0.07"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_65"
          x="-9.15527e-05"
          y="3.05176e-05"
          width="884.351"
          height="990.033"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="110.7"
            result="effect1_foregroundBlur_1_65"
          />
        </filter>
      </defs>
    </svg>
  )
}

const EllipseBottomMiddle: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 885 991"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_64)">
        <ellipse
          cx="442.176"
          cy="495.016"
          rx="87.0264"
          ry="340.557"
          transform="rotate(-38.0284 442.176 495.016)"
          fill="currentColor"
          fillOpacity="0.09"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_64"
          x="3.05176e-05"
          y="3.05176e-05"
          width="884.351"
          height="990.033"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="110.7"
            result="effect1_foregroundBlur_1_64"
          />
        </filter>
      </defs>
    </svg>
  )
}

const EllipseTopMiddle: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 1051 1057"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_10)">
        <path
          d="M614.463 440.947C775.989 604.642 865.906 777.824 815.3 827.76C764.693 877.696 675.826 647.8 514.3 484.105C352.775 320.409 179.758 284.902 230.364 234.966C280.971 185.031 452.938 277.251 614.463 440.947Z"
          fill="currentColor"
          fillOpacity="0.07"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_10"
          x="3.05176e-05"
          y="0"
          width="1050.8"
          height="1056.11"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="110.7"
            result="effect1_foregroundBlur_1_10"
          />
        </filter>
      </defs>
    </svg>
  )
}

const EllipiseUpperTopLeft: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 912 1054"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_11)">
        <ellipse
          cx="455.646"
          cy="526.914"
          rx="113.992"
          ry="457.101"
          transform="rotate(-38.0284 455.646 526.914)"
          fill="currentColor"
          fillOpacity="0.06"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_11"
          x="0"
          y="0"
          width="911.293"
          height="1053.83"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_1_11"
          />
        </filter>
      </defs>
    </svg>
  )
}

const EllipseMiddleTopLeft: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 875 985"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1_53)">
        <ellipse
          cx="437.026"
          cy="492.481"
          rx="62.9322"
          ry="340.557"
          transform="rotate(-38.0284 437.026 492.481)"
          fill="currentColor"
          fillOpacity="0.07"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1_53"
          x="0"
          y="3.05176e-05"
          width="874.053"
          height="984.962"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="110.7"
            result="effect1_foregroundBlur_1_53"
          />
        </filter>
      </defs>
    </svg>
  )
}
