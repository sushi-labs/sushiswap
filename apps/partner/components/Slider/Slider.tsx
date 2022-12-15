import { Transition } from '@headlessui/react'
import { classNames, Typography } from '@sushiswap/ui'
import { FC, forwardRef, Key } from 'react'
import ReactSlider, { ReactSliderProps } from 'react-slider'

const Track: React.ComponentProps<typeof ReactSlider>['renderTrack'] = (props) => (
  <div {...props} className={classNames(props.key === 'track-0' ? 'bg-blue/100' : 'bg-blue/30', 'h-2 rounded')} />
)

const Thumb: React.ComponentProps<typeof ReactSlider>['renderThumb'] = (props) => (
  <div key={props.key}>
    <div className="absolute top-0 flex items-center justify-center w-4 h-4 -ml-2" style={{ left: props?.style?.left }}>
      <div className="z-40 min-w-full">
        <Transition
          show={props?.style?.willChange !== ''}
          enter="transition duration-75 ease-out"
          enterFrom="transform scale-50"
          enterTo="transform scale-100"
        >
          <div className="relative shadow">
            <div className="bg-blue -mt-10 text-white text-xs rounded-[6px] px-4 py-0.5 flex justify-center">
              {props['aria-valuenow']}
            </div>
            <svg
              className="absolute left-0 w-full h-2 ml-2 text-blue top-100"
              x="0px"
              y="0px"
              viewBox="0 0 255 255"
              xmlSpace="preserve"
            >
              <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
            </svg>
          </div>
        </Transition>
      </div>
    </div>
    <div {...props} className="w-4 h-4 -mt-1 rounded-full outline-none cursor-pointer bg-blue" />
  </div>
)

interface Slider extends ReactSliderProps {
  markFormatter(x?: Key | null): string
}

export const Slider: FC<Slider> = forwardRef<ReactSlider, Slider>(({ markFormatter, ...props }, ref) => {
  return (
    <div className="relative w-full h-5">
      <ReactSlider
        {...props}
        ref={ref}
        renderThumb={Thumb}
        renderTrack={Track}
        renderMark={({ key, style }) => {
          return (
            <Typography style={style} variant="xxs" key={key} className="mt-4 text-secondary" as="span">
              {markFormatter(key)}
            </Typography>
          )
        }}
      />
    </div>
  )
})
