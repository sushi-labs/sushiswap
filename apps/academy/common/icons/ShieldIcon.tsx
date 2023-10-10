export const ShieldIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg
      width="102"
      height="102"
      viewBox="0 0 102 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_b_1794_2166)">
        <rect
          width="102"
          height="102"
          rx="12.5446"
          fill="white"
          fillOpacity="0.1"
        />
        <g clipPath="url(#clip0_1794_2166)">
          <path
            d="M51 18.917L24.75 30.5837V48.0837C24.75 64.2712 35.95 79.4087 51 83.0837C66.05 79.4087 77.25 64.2712 77.25 48.0837V30.5837L51 18.917ZM51 50.9712H71.4167C69.8708 62.9878 61.85 73.692 51 77.0462V51.0003H30.5833V34.3753L51 25.3045V50.9712Z"
            fill="white"
          />
        </g>
        <rect
          x="0.418153"
          y="0.418153"
          width="101.164"
          height="101.164"
          rx="12.1264"
          stroke="url(#paint0_linear_1794_2166)"
          strokeWidth="0.836306"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_1794_2166"
          x="-21.744"
          y="-21.744"
          width="145.488"
          height="145.488"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10.872" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1794_2166"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1794_2166"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1794_2166"
          x1="9.12934"
          y1="-9.36905e-07"
          x2="55.009"
          y2="61.91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_1794_2166">
          <rect
            width="70"
            height="70"
            fill="white"
            transform="translate(16 16)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
