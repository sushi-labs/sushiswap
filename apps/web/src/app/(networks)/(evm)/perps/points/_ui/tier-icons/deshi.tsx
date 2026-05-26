import type { IconComponent } from '@sushiswap/ui'

export const DeshiIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 67 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_dn_65_3)">
        <g clipPath="url(#clip0_65_3)">
          <rect
            x="3.3335"
            width="60"
            height="60"
            rx="30"
            fill="url(#paint0_linear_65_3)"
          />

          <g filter="url(#filter1_iin_65_3)">
            <circle
              cx="33.3335"
              cy="30"
              r="28.5"
              stroke="url(#paint1_linear_65_3)"
              strokeWidth="3"
            />
          </g>

          <g transform="translate(18 18) scale(1.1)">
            <g filter="url(#filter2_di_65_9)">
              <path
                d="M5.00019 25.2601H22.5002C21.8313 22.3778 20.863 21.3601 18.0002 20.7601C17.2262 18.6394 16.32 18.0202 14.0002 17.7601V11.2601L16.0002 7.76006C17.4197 5.73202 18.5076 5.16598 20.5002 4.26006C17.9806 6.08855 16.0002 8.76006 16.5 9.59887C16.9998 10.4377 19.0002 10.2601 19.0002 10.2601C19.0002 10.2601 22.8509 9.06726 24.5002 7.26006C26.4569 5.11592 27.0004 0.42125 27.0002 0.260058C27 0.0988665 20.3157 -0.725945 17.5002 1.76006C15.5364 3.49401 14.3749 5.46798 14.5002 7.76006C14.5002 7.76006 13.6912 10.5989 13.1914 10.2601C12.6916 9.92125 12.5002 8.76006 12.5002 8.76006C12.5002 8.76006 13.7701 7.68955 12.5001 5.76006C11.2301 3.83056 10.1868 2.44119 8.00019 1.26006C5.22999 -0.236286 2.8671 0.0182686 0.000194197 0.260058C-0.0104326 3.86597 0.405986 7.10428 3.50019 9.26006C6.08354 11.0599 11.5002 10.2601 11.5002 10.2601C11.5002 10.2601 12.3674 10.9716 12.5002 11.7601V17.7601C10.4488 18.2847 9.73541 18.9935 9.00019 20.7601C5.81348 21.388 5.08947 22.4812 5.00019 25.2601Z"
                fill="url(#paint2_linear_65_9)"
              />
            </g>
          </g>
        </g>
      </g>

      <defs>
        <filter
          id="filter0_dn_65_3"
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
            result="effect1_dropShadow_65_3"
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
          <feMerge result="effect2_noise_65_3">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
          <feBlend
            mode="normal"
            in="effect2_noise_65_3"
            in2="effect1_dropShadow_65_3"
            result="effect2_noise_65_3"
          />
        </filter>

        <filter
          id="filter1_iin_65_3"
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
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_65_3"
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
            in2="effect1_innerShadow_65_3"
            result="effect2_innerShadow_65_3"
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
            in2="effect2_innerShadow_65_3"
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
          <feMerge result="effect3_noise_65_3">
            <feMergeNode in="effect2_innerShadow_65_3" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>

        <filter
          id="filter2_di_65_9"
          x="0"
          y="0"
          width="27.68"
          height="26.0101"
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
          <feOffset dx="0.68" dy="0.75" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_65_9"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_65_9"
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
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_65_9"
          />
        </filter>

        <linearGradient
          id="paint0_linear_65_3"
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
          id="paint1_linear_65_3"
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
          id="paint2_linear_65_9"
          x1="-4"
          y1="-4.40114"
          x2="25.5"
          y2="31.5989"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#381705" />
          <stop offset="0.5" stopColor="#946C37" />
          <stop offset="1" stopColor="#552910" />
        </linearGradient>

        <clipPath id="clip0_65_3">
          <rect x="3.3335" width="60" height="60" rx="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
