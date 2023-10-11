import NextImage from 'next/legacy/image'

import bg from '../assets/bg.png'

export const HomeBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <NextImage
        className="-z-[1]"
        layout="responsive"
        src={bg}
        alt="Academy Background"
        priority
        unoptimized
      />
    </div>
  )
}
