import type { IconComponent } from '@sushiswap/ui'

export const LargeSushiIcon: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 699 761"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="large-sushi-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3B82F6">
            <animate
              attributeName="stop-color"
              values="#3B82F6;#8B5CF6;#EC4899;#3B82F6"
              dur="6s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#8B5CF6">
            <animate
              attributeName="stop-color"
              values="#8B5CF6;#EC4899;#3B82F6;#8B5CF6"
              dur="6s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#EC4899">
            <animate
              attributeName="stop-color"
              values="#EC4899;#3B82F6;#8B5CF6;#EC4899"
              dur="6s"
              repeatCount="indefinite"
            />
          </stop>

          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 0.5 0.5"
            to="360 0.5 0.5"
            dur="10s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <filter
          id="filter0_f_0_26"
          x="-2.47955e-05"
          y="5.72205e-06"
          width="937.111"
          height="870.71"
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
            stdDeviation="8.3"
            result="effect1_foregroundBlur_0_26"
          />
        </filter>
      </defs>

      <g filter="url(#filter0_f_0_26)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M712.935 371.259C722.773 393.118 725.341 412.416 715.503 425.706C706.089 438.984 686.837 442.855 663.297 440.707C620.916 437.272 565.281 414.127 511.353 375.543C457.426 336.947 417.626 291.506 400.931 252.485C391.517 230.626 388.949 211.328 398.362 198.038C407.788 184.748 427.04 180.888 451.005 182.612C492.938 186.471 549.021 209.192 602.512 247.788C656.439 286.372 696.239 332.238 712.935 371.259Z"
          fill="url(#large-sushi-gradient)"
          fillOpacity="0.11"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M908.87 432.66C906.531 425.876 903.842 418.982 900.813 412.003C865.726 330.539 783.121 234.073 670.554 153.045C557.575 72.4307 440.307 24.8414 351.717 17.547C287.516 12.4009 237.878 28.264 212.192 64.2749L35.4361 311.241C9.76288 347.251 10.611 399.55 36.2842 458.719C59.7644 512.547 103.599 572.917 163.245 630.944C195.594 662.294 230.269 691.156 266.967 717.251C379.522 798.279 497.226 845.443 585.817 853.163C649.581 858.309 699.656 842.445 725.341 806.435L901.673 559.469C924.317 527.706 926.328 483.284 908.882 432.648L908.87 432.66ZM877.272 541.469L875.988 543.605C855.028 570.623 815.215 579.616 764.705 575.769C680.404 568.911 568.697 523.021 461.279 445.853C353.849 368.685 274.673 277.366 240.858 199.336C220.746 153.033 216.457 112.301 235.721 83.5726L236.593 81.8613C257.13 53.1451 297.79 43.7025 349.148 47.9869C433.462 54.8443 545.156 100.722 652.586 177.89C760.428 255.058 839.616 346.39 873.431 423.994C893.543 471.159 897.82 513.166 877.272 541.469Z"
          fill="url(#large-sushi-gradient)"
          fillOpacity="0.11"
        />
      </g>
    </svg>
  )
}
