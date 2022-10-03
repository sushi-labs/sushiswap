import classNames from 'classnames'
import { FC } from 'react'

import { BackgroundVector } from './'

export const HomeBackground = () => {
  const Vector: FC<React.ComponentProps<'svg'>> = ({ className, ...rest }) => (
    <div className={classNames('absolute z-[-1] hidden sm:block max-w-[100vw] overflow-hidden', className)}>
      <BackgroundVector {...rest} />
    </div>
  )

  return (
    <>
      <div className="top-0 right-0 absolute z-[-1]">
        <svg width="100%" height="886" viewBox="0 0 915 886" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_223_706)">
            <circle cx="815.5" cy="70.5" r="215.5" fill="#3B7EF6" />
          </g>
          <defs>
            <filter
              id="filter0_f_223_706"
              x="0"
              y="-745"
              width="1631"
              height="1631"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="300" result="effect1_foregroundBlur_223_706" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="top-0 left-0 absolute z-[-1]">
        <svg width="100%" height="1486" viewBox="0 0 932 1486" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_223_707)">
            <circle cx="16.5" cy="570.5" r="215.5" fill="#F338C3" />
          </g>
          <defs>
            <filter
              id="filter0_f_223_707"
              x="-899"
              y="-345"
              width="1831"
              height="1831"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="350" result="effect1_foregroundBlur_223_707" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="right-0 bottom-0 absolute z-[-1]">
        <svg width="100%" height="1631" viewBox="0 0 944 1631" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.4" filter="url(#filter0_f_226_653)">
            <circle cx="815.5" cy="815.5" r="215.5" fill="#3B7EF6" />
          </g>
          <defs>
            <filter
              id="filter0_f_226_653"
              x="0"
              y="0"
              width="1631"
              height="1631"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="300" result="effect1_foregroundBlur_226_653" />
            </filter>
          </defs>
        </svg>
      </div>

      <Vector className="top-[133px] left-[-200px]" />
      <Vector className="top-[59%] left-0" />
      <Vector className="bottom-0 right-0" transform="scale(-1,1)" style={{ WebkitTransform: 'scale(-1,1)' }} />
    </>
  )
}
