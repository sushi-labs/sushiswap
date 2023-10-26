import { classNames } from '@sushiswap/ui'
import { FC } from 'react'

interface ProductBackground {
  color: string
  isCentered?: boolean
}

export const ProductBackground: FC<ProductBackground> = ({
  color,
  isCentered,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={classNames(
          'absolute w-[120vw] md:w-full aspect-[1/1] opacity-30 -z-[1]',
          isCentered ? '-top-[40vw]' : '-right-[35%] -top-[50vw]',
        )}
        style={{
          backgroundImage: `radial-gradient(50% 50% at 50% 45%, ${color} 0%, #0f172a 100%)`,
        }}
      />
      <div
        className="bg-orb absolute w-[120vw] md:w-full aspect-[1/1] opacity-10 -left-[40%] bottom-0 -z-[1]"
        style={{
          backgroundImage: `radial-gradient(50% 50% at 55% 45%, ${color} 0%, #0f172a 100%)`,
        }}
      />
    </div>
  )
}
