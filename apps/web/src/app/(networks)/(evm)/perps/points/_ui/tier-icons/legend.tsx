import type { IconComponent } from '@sushiswap/ui'

export const LegendIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 67 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_dn_2465_21635)">
        <g clipPath="url(#clip0_2465_21635)">
          <rect
            x="3.33398"
            width="60"
            height="60"
            rx="30"
            fill="url(#paint0_linear_2465_21635)"
          />
          <g filter="url(#filter1_iin_2465_21635)">
            <circle
              cx="33.334"
              cy="30"
              r="28.5"
              stroke="url(#paint1_linear_2465_21635)"
              strokeWidth="3"
            />
          </g>
          <g clipPath="url(#clip1_2465_21635)">
            <g filter="url(#filter2_d_2465_21635)">
              <path
                d="M41.4537 38.4914L51.0726 34.1489L44.1554 31.0692C40.8903 29.6155 39.4219 25.7921 40.876 22.5261L41.9101 20.1466L37.1633 11.4357L34.0836 18.3528C32.6298 21.618 28.8068 23.0863 25.5407 21.6322L24.8287 21.3407L15.5976 25.8559L22.5149 28.9356C25.7801 30.3894 27.2482 34.2125 25.7941 37.4786L25.1644 38.95L29.5068 48.5687L32.5863 41.652C34.0401 38.3868 37.8633 36.9185 41.1293 38.3727L41.4537 38.4914ZM31.7251 33.6186C29.7274 32.7291 28.8298 30.3895 29.7189 28.3926C30.6084 26.3949 32.9477 25.4968 34.9451 26.3861C36.9427 27.2755 37.8407 29.615 36.9513 31.6126C36.0622 33.6096 33.7224 34.5079 31.725 33.6185L31.7251 33.6186Z"
                fill="url(#paint2_linear_2465_21635)"
              />
            </g>
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dn_2465_21635"
          x="0.000651121"
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
            result="effect1_dropShadow_2465_21635"
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
          <feMerge result="effect2_noise_2465_21635">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feBlend
            mode="normal"
            in="effect2_noise_2465_21635"
            in2="effect1_dropShadow_2465_21635"
            result="effect2_noise_2465_21635"
          />
        </filter>
        <filter
          id="filter1_iin_2465_21635"
          x="3.33398"
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
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_2465_21635"
          />
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
            in2="effect1_innerShadow_2465_21635"
            result="effect2_innerShadow_2465_21635"
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
            in2="effect2_innerShadow_2465_21635"
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
          <feMerge result="effect3_noise_2465_21635">
            <feMergeNode in="effect2_innerShadow_2465_21635" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <filter
          id="filter2_d_2465_21635"
          x="15.5977"
          y="11.4355"
          width="35.4746"
          height="37.8006"
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
          <feOffset dy="0.66733" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2465_21635"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2465_21635"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2465_21635"
          x1="3.33398"
          y1="0"
          x2="63.334"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E0F2FE" />
          <stop offset="0.519231" stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2465_21635"
          x1="12.709"
          y1="9"
          x2="55.084"
          y2="50.625"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2465_21635"
          x1="24.9744"
          y1="5.75566"
          x2="41.6958"
          y2="54.2494"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <clipPath id="clip0_2465_21635">
          <rect x="3.33398" width="60" height="60" rx="30" fill="white" />
        </clipPath>
        <clipPath id="clip1_2465_21635">
          <rect
            width="40"
            height="40"
            fill="white"
            transform="translate(23.1992 3.5957) rotate(24)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
