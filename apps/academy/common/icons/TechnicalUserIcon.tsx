import { FC } from 'react'

export const TechnicalUserIcon: FC<React.ComponentProps<'svg'>> = ({ className, ...props }) => {
  return (
    <svg
      width="125"
      height="130"
      viewBox="0 0 125 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19.932 3.97044e-05H72.0617C74.6807 -0.00519273 77.2749 0.506791 79.6955 1.50661C82.1161 2.50643 84.3155 3.97441 86.1674 5.8263C88.0193 7.6782 89.4873 9.87756 90.4871 12.2982C91.4869 14.7188 91.9989 17.313 91.9937 19.932V72.0617C91.9989 74.6807 91.4869 77.2749 90.4871 79.6955C89.4873 82.1161 88.0193 84.3155 86.1674 86.1674C84.3155 88.0193 82.1161 89.4873 79.6955 90.4871C77.2749 91.4869 74.6807 91.9989 72.0617 91.9937H19.932C17.313 91.9989 14.7188 91.4869 12.2982 90.4871C9.87756 89.4873 7.6782 88.0193 5.82631 86.1674C3.97441 84.3155 2.50644 82.1161 1.50661 79.6955C0.506793 77.2749 -0.00519173 74.6807 3.9689e-05 72.0617V19.932C0.00247748 14.6465 2.10323 9.5781 5.84067 5.84067C9.5781 2.10323 14.6465 0.00247749 19.932 3.97044e-05V3.97044e-05Z"
        fill="#48E389"
      />
      <g filter="url(#filter0_b_226_694)">
        <rect x="22.5801" y="22.3984" width="102.029" height="107.047" rx="12.5446" fill="white" fillOpacity="0.1" />
        <path
          d="M102.168 47.4878H45.0207C41.8782 47.4878 39.3057 49.6211 39.3057 52.2271V99.6173C39.3057 102.223 41.8782 104.357 45.0207 104.357H102.168C105.31 104.357 107.883 102.223 107.883 99.6173V52.2271C107.883 49.6211 105.31 47.4878 102.168 47.4878ZM63.3479 82.0498L59.307 85.4001L47.8778 75.9222L59.3105 66.4443L63.3505 69.7946L55.9588 75.9222L63.3479 82.0498ZM69.6622 97.248L64.1434 96.0211L77.5263 54.5964L83.045 55.8233L69.6622 97.248ZM87.878 85.4001L83.8379 82.0498L91.2297 75.9222L83.8405 69.7946L87.8814 66.4443L99.3106 75.9222L87.878 85.4001Z"
          fill="#F9FAFD"
        />
        <rect
          x="22.9982"
          y="22.8166"
          width="101.193"
          height="106.211"
          rx="12.1264"
          stroke="url(#paint0_linear_226_694)"
          strokeWidth="0.836306"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_226_694"
          x="0.836111"
          y="0.65447"
          width="145.517"
          height="150.535"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="10.872" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_226_694" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_226_694" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_226_694"
          x1="31.712"
          y1="22.3984"
          x2="80.4874"
          y2="85.1307"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
