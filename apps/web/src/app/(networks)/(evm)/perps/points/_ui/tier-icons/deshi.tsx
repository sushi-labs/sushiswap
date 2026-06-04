import type { IconComponent } from '@sushiswap/ui'

export const DeshiIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 67 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_dn_0_1)">
        <rect
          x="3.3335"
          width="60"
          height="60"
          rx="30"
          fill="url(#paint0_linear_0_1)"
        />
      </g>
      <g filter="url(#filter1_iin_0_1)">
        <circle
          cx="33.3335"
          cy="30"
          r="28.5"
          stroke="url(#paint1_linear_0_1)"
          strokeWidth="3"
        />
      </g>
      <g filter="url(#filter2_di_0_1)">
        <path
          d="M44.7699 48H23.1338C23.2442 44.4796 24.1393 43.0948 28.0792 42.2993C28.9882 40.0614 29.8701 39.1635 32.4064 38.4988V30.8979C32.2423 29.8991 31.1701 28.9977 31.1701 28.9977C31.1701 28.9977 24.4732 30.0109 21.2793 27.7308C17.4537 24.9999 16.3335 16.6334 16.3335 16.6334C16.3335 16.6334 23.4179 15.7007 26.8428 17.5963L26.9044 17.6303C26.9044 17.6303 31.6667 20.2658 32.4063 23.297C32.7576 24.7368 32.4064 27.0974 32.4064 27.0974C32.4064 27.0974 32.643 28.5685 33.2609 28.9977C33.8789 29.4269 34.8791 25.8306 34.8791 25.8306C34.7243 22.927 36.1603 20.4263 38.5882 18.2297C42.0691 15.0804 50.3333 16.1252 50.3335 16.3294C50.3337 16.5336 49.6618 22.481 47.2426 25.1972L47.2415 25.1985C45.2032 27.487 44.1511 28.6683 42.0151 28.9977C39.8788 29.3271 37.9695 29.2227 37.3516 28.1601C36.7336 27.0974 39.1821 23.7131 42.2972 21.3967C39.8337 22.5444 38.4886 23.2614 36.7336 25.8306L34.2609 30.2645V38.4988C37.1291 38.8284 38.2493 39.6128 39.2063 42.2993C42.7457 43.0595 43.943 44.3487 44.7699 48Z"
          fill="url(#paint2_linear_0_1)"
        />
      </g>
      <defs>
        <filter
          id="filter0_dn_0_1"
          x="0.00016284"
          y="0"
          width="66.6667"
          height="66.6667"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3.33333" />
          <feGaussianBlur stdDeviation="1.66667" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_0_1"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="4.4444441795349121 4.4444441795349121"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="327"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.08)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect2_noise_0_1">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feBlend
            mode="normal"
            in="effect2_noise_0_1"
            in2="effect1_dropShadow_0_1"
            result="effect2_noise_0_1"
          />
        </filter>
        <filter
          id="filter1_iin_0_1"
          x="3.3335"
          y="-3"
          width="60"
          height="63"
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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.375" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.74 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_1" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_0_1"
            result="effect2_innerShadow_0_1"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="13.333331108093262 13.333331108093262"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="345"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="effect2_innerShadow_0_1"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect3_noise_0_1">
            <feMergeNode in="effect2_innerShadow_0_1" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <filter
          id="filter2_di_0_1"
          x="16.3335"
          y="16"
          width="34.1"
          height="32.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="0.1" dy="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_0_1"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_0_1"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.365" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_0_1" />
        </filter>
        <linearGradient
          id="paint0_linear_0_1"
          x1="3.3335"
          y1="0"
          x2="63.3335"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#78350F" />
          <stop offset="0.519231" stopColor="#D69A4A" />
          <stop offset="1" stopColor="#9A5D3A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_0_1"
          x1="12.7085"
          y1="9"
          x2="55.0835"
          y2="50.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#78350F" />
          <stop offset="0.5" stopColor="#D69A4A" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_0_1"
          x1="12.0063"
          y1="10.4245"
          x2="49.546"
          y2="55.1339"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#381705" />
          <stop offset="0.5" stopColor="#946C37" />
          <stop offset="1" stopColor="#552910" />
        </linearGradient>
      </defs>
    </svg>
  )
}
