import { Transition } from '@headlessui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { FC, forwardRef, Key } from 'react'
import ReactSlider, { ReactSliderProps } from 'react-slider'

const Track = (props: any) => {
  return (
    <div {...props} className={classNames(props.key === 'track-0' ? 'bg-blue/100' : 'bg-blue/30', 'h-2 rounded')} />
  )
}

const Thumb = (props: any) => {
  return (
    <div key={props.key}>
      <div className="absolute h-4 flex items-center justify-center w-4 -ml-2 top-0" style={{ left: props.style.left }}>
        <div className="z-40 min-w-full">
          <Transition
            show={props.style.willChange !== ''}
            enter="transition duration-75 ease-out"
            enterFrom="transform scale-50"
            enterTo="transform scale-100"
          >
            <div className="relative shadow">
              <div className="bg-blue -mt-10 text-white text-xs rounded-[6px] px-4 py-0.5 flex justify-center">
                {props['aria-valuenow']}
              </div>
              <svg
                className="absolute ml-2 text-blue w-full h-2 left-0 top-100"
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
      <div {...props} className="-mt-1 h-4 w-4 rounded-full bg-blue cursor-pointer outline-none" />
    </div>
  )
}

interface Slider extends ReactSliderProps {
  markFormatter(x?: Key | null): string
}

const Slider: FC<Slider> = forwardRef<ReactSlider, Slider>(({ markFormatter, ...props }, ref) => {
  return (
    <div className="relative w-full h-5">
      <ReactSlider
        {...props}
        ref={ref}
        renderThumb={Thumb}
        renderTrack={Track}
        renderMark={({ key, style }) => {
          return (
            <Typography style={style} variant="xxs" key={key} className="mt-4 text-secondary" component="span">
              {markFormatter(key)}
            </Typography>
          )
        }}
      />
    </div>
  )
})

export default Slider
