import React, { FC } from 'react'

type BackgroundVector = Omit<React.ComponentProps<'svg'>, 'width'> & {
  width: string | number
}

export const BackgroundVector: FC<BackgroundVector> = (props) => {
  return (
    <svg viewBox="0 0 1437 459" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity={0.3} strokeLinecap="round">
        <path
          d="M1164.62-184.379c-21.13 14.864-66.6 58.682-79.37 115.042l-44.76 239.982"
          stroke="url(#paint0_linear_2083_2285)"
        />
        <path
          d="M1173.12-188.25c-21.19 13.437-67.42 54.084-82.8 109.166l-56.18 235.133"
          stroke="url(#paint1_linear_2083_2285)"
        />
        <path
          d="M1181.11-191.75c-21.16 12.032-67.94 49.513-85.77 103.177l-67.03 229.654"
          stroke="url(#paint2_linear_2083_2285)"
        />
        <path
          d="M1188.56-194.914c-21.03 10.653-68.14 44.989-88.29 97.105l-77.26 223.588"
          stroke="url(#paint3_linear_2083_2285)"
        />
        <path
          d="M1285.86-228.746c-29.6 4.524-159.13 50.176-180.75 121.947l-86.88 216.978"
          stroke="url(#paint4_linear_2083_2285)"
        />
        <path
          d="M1288.13-230.016c-22.73 8.09-156.84 51.211-178.29 114.465L1013.99 94.32"
          stroke="url(#paint5_linear_2083_2285)"
        />
        <path
          d="M1285.87-227.363c-21.4 3.271-147.28 48.367-171.41 103.291L1010.29 78.241"
          stroke="url(#paint6_linear_2083_2285)"
        />
        <path
          d="M1286.76-229.807c-19.77 5.52-139.98 52.596-167.82 97.436L1007.12 61.977"
          stroke="url(#paint7_linear_2083_2285)"
        />
        <path
          d="M1289.06-228.311c-19.29 4.358-136.42 45.047-165.79 87.853L1004.48 45.568"
          stroke="url(#paint8_linear_2083_2285)"
        />
        <path
          d="M1289.02-231.999c-18.75 3.253-130.83 42.947-161.56 83.655L1002.37 29.049"
          stroke="url(#paint9_linear_2083_2285)"
        />
        <path
          d="M1288.12-230.477c-18.15 2.209-124.7 35.879-156.64 74.438L1000.77 12.458"
          stroke="url(#paint10_linear_2083_2285)"
        />
        <path
          d="M999.868 74.018c3.692 23.678 22.602 77.135 68.702 101.538l200.88 94.564"
          stroke="url(#paint11_linear_2083_2285)"
        />
        <path
          d="M1000.33 64.946c2.35 23.429 17.96 76.95 61.64 103.607l190.95 104.615"
          stroke="url(#paint12_linear_2083_2285)"
        />
        <path
          d="M1000.89 56.454c1.07 23.096 13.49 76.472 54.68 105.213l180.71 113.97"
          stroke="url(#paint13_linear_2083_2285)"
        />
        <path
          d="M1001.52 48.542c-.16 22.684 9.19 75.715 47.85 106.369l170.21 122.613"
          stroke="url(#paint14_linear_2083_2285)"
        />
        <path
          d="M1002.16 41.21c-1.3 22.2 5.1 74.696 41.19 107.09l159.52 130.533"
          stroke="url(#paint15_linear_2083_2285)"
        />
        <path
          d="M1002.79 34.452c-2.38 21.647 1.22 73.43 34.71 107.391l148.66 137.724"
          stroke="url(#paint16_linear_2083_2285)"
        />
        <path
          d="M1003.37 28.26c-3.383 21.034-2.43 71.939 28.44 107.291l137.7 144.184"
          stroke="url(#paint17_linear_2083_2285)"
        />
        <path
          d="M1003.87 22.627c-4.314 20.365-5.867 70.237 22.39 106.808l126.68 149.911"
          stroke="url(#paint18_linear_2083_2285)"
        />
        <path
          d="M1004.24 17.54c-5.152 19.646-9.048 68.344 16.6 105.962l115.65 154.909"
          stroke="url(#paint19_linear_2083_2285)"
        />
        <path
          d="M1004.47 12.982c-5.918 18.886-11.993 66.283 11.06 104.779l104.66 159.182"
          stroke="url(#paint20_linear_2083_2285)"
        />
        <path
          d="M1004.52 8.94c-6.602 18.09-14.687 64.071 5.8 103.278l93.75 162.743"
          stroke="url(#paint21_linear_2083_2285)"
        />
        <path
          d="M1151.13 291.139c23.55 2.103 82.01-3.307 127.4-41.774l172.59-156.12"
          stroke="url(#paint22_linear_2083_2285)"
        />
        <path
          d="M1143.05 288.527c22.65 3.338 79.51 1.113 125.76-34.488l182.42-149.73"
          stroke="url(#paint23_linear_2083_2285)"
        />
        <path
          d="M1135.54 285.959c21.71 4.493 76.84 5.3 123.76-27.416l194.73-146.419"
          stroke="url(#paint24_linear_2083_2285)"
        />
        <path
          d="M1128.6 283.472c20.72 5.566 74 9.242 121.41-20.583l197.41-134.273"
          stroke="url(#paint25_linear_2083_2285)"
        />
        <path
          d="M1122.2 281.103c19.7 6.554 71.03 12.928 118.74-14.009l199.33-122.103"
          stroke="url(#paint26_linear_2083_2285)"
        />
        <path
          d="M1116.32 278.885c18.66 7.457 67.93 16.354 115.78-7.713l200.5-109.957"
          stroke="url(#paint27_linear_2083_2285)"
        />
        <path
          d="M1110.94 276.851c17.59 8.272 64.73 19.511 112.55-1.712l200.95-97.885"
          stroke="url(#paint28_linear_2083_2285)"
        />
        <path
          d="M1106.02 275.03c16.51 9.001 61.46 22.398 109.09 3.981l200.7-85.932"
          stroke="url(#paint29_linear_2083_2285)"
        />
        <path
          d="M1101.54 273.453c15.44 9.642 58.14 25.01 105.43 9.351l199.77-74.143"
          stroke="url(#paint30_linear_2083_2285)"
        />
        <path
          d="M1103.15 275.251c14.35 10.196 49.1 24.241 95.9 11.282l198.2-62.559"
          stroke="url(#paint31_linear_2083_2285)"
        />
        <path
          d="M1104.52 275.965c13.29 10.663 40.68 24.576 86.85 14.25l196.01-51.222"
          stroke="url(#paint32_linear_2083_2285)"
        />
        <path
          d="M1424.74 190.613c13.75-22.094 38.13-79.496 25.69-132.35l-62.2-220.633"
          stroke="url(#paint33_linear_2083_2285)"
        />
        <path
          d="M1418.29 197.741c14.43-20.931 40.93-76.038 31.54-129.022l-49.13-221.832"
          stroke="url(#paint34_linear_2083_2285)"
        />
        <path
          d="M1412.17 204.323c15.01-19.743 43.42-72.461 37.01-125.39l-36.34-222.241"
          stroke="url(#paint35_linear_2083_2285)"
        />
        <path
          d="M1406.41 210.384c15.5-18.538 45.61-68.788 42.09-121.487l-23.87-221.882"
          stroke="url(#paint36_linear_2083_2285)"
        />
        <path
          d="M1401.03 215.954c15.89-17.321 47.49-65.039 46.77-117.34l-11.76-220.783"
          stroke="url(#paint37_linear_2083_2285)"
        />
        <path
          d="M1396.05 221.063c16.19-16.102 49.07-61.24 51.05-112.98l-.06-218.975"
          stroke="url(#paint38_linear_2083_2285)"
        />
        <path
          d="M1391.48 225.741c16.41-14.885 50.36-57.412 54.93-108.436l11.22-216.49"
          stroke="url(#paint39_linear_2083_2285)"
        />
        <path
          d="M1387.35 230.021c16.53-13.678 51.35-53.575 58.4-103.74l22.04-213.36"
          stroke="url(#paint40_linear_2083_2285)"
        />
        <path
          d="M1383.66 233.936c16.57-12.487 52.08-49.752 61.47-98.921l32.38-209.624"
          stroke="url(#paint41_linear_2083_2285)"
        />
        <path
          d="M1380.42 237.519c16.54-11.317 52.53-45.962 64.16-94.009l42.19-205.317"
          stroke="url(#paint42_linear_2083_2285)"
        />
        <path
          d="M1377.64 240.806c16.44-10.175 52.73-42.226 66.45-89.033l48.44-199.69"
          stroke="url(#paint43_linear_2083_2285)"
        />
        <path
          d="M1470.65-99.668c-13.08-18.732-52.87-56.581-107.4-58.117l-232.9 3.392"
          stroke="url(#paint44_linear_2083_2285)"
        />
        <path
          d="M1473.84-91.7c-11.67-19.085-48.29-58.376-101.37-62.86l-227.29-9.392"
          stroke="url(#paint45_linear_2083_2285)"
        />
      </g>
      <mask
        id="a"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        x={-27}
        y={-510}
        width={1200}
        height={1086}
      >
        <path
          transform="rotate(-124.216 314.121 575.876)"
          fill="#C4C4C4"
          d="M314.121 575.876H920.562V1614.336H314.121z"
        />
      </mask>
      <g opacity={0.3} strokeLinecap="round" mask="url(#a)">
        <path
          d="M-101.077-73.28C-86.814-28.48-34.1 72.6 62.649 118.527l418.062 177.846"
          stroke="url(#paint46_linear_2083_2285)"
        />
        <path
          d="M-102.919-90.632c11.721 44.4 58.585 145.786 152.266 196.137l405.93 197.529"
          stroke="url(#paint47_linear_2083_2285)"
        />
        <path
          d="M-104.393-106.873C-95.264-62.56-54.521 39.794 35.424 94.715l390.894 217.689"
          stroke="url(#paint48_linear_2083_2285)"
        />
        <path
          d="M-105.572-122.004C-98.993-78.625-64.526 22.731 20.713 81.135L392.28 314.656"
          stroke="url(#paint49_linear_2083_2285)"
        />
        <path
          d="M-106.92-316.42C-117.376-259.591-114.427-.527 6.883 68.524L359.84 317.25"
          stroke="url(#paint50_linear_2083_2285)"
        />
        <path
          d="M-107.858-321.144c.67 45.481-4.089 312.051 101.292 377.353l333.821 262.54"
          stroke="url(#paint51_linear_2083_2285)"
        />
        <path
          d="M-104.305-315.89c-7.561 41.092-3.325 293.162 84.648 360.1l314.254 274.952"
          stroke="url(#paint52_linear_2083_2285)"
        />
        <path
          d="M-108.341-318.523c-2.279 38.967 9.324 281.29 75.926 351.066l294.351 285.965"
          stroke="url(#paint53_linear_2083_2285)"
        />
        <path
          d="M-104.05-322.186c-4.158 37.598-2.608 271.622 59.186 343.415L229.34 316.811"
          stroke="url(#paint54_linear_2083_2285)"
        />
        <path
          d="M-111.021-323.599c-5.892 36.148-2.98 260.393 53.988 333.879l253.908 303.816"
          stroke="url(#paint55_linear_2083_2285)"
        />
        <path
          d="M-108.729-321.321c-7.478 34.628-12.365 246.171 39.782 321.03l233.549 310.686"
          stroke="url(#paint56_linear_2083_2285)"
        />
        <path
          d="M279.964 336.833c46.962 2.661 159.764-10.981 235.275-86.832L822.108-85.257"
          stroke="url(#paint57_linear_2083_2285)"
        />
        <path
          d="M263.175 332.321c45.629 5.064 156.438-2.419 234.639-72.862L817.248-53.299"
          stroke="url(#paint58_linear_2083_2285)"
        />
        <path
          d="M247.543 327.859c44.177 7.318 152.666 5.707 233.201-59.28L811.232-21.39"
          stroke="url(#paint59_linear_2083_2285)"
        />
        <path
          d="M233.042 323.519c42.621 9.417 148.491 13.375 231.004-46.133L804.084 10.394"
          stroke="url(#paint60_linear_2083_2285)"
        />
        <path
          d="M219.731 319.337c41.263 11.237 145.044 20.116 230.065-34.272l351.81-245.448"
          stroke="url(#paint61_linear_2083_2285)"
        />
        <path
          d="M207.32 315.483c39.986 13.141 141.816 27.005 229.247-22.667L799.678 67.091"
          stroke="url(#paint62_linear_2083_2285)"
        />
        <path
          d="M196.031 311.916c38.47 15.043 137.666 33.942 226.691-10.805L793.669 96.029"
          stroke="url(#paint63_linear_2083_2285)"
        />
        <path
          d="M185.738 308.731c36.536 16.562 131.976 39.929 221.446.903l373.95-180.728"
          stroke="url(#paint64_linear_2083_2285)"
        />
        <path
          d="M176.397 305.985c34.643 17.831 126.451 45.027 216.541 11.157l377.71-158.721"
          stroke="url(#paint65_linear_2083_2285)"
        />
        <path
          d="M167.962 303.726c32.209 18.846 118.749 49.6 207.234 21.857l371.962-132.308"
          stroke="url(#paint66_linear_2083_2285)"
        />
        <path
          d="M160.383 302.006c29.836 19.549 111.251 53.07 198.225 30.769l366.597-108.744"
          stroke="url(#paint67_linear_2083_2285)"
        />
        <path
          d="M785.845 143.074c19.059-42.919 46.338-153.716 2.991-253.545L605.441-493.998"
          stroke="url(#paint68_linear_2083_2285)"
        />
        <path
          d="M775.744 157.047c20.806-40.748 53.067-147.31 15.665-247.577L626.353-489.761"
          stroke="url(#paint69_linear_2083_2285)"
        />
        <path
          d="M766.098 169.959c22.374-38.523 59.238-140.657 27.698-241.009L642.865-491.816"
          stroke="url(#paint70_linear_2083_2285)"
        />
        <path
          d="M756.965 181.858c23.762-36.258 64.842-133.8 39.061-233.895L669.689-472.903"
          stroke="url(#paint71_linear_2083_2285)"
        />
        <path
          d="M748.4 192.799c24.971-33.969 69.877-126.784 49.733-226.295L695.946-453.029"
          stroke="url(#paint72_linear_2083_2285)"
        />
        <path
          d="M740.452 202.836c26.002-31.666 74.343-119.65 59.694-218.263l-78.561-416.826"
          stroke="url(#paint73_linear_2083_2285)"
        />
        <path
          d="M733.167 212.027c26.857-29.363 78.243-112.443 68.931-209.858l-55.537-412.801"
          stroke="url(#paint74_linear_2083_2285)"
        />
        <path
          d="M726.587 220.433c27.539-27.073 81.581-105.203 77.432-201.136l-33.187-407.523"
          stroke="url(#paint75_linear_2083_2285)"
        />
        <path
          d="M720.748 228.117c28.054-24.808 84.368-97.971 85.192-192.156l-11.577-401.059"
          stroke="url(#paint76_linear_2083_2285)"
        />
        <path
          d="M725.163 225.857c28.406-22.58 77.132-81.501 82.727-173.69l9.23-393.476"
          stroke="url(#paint77_linear_2083_2285)"
        />
        <path
          d="M727.389 223.588c28.599-20.399 72.359-65.701 82.511-155.66l29.179-384.853"
          stroke="url(#paint78_linear_2083_2285)"
        />
        <path
          d="M254.639-607.896c-43.664 16.767-140.453 75.482-178.302 176.2L-66.572 2.472"
          stroke="url(#paint79_linear_2083_2285)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2083_2285"
          x1={1052.69}
          y1={8.29141}
          x2={1156.63}
          y2={-7.74845}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2083_2285"
          x1={1054.72}
          y1={-4.13174}
          x2={1155.84}
          y2={-13.6938}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2083_2285"
          x1={1056.92}
          y1={-16.4425}
          x2={1154.87}
          y2={-20.0105}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2083_2285"
          x1={1059.28}
          y1={-28.6281}
          x2={1153.79}
          y2={-26.6876}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_2083_2285"
          x1={1081.19}
          y1={-54.5228}
          x2={1224.05}
          y2={-43.5631}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_2083_2285"
          x1={1083.55}
          y1={-67.2841}
          x2={1218.65}
          y2={-49.3821}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_2083_2285"
          x1={1085.08}
          y1={-77.7967}
          x2={1210.32}
          y2={-54.2174}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_2083_2285"
          x1={1087.79}
          y1={-90.5614}
          x2={1204.71}
          y2={-61.9877}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_2083_2285"
          x1={1090.77}
          y1={-101.185}
          x2={1200.96}
          y2={-67.9946}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_2083_2285"
          x1={1093.89}
          y1={-113.92}
          x2={1195.5}
          y2={-77.4233}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_2083_2285"
          x1={1096.48}
          y1={-123.795}
          x2={1190.41}
          y2={-84.4622}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_2083_2285"
          x1={1124.94}
          y1={223.684}
          x2={1131.66}
          y2={117.633}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_2083_2285"
          x1={1114.4}
          y1={219.074}
          x2={1127.33}
          y2={115.613}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_2083_2285"
          x1={1104.05}
          y1={214.316}
          x2={1122.97}
          y2={113.895}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_2083_2285"
          x1={1093.9}
          y1={209.424}
          x2={1118.55}
          y2={112.488}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint15_linear_2083_2285"
          x1={1083.94}
          y1={204.415}
          x2={1114.01}
          y2={111.395}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint16_linear_2083_2285"
          x1={1074.18}
          y1={199.302}
          x2={1109.3}
          y2={110.609}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_2083_2285"
          x1={1064.63}
          y1={194.102}
          x2={1104.38}
          y2={110.112}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_2083_2285"
          x1={1055.27}
          y1={188.831}
          x2={1099.18}
          y2={109.879}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_2083_2285"
          x1={1046.13}
          y1={183.504}
          x2={1093.68}
          y2={109.874}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint20_linear_2083_2285"
          x1={1037.18}
          y1={178.137}
          x2={1087.84}
          y2={110.053}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint21_linear_2083_2285"
          x1={1028.43}
          y1={172.744}
          x2={1081.62}
          y2={110.366}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint22_linear_2083_2285"
          x1={1342.24}
          y1={213.172}
          x2={1261.33}
          y2={165.473}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint23_linear_2083_2285"
          x1={1336.24}
          y1={219.72}
          x2={1258.86}
          y2={168.688}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint24_linear_2083_2285"
          x1={1331.78}
          y1={224.527}
          x2={1257.98}
          y2={170.369}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint25_linear_2083_2285"
          x1={1322.22}
          y1={233.118}
          x2={1253.25}
          y2={176.982}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint26_linear_2083_2285"
          x1={1312.66}
          y1={241.49}
          x2={1248.46}
          y2={183.673}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint27_linear_2083_2285"
          x1={1303.1}
          y1={249.645}
          x2={1243.61}
          y2={190.427}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint28_linear_2083_2285"
          x1={1293.56}
          y1={257.584}
          x2={1238.74}
          y2={197.236}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint29_linear_2083_2285"
          x1={1284.06}
          y1={265.31}
          x2={1233.83}
          y2={204.093}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint30_linear_2083_2285"
          x1={1274.6}
          y1={272.829}
          x2={1228.91}
          y2={210.996}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint31_linear_2083_2285"
          x1={1267.24}
          y1={280.228}
          x2={1227.9}
          y2={220.865}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint32_linear_2083_2285"
          x1={1260.07}
          y1={287.127}
          x2={1226.14}
          y2={229.731}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint33_linear_2083_2285"
          x1={1447.63}
          y1={-21.4021}
          x2={1359.88}
          y2={45.9733}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint34_linear_2083_2285"
          x1={1451.13}
          y1={-10.1154}
          x2={1361.94}
          y2={49.5324}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint35_linear_2083_2285"
          x1={1454.41}
          y1={1.15944}
          x2={1364.48}
          y2={53.2024}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint36_linear_2083_2285"
          x1={1457.48}
          y1={12.4043}
          x2={1367.49}
          y2={57.0421}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint37_linear_2083_2285"
          x1={1460.35}
          y1={23.6072}
          x2={1370.92}
          y2={61.1075}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint38_linear_2083_2285"
          x1={1463.02}
          y1={34.7513}
          x2={1374.73}
          y2={65.4387}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint39_linear_2083_2285"
          x1={1465.5}
          y1={45.8228}
          x2={1378.86}
          y2={70.0679}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint40_linear_2083_2285"
          x1={1467.81}
          y1={56.8084}
          x2={1383.26}
          y2={75.0163}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint41_linear_2083_2285"
          x1={1469.95}
          y1={67.6956}
          x2={1387.89}
          y2={80.2954}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint42_linear_2083_2285"
          x1={1471.93}
          y1={78.4725}
          x2={1392.68}
          y2={85.9074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint43_linear_2083_2285"
          x1={1471.37}
          y1={89.6828}
          x2={1397.01}
          y2={92.3371}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint44_linear_2083_2285"
          x1={1289.24}
          y1={-175.33}
          x2={1323.84}
          y2={-81.1442}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint45_linear_2083_2285"
          x1={1301.32}
          y1={-175.809}
          x2={1330.18}
          y2={-81.7256}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint46_linear_2083_2285"
          x1={186.436}
          y1={209.305}
          x2={198.03}
          y2={10.2897}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint47_linear_2083_2285"
          x1={167.447}
          y1={201.057}
          x2={189.918}
          y2={8.23012}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint48_linear_2083_2285"
          x1={147.025}
          y1={195.473}
          x2={180.046}
          y2={7.28924}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint49_linear_2083_2285"
          x1={124.731}
          y1={185.13}
          x2={167.118}
          y2={5.13766}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint50_linear_2083_2285"
          x1={90.0035}
          y1={134.008}
          x2={170.365}
          y2={-136.537}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint51_linear_2083_2285"
          x1={67.4815}
          y1={124.491}
          x2={159.146}
          y2={-129.717}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint52_linear_2083_2285"
          x1={48.6633}
          y1={117.418}
          x2={148.459}
          y2={-116.464}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint53_linear_2083_2285"
          x1={26.3598}
          y1={107.248}
          x2={133.695}
          y2={-109.163}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint54_linear_2083_2285"
          x1={8.26524}
          y1={97.4251}
          x2={123.128}
          y2={-104.383}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint55_linear_2083_2285"
          x1={-13.7188}
          y1={86.5034}
          x2={105.221}
          y2={-97.2869}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint56_linear_2083_2285"
          x1={-30.6555}
          y1={77.718}
          x2={91.7269}
          y2={-89.7073}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint57_linear_2083_2285"
          x1={642.017}
          y1={164.609}
          x2={455.766}
          y2={87.3465}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint58_linear_2083_2285"
          x1={626.578}
          y1={182.338}
          x2={449.737}
          y2={96.6315}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint59_linear_2083_2285"
          x1={610.982}
          y1={199.659}
          x2={443.915}
          y2={106.324}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint60_linear_2083_2285"
          x1={595.258}
          y1={216.564}
          x2={438.269}
          y2={116.437}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint61_linear_2083_2285"
          x1={582.762}
          y1={231.69}
          x2={436.184}
          y2={124.714}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint62_linear_2083_2285"
          x1={571.243}
          y1={246.492}
          x2={433.691}
          y2={133.286}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint63_linear_2083_2285"
          x1={557.964}
          y1={262.078}
          x2={429.176}
          y2={143.761}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint64_linear_2083_2285"
          x1={541.311}
          y1={278.489}
          x2={423.442}
          y2={156.736}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint65_linear_2083_2285"
          x1={526.188}
          y1={293.024}
          x2={419.206}
          y2={168.707}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint66_linear_2083_2285"
          x1={504.542}
          y1={309.396}
          x2={409.409}
          y2={184.763}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint67_linear_2083_2285"
          x1={484.21}
          y1={323.466}
          x2={400.692}
          y2={199.623}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint68_linear_2083_2285"
          x1={761.514}
          y1={-243.431}
          x2={625.439}
          y2={-106.654}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint69_linear_2083_2285"
          x1={770.002}
          y1={-229.649}
          x2={627.999}
          y2={-102.223}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint70_linear_2083_2285"
          x1={776.194}
          y1={-219.422}
          x2={628.887}
          y2={-101.573}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint71_linear_2083_2285"
          x1={786.247}
          y1={-198.207}
          x2={636.798}
          y2={-91.9237}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint72_linear_2083_2285"
          x1={795.882}
          y1={-177.062}
          x2={645.096}
          y2={-82.1877}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint73_linear_2083_2285"
          x1={805.113}
          y1={-156.016}
          x2={653.768}
          y2={-72.3442}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint74_linear_2083_2285"
          x1={813.95}
          y1={-135.097}
          x2={662.8}
          y2={-62.3743}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint75_linear_2083_2285"
          x1={822.41}
          y1={-114.33}
          x2={672.177}
          y2={-52.2589}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint76_linear_2083_2285"
          x1={830.511}
          y1={-93.74}
          x2={681.884}
          y2={-41.9795}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint77_linear_2083_2285"
          x1={839.728}
          y1={-77.0858}
          x2={700.04}
          y2={-37.162}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint78_linear_2083_2285"
          x1={848.12}
          y1={-60.9742}
          x2={715.981}
          y2={-31.2066}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
        <linearGradient
          id="paint79_linear_2083_2285"
          x1={-4.15138}
          y1={-301.217}
          x2={195.955}
          y2={-306.286}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" stopOpacity={0.67} />
          <stop offset={0.520833} stopColor="#1494F2" stopOpacity={0.829844} />
          <stop offset={1} stopColor="#004DA8" />
        </linearGradient>
      </defs>
    </svg>
  )
}
